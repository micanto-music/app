import TrackPlayer, {Event} from 'react-native-track-player';
import {useTrackPlayer} from "../stores/trackPlayer";
import {MicantoApi} from "../api/MicantoApi";
import {Platform} from "react-native";
import {handleAABrowseMediaId, handlePlayRemoteMediaId} from "../AndroidAuto/AndroidAuto";
import {cleanQuery} from "../utils/helper";
import {MicantoPlayer, nextTrackAsync} from "./MicantoPlayer";

export default async function () {
    /* Handle Remote Events from Android Auto CarPlay or the Notification Bar etc...*/
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play())

    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause())

    TrackPlayer.addEventListener(Event.RemotePrevious, async() => {
        let progress = await TrackPlayer.getProgress();
        if (progress.position < 3) {
            await MicantoPlayer.skipToPrevious();
        } else {
            await MicantoPlayer.seekTo(0);
        }
    });

    TrackPlayer.addEventListener(Event.RemoteNext, () => nextTrackAsync());

    TrackPlayer.addEventListener(Event.RemoteSeek, ({position}) => {
        TrackPlayer.seekTo(position);
    });

    /* Save progress back to the server */
    TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async ({position, duration}) => {
        let curTime = Math.ceil(position);

        const activeTrack = await TrackPlayer.getActiveTrack();

        const context = useTrackPlayer.getState().musicContext;

        let lastPlayed = useTrackPlayer.getState().lastPlayed;


        // // if we listened over 33% of the track, we say it is played
        if(activeTrack && lastPlayed.indexOf(activeTrack.id) === -1) {

            if (!isNaN(duration) && duration / 3 <= curTime) {
                //console.log('setPlayed', activeTrack.id);
                MicantoApi.setPlayed(activeTrack.id);
                // activeTrack.playcounted = true;
                lastPlayed.push(activeTrack.id);

                if(lastPlayed.length == 10) {
                    lastPlayed.shift();
                }
                useTrackPlayer.setState({lastPlayed: lastPlayed})
            }
        }

        if (curTime % 5 === 0 || curTime === 0 || curTime === 1) {
            MicantoApi.updateSession(curTime, activeTrack.id, context);
        }
    });

    if (Platform.OS === 'android') {
        TrackPlayer.addEventListener(Event.RemotePlayId, async (event) => {
            console.log('Event.RemotePlayId', event);
            handlePlayRemoteMediaId(event.id);
        });

        TrackPlayer.addEventListener(Event.RemotePlaySearch, (event) => {
            console.log('Event.RemotePlaySearch', event);
            const playTrack = useTrackPlayer.getState().playTrack;
            (async () => {
                let query = cleanQuery(event?.query)

                MicantoApi.searchFor(query).then(async (res) => {

                    if(res?.top) {
                        await MicantoPlayer.reset();
                        let canPlay = false;
                        switch(res.top.type) {
                            case 'tracks':
                                await playTrack(res.top, {
                                    type: 'album',
                                    id: res.top.album_id
                                })
                                canPlay = true;
                                break;
                            case 'album':
                                await playTrack(null, {
                                    type: 'album',
                                    id: res.top.id
                                })
                                canPlay = true;
                                break;
                            case 'artist':
                                await playTrack(null, {
                                    type: 'artist',
                                    id: res.top.id
                                })
                                canPlay = true;
                                break;
                        }
                        if(canPlay) {
                            await MicantoPlayer.play();
                        }
                    }
                })
            })()

        });

        TrackPlayer.addEventListener(Event.RemoteSkip, (event) => {
            // As far as I can tell, Event.RemoteSkip is an android only event that handles the "queue" button (top right)
            // clicks in android auto. it simply emits an index in the current queue to be played.
            console.log('Event.RemoteSkip', event);
            TrackPlayer.skip(event.index).then(() => TrackPlayer.play());
        });

        TrackPlayer.addEventListener(Event.RemoteBrowse, (event) => {
            // This event is emitted when onLoadChildren is called. the mediaId is returned to allow RNTP to handle any
            // content updates.
            console.log('Event.RemoteBrowse', event);
            handleAABrowseMediaId(event.mediaId)
        });
    }
}
