import { t } from "i18next";
import {MicantoPlayer} from "../services/MicantoPlayer";
import {AndroidAutoContentStyle} from "react-native-track-player";
import {MicantoApi} from "../api/MicantoApi";
import {getHost, getToken} from "../services/StorageService";
import {arrToComma, reorderArr, toTrackPlayerObject} from "../utils/helper";
import {Alert, NativeModules} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export let browseTree = { '/': [] }
let historyRefreshDebounce = 0
let currentContext = {};

export const updateAndroidAutoBrowseTree = (newContent) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    browseTree = {
        ...browseTree,
        ...newContent
    }
    MicantoPlayer.setBrowseTree(browseTree)
}

export const registerAndroidAutoModule = () => {
    const defaultBrowseTree = {
        '/': [
            {
                mediaId: 'LatestTab',
                title: t('auto.tabs.latest.title'),
                playable: '1'
            },
            {
                mediaId: 'LibraryTab',
                title: t('auto.tabs.library.title'),
                playable: '1'
            }
        ],
        LibraryTab: [
            {
                mediaId: 'Playlists',
                title: t('screens.library.playlists'),
                playable: '1',
            },
            {
                mediaId: 'Artists',
                title: t('screens.library.artists'),
                playable: '1',
            },
            {
                mediaId: 'Albums',
                title: t('screens.library.albums'),
                playable: '1',
            }
        ]
    }
    updateAndroidAutoBrowseTree(defaultBrowseTree)
    MicantoPlayer.setBrowseTreeStyle(AndroidAutoContentStyle.CategoryList, AndroidAutoContentStyle.List)
}

export const requestDrawOverAppsPermission = async () => {
    return new Promise((resolve) => {
        const { MCAndroidAutoModule } = NativeModules;
        MCAndroidAutoModule.getDrawOverAppsPermission().then(async (enabled) => {
            const drawOverAppsPermissionAsked = await AsyncStorage.getItem('DRAW_OVER_APPS_PERMISSION_ASKED_2')

            if (enabled || drawOverAppsPermissionAsked) {
                resolve()
                return
            } else {
                await AsyncStorage.setItem('DRAW_OVER_APPS_PERMISSION_ASKED_2', 'TRUE')
                Alert.alert(t('alert.permissions.drawOverApps.title'), t('alert.permissions.drawOverApps.body'), [
                    {
                        text: t('alert.cancel'),
                        style: 'cancel',
                        onPress: () => {
                            resolve()
                        }
                    },
                    {
                        text: t('alert.ok'),
                        onPress: () => {
                            MCAndroidAutoModule.askDrawOverAppsPermission()
                            setTimeout(() => {
                                resolve()
                            }, 3000)
                        }
                    }
                ])
            }
        })
    })
}

export const handleAABrowseMediaId = async (mediaId) => {

    switch(mediaId) {
        case 'Playlists':
            await handlePlaylists(mediaId);
            break;
        case 'Artists':
            await handleArtists(mediaId);
            break;
        case 'LatestTab':
            currentContext = {'type': 'lastPlayed'}
            break;
    }

    if (mediaId.startsWith('playlist-')) {
        await handlePlaylist(mediaId);
    }
}

async function handleArtists(mediaId) {
    if (browseTree[mediaId] === undefined) {
        const {data: artists} = await MicantoApi.getArtists(1);

        updateAndroidAutoBrowseTree({
            [mediaId]: artists.map((artist) => {
                return {
                    title: artist.name,
                    playable: '1',
                    iconUri: artist.image || undefined,
                    mediaId: `artist-${artist.id}`
                }
            })
        })
    }
}

async function handlePlaylists(mediaId) {
    // just in case it is empty...
    if (browseTree[mediaId] === undefined) {
        let playlists = await MicantoApi.getPlaylists();
        updateAndroidAutoBrowseTree({
            [mediaId]: playlists.map((playlist) => {
                return {
                    title: playlist.name,
                    playable: '1',
                    iconUri: playlist.cover || undefined,
                    mediaId: `playlist-${playlist.id}`
                }
            })
        })
    }
}

// Handle Playlist update from outside
export const addPlaylists = (playlists) => {
    updateAndroidAutoBrowseTree({
        ['Playlists']: playlists.map((playlist) => {
            return {
                title: playlist.name,
                playable: '1',
                iconUri: playlist.cover || undefined,
                mediaId: `playlist-${playlist.id}`
            }
        })
    })
}

export const addRecentlyPlayed = (latest) => {
    updateAndroidAutoBrowseTree({
        ['LatestTab']: latest.map((track) => {
            return {
                title: track.title,
                subtitle: arrToComma(track.artists, 'name'),
                playable: '0',
                iconUri: track.cover || undefined,
                mediaId: `track-${track.id}`
            }
        })
    })
}

async function handlePlaylist(mediaId) {
    if (browseTree[mediaId] === undefined) {
        const playlistId = mediaId.substring(9);
        let playlist = await MicantoApi.getPlaylist(playlistId);
        const host = await getHost();

        let firstItem = {
            'title': t('auto.shuffle'),
            'artists': null,
            'cover': host+'/app/shuffle.png',
            'id': 'shuffle-all'
        }

        currentContext = {
            type: 'playlist',
            id: playlistId,
            options: {
                sortField: 'tracks.title',
                order: 'asc'
            }
        }

        playlist.data = [firstItem].concat(playlist.data);
        updateAndroidAutoBrowseTree({
            [mediaId]: playlist.data.map((track) => {
                return {
                    title: track.title,
                    subtitle: track.artists ? arrToComma(track.artists, 'name') : null,
                    playable: '0',
                    iconUri: track.cover || undefined,
                    mediaId: `track-${track.id}`
                }
            })
        })
    }

}

export const handlePlayRemoteMediaId = async (mediaId) => {
    if(mediaId.startsWith('track-')) {
        const trackId = mediaId.substring(6);
        await MicantoPlayer.reset();



        const {data: queue} = await MicantoApi.getQueue(currentContext);
        const token = await getToken();
        let currentQueue = queue;
        let currentTrackIndex = 0;
        let reorderQueue = currentQueue;
        if(trackId === 'shuffle-all') {
            reorderQueue = [...currentQueue].sort(() => Math.random() - 0.5);
        } else {
            if(trackId) {
                currentTrackIndex = currentQueue.findIndex(music => music.id == trackId);
                reorderQueue = reorderArr(currentTrackIndex,currentQueue);
                console.log(currentTrackIndex);

            }
        }
        await MicantoPlayer.setQueue(toTrackPlayerObject(reorderQueue, token));
        await MicantoPlayer.play();
    }
}
