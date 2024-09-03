import TrackPlayer, {AppKilledPlaybackBehavior, Capability, RepeatMode} from "react-native-track-player";
import {useTrackPlayer} from "../stores/trackPlayer";
import {getToken} from "./StorageService";
import {toTrackPlayerObject} from "../utils/helper";

export const MicantoPlayer = TrackPlayer;
export const DefaultRepeatMode = RepeatMode.Queue;
const playTrack = useTrackPlayer.getState().playTrack;
const shuffle = useTrackPlayer.getState().shuffle;
const setShuffle = useTrackPlayer.getState().setShuffle;
const untouchedQueue = useTrackPlayer.getState().untouchedQueue;

export const setupPlayer = async (options) => {
    const setup = async () => {
        try {
            await MicantoPlayer.setupPlayer(options);
            await MicantoPlayer.updateOptions({
                android: {
                    appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
                },
                capabilities: [
                    Capability.Play,
                    Capability.PlayFromSearch,
                    Capability.PlayFromId,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.SeekTo,
                ],
                compactCapabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                ],
                progressUpdateEventInterval: 1,
            });

            await MicantoPlayer.setRepeatMode(DefaultRepeatMode);

        } catch (error) {
            return error.code;
        }
    };
    while ((await setup()) === 'android_cannot_setup_player_in_background') {
        // A timeout will mostly only execute when the app is in the foreground,
        // and even if we were in the background still, it will reject the promise
        // and we'll try again:
        await new Promise((resolve) => setTimeout(resolve, 1));
    }
};

export const play = async (track, context) => {
    await MicantoPlayer.reset();
    await playTrack(track, context);

    await MicantoPlayer.play();
}

export const shuffleQueue = async() => {
    let newQueue;
    if( !shuffle) {
        const currentQueue = await MicantoPlayer.getQueue();
        newQueue = [...currentQueue].sort(() => Math.random() - 0.5);
    } else {
        newQueue = untouchedQueue;
    }

    await setQueueUninterrupted(newQueue);
    setShuffle();
}

export const setQueueAsync = async (queue) => {
    const token = await getToken();
    await MicantoPlayer.setQueue(toTrackPlayerObject(queue, token));
}

export const nextTrackAsync = async () => {
    await TrackPlayer.skipToNext();
}

const setQueueUninterrupted = async(tracks) => {
    // if no currentTrack, it is a simple setQueue
    const currentTrackIndex = await MicantoPlayer.getActiveTrackIndex();
    if (currentTrackIndex === undefined) return await MicantoPlayer.setQueue(tracks);
    // if currentTrack is not in tracks, its a simple setQueue
    const currentQueue = await MicantoPlayer.getQueue();
    const currentTrack = currentQueue[currentTrackIndex];
    const currentTrackNewIndex = tracks.findIndex(
        // define conditions to find the currentTrack in tracks
        (track) => track.url === currentTrack.url
    );
    if (currentTrackNewIndex < 0) return await MicantoPlayer.setQueue(tracks);
    // else, splice that all others are removed, new track list spliced
    // that the currentTrack becomes the first element.
    // eslint-disable-next-line prefer-const
    let removeTrackIndices = [...Array(currentQueue.length).keys()];
    removeTrackIndices.splice(currentTrackIndex, 1);
    await MicantoPlayer.remove(removeTrackIndices);
    const splicedTracks = tracks
        .slice(currentTrackNewIndex + 1)
        .concat(tracks.slice(0, currentTrackNewIndex));
    await MicantoPlayer.add(splicedTracks);
}
