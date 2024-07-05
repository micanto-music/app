import {FlatList, Platform, RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native";
import {Text} from "react-native-paper";
import {useCallback, useEffect, useRef, useState} from "react";
import {Common} from "../styles/styles";
import axios from "../utils/axios";
import {MicantoApi} from "../api/MicantoApi";
import {useTrackPlayer} from "../stores/trackPlayer";
import {useShallow} from "zustand/react/shallow";
import {useTranslation} from "react-i18next";
import ScrollSpacer from "../components/ScrollSpacer";
import Loader from "../components/Loader";
import PlaylistCard from "../components/PlaylistCard";
import TrackSheet from "../components/BottomSheets/TrackSheet";
import AlbumCard from "../components/AlbumCard";
import ListItem from "../components/ListItem";
import {arrToComma} from "../utils/helper";
import {play, setupPlayer} from "../services/MicantoPlayer";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import NewPlaylistSheet from "../components/BottomSheets/NewPlaylistSheet";
import {
    addRecentlyPlayed,
    addPlaylists,
    registerAndroidAutoModule,
    requestDrawOverAppsPermission,
} from "../AndroidAuto/AndroidAuto";
import {checkLostDownloads} from "../services/Downloader";

export default function() {
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mostPlayed, setMostPlayed] = useState([])
    const [recentlyPlayed, setRecentlyPlayed] = useState([])
    const [latestTracks, setLatestTracks] = useState([])
    const [latestAlbums, setLatestAlbums] = useState([])
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [ setFromSession, playlists ] = useTrackPlayer(useShallow((state) => [state.setFromSession, state.playlists]));
    const [t] = useTranslation();
    const bottomSheetModalRef = useRef(null);
    const bottomSheetNewPlaylistRef = useRef(null);

    const onRefresh = useCallback(async() => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const handleTrackMenu = (track) => {
        bottomSheetModalRef.current.present(track);
    }
    const handleNewPlaylist = () => {
        bottomSheetNewPlaylistRef.current.present();
    }

    const fetchData = async () => {
        const {data: response} = await axios.get("/overview");
        setMostPlayed(response.most_played);
        setRecentlyPlayed(response.last_played);
        setLatestTracks(response.latest_tracks);
        setLatestAlbums(response.latest_albums);
        setIsLoading(false);
    }

    useEffect(() => {
        let unmounted = false;
        (async () => {
            checkLostDownloads();

            await setupPlayer();

            if (Platform.OS === 'android') {
                registerAndroidAutoModule();
                await requestDrawOverAppsPermission();
            }
            if (unmounted) return;

            const initData = await MicantoApi.getInitialData();
            await setFromSession(initData);
            addPlaylists(initData.playlists);
            setIsPlayerReady(true);
            fetchData();
        })();
        return () => {
            unmounted = true;
        };
    }, []);


    useEffect(() => {
        if(isPlayerReady) {
            addRecentlyPlayed(recentlyPlayed);
        }
    }, [isPlayerReady,recentlyPlayed]);


    if(!isPlayerReady) {
        return <Loader />;
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                {/*<View><Pressable onPress={handleLogout}><Text>Logout</Text></Pressable></View>*/}
                <View style={{ flex: 1}}>
                    <View style={{marginHorizontal: 10, paddingTop: 10, flex: 1,flexDirection: 'row', justifyContent: "space-between"}}>
                        <Text style={{...Common.headline, marginTop: 0, marginLeft: 0,marginBottom: 10}}>{t('screens.home.playlists.headline')}</Text>
                        <TouchableOpacity onPress={handleNewPlaylist}>
                            <Text>
                                <FontAwesome name="plus-square-o" size={24} />
                            </Text>
                        </TouchableOpacity>
                    </View>


                    <FlatList
                        data={playlists}
                        renderItem={({item}) => <PlaylistCard playlist={item} />}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{...Common.headline, marginLeft: 10, paddingTop: 10}}>{t('screens.home.lastPlayed.headline')}</Text>
                    {recentlyPlayed?.map((track, i) => (
                        <ListItem
                            key={i}
                            title={track.title}
                            subtitle={arrToComma(track.artists,'name')}
                            cover={track.cover}
                            item={track}
                            clickHandler={(item) => play(item, {'type': 'lastPlayed'})}
                            contextMenuHandler={handleTrackMenu}

                        />
                    ))}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{...Common.headline, marginLeft: 10, paddingTop: 10}}>{t('screens.home.mostPlayed.headline')}</Text>
                    {mostPlayed?.map((track, i) => (
                        <ListItem
                            key={i}
                            title={track.title}
                            subtitle={arrToComma(track.artists,'name')}
                            cover={track.cover}
                            item={track}
                            clickHandler={(item) => play(item, {'type': 'mostPlayed'})}
                            contextMenuHandler={handleTrackMenu}
                        />
                    ))}
                </View>

                <View style={{ flex: 1}}>
                    <Text style={{...Common.headline, marginLeft: 10, paddingTop: 10, marginBottom: 10}}>{t('screens.home.albums.headline')}</Text>
                    <FlatList
                        data={latestAlbums}
                        renderItem={({item}) => <AlbumCard album={item} style={{width: 200, marginLeft: 10}}/>}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={{...Common.headline, marginLeft: 10, paddingTop: 10}}>{t('screens.home.latestTracks.headline')}</Text>
                    {latestTracks?.map((track, i) => (
                        <ListItem
                            key={i}
                            title={track.title}
                            subtitle={arrToComma(track.artists,'name')}
                            cover={track.cover}
                            item={track}
                            clickHandler={(item) => play(item, {'type': 'latestTracks'})}
                            contextMenuHandler={handleTrackMenu}
                        />
                    ))}
                </View>


                <ScrollSpacer />
            </ScrollView>

            <TrackSheet bottomSheetModalRef={bottomSheetModalRef}/>
            <NewPlaylistSheet bottomSheetModalRef={bottomSheetNewPlaylistRef}/>
        </SafeAreaView>
    )
}
