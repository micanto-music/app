import React, {useEffect, useState} from 'react'
import {View, Image, Pressable, ActivityIndicator, Keyboard} from 'react-native'
import {Text} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'
import {trimText} from "../utils/helper";
import Ionicons from "react-native-vector-icons/Ionicons";
import TrackPlayer, {useActiveTrack, useIsPlaying, useProgress} from "react-native-track-player";
import {COLORS} from "../styles/styles";
import defaultImage from "../assets/img/logo.png";

const AudioPlayer = () => {
    const { playing, bufferingDuringPlay } = useIsPlaying();
    const track = useActiveTrack();
    const navigation = useNavigation();
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const { position } = useProgress();
    const onPlayPauseHandler = async () => {
        if (playing) {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
        }
    }

    const onAudioPlayerHandler = () => {
        navigation.navigate('TrackPlayer')
    }

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardOpen(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardOpen(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const calulateWidth = (duration) => {
        return position / duration * 100 +'%';
    }

    const defaultUri = Image.resolveAssetSource(defaultImage).uri

    if(keyboardOpen) return (<View></View>);

    return (
        <View
            style={{
                alignSelf: 'center',
                borderRadius: 10,
                width: '94%',
                backgroundColor: COLORS.lightBackgroundColor,
                position: 'absolute',
                bottom: 91
            }}
        >
            {track &&
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: 3,
                    paddingLeft: 10,
                    height: 63,
                    width: '100%',
                }}
            >
                <Pressable
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        width: 300,
                    }}
                    activeOpacity={0.7}
                    onPress={onAudioPlayerHandler}
                >
                    <View style={{ marginRight: 10 }}>
                        <Image
                            style={{ height: 50, width: 50, borderRadius: 30 }}
                            source={track.artwork ? { uri: track.artwork } : {uri: defaultUri}}
                        />
                    </View>
                    <View>
                        <Text style={{fontWeight: 'bold'}}>
                            {trimText(track?.title, 25)}
                        </Text>
                        <Text>
                            {trimText(track?.artist, 25)}
                        </Text>
                    </View>
                </Pressable>
                <View style={{ marginLeft: 'auto', paddingRight: 10 }}>
                    {bufferingDuringPlay ? (
                        <ActivityIndicator color={COLORS.primaryColor} />
                    ) : (
                        <Pressable onPress={onPlayPauseHandler}>
                            <Ionicons
                                name={playing ? "pause" : "play"}
                                size={28}
                                color="#FFFFFF"
                            />
                        </Pressable>
                    )}
                </View>
               <View style={{
                   height: 2,
                   position: 'absolute',
                   bottom: 0,
                   left: 5,
                   width: '100%',
                   backgroundColor: COLORS.darkBackgroundColor
               }}>
                   <View style={{
                       height: 2,
                       position: 'absolute',
                       bottom: 0,
                       left: 0,
                       backgroundColor: '#fff',
                       width: calulateWidth(track?.duration)
                   }}>
                   </View>
               </View>
            </View>
            }
        </View>
    )
}

export default AudioPlayer
