import { create } from 'zustand'
import {getToken} from "../services/StorageService";
import {reorderArr, toTrackPlayerObject} from "../utils/helper";
import {isEqual} from "lodash";
import {MicantoApi} from "../api/MicantoApi";
import {MicantoPlayer, setQueueAsync} from "../services/MicantoPlayer";

export const useTrackPlayer = create((set, get) => ({
    currentTrack: null,
    queue: [],
    untouchedQueue: [],
    repeat: false,
    repeatMode: 'queue',
    shuffle: false,
    currentTime: 0,
    playlists: [],
    musicContext: {
        'type': null,
        'id' : null
    },
    lastPlayed: [],

    setShuffle: () => {
        set((state) => ({ shuffle: !state.shuffle}));
    },
    setRepeatMode: (repeatMode) => {
        set((state) => ({ repeatMode: repeatMode}));
    },

    setFromSession: async (data) => {
        if(data?.session?.track !== null) {
            let currentTrackIndex = data.queue.findIndex(music => music.id === data.session.track.id);
            let reorderQueue = reorderArr(currentTrackIndex,data.queue);

            await setQueueAsync(reorderQueue);
            if(data.session.session?.current_time) {
                await MicantoPlayer.seekTo(data.session.session?.current_time);
            }

            const token = await getToken();
            set({
                currentTrack: data.session.track,
                currentTime: data.session.session?.current_time,
                playlists: data.playlists,
                queue: reorderQueue,
                untouchedQueue: toTrackPlayerObject(reorderQueue, token),
                musicContext: JSON.parse(data.session.session?.context)
            })
        } else {
            set({
                playlists: data.playlists,
            })
        }
    },

    setPlaylists: (playlists) => {
        set(() => ({ playlists: playlists}));
    },

    playTrack: async(track, context) => {
        if(context.hasOwnProperty('type')) {
            let currentContext = get().musicContext;
            let currentQueue = get().queue;
            if(context.type !== 'queue' && !isEqual(currentContext, context)) {
                const {data: queue} = await MicantoApi.getQueue(context);
                currentQueue = queue;
            }
            let currentTrackIndex = 0;
            let reorderQueue = currentQueue;
            if(track) {
                currentTrackIndex = currentQueue.findIndex(music => music.id === track.id);
                reorderQueue = reorderArr(currentTrackIndex,currentQueue);
            }
            const token = await getToken();
            set({
                queue: reorderQueue,
                untouchedQueue: toTrackPlayerObject(reorderQueue, token),
                musicContext: context
            });
            await setQueueAsync(reorderQueue);
        }

    },
}));
