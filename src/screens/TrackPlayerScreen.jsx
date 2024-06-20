import {useProgress, useIsPlaying, useActiveTrack} from "react-native-track-player";
import React, {useRef} from "react";
import {SafeAreaView, View, Image, StyleSheet, TouchableOpacity} from "react-native";
import {Text} from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {COLORS, Common, FONTS} from "../styles/styles";
import Slider from '@react-native-community/slider'
import {secondsToHHMMSS} from "../utils/helper";
import defaultImage from "../assets/img/logo.png";
import {useTrackPlayer} from "../stores/trackPlayer";
import EntypoIcons from "react-native-vector-icons/Entypo";
import TrackSheet from "../components/BottomSheets/TrackSheet";
import { RepeatMode } from 'react-native-track-player';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {MicantoPlayer, shuffleQueue} from "../services/MicantoPlayer";
import {downloadTrack} from "../services/Downloader";
import {useDownloaded} from "../stores/downloaded";

const TrackPlayerScreen = ({ navigation }) => {
    const { position } = useProgress();
    const { playing, bufferingDuringPlay } = useIsPlaying();
    const track = useActiveTrack();
    const isDownloaded = useDownloaded((state) => state.isDownloaded);
    const downloaded = isDownloaded(track?.id);
    const isShuffle = useTrackPlayer((state) => state.shuffle);
    const repeatMode = useTrackPlayer((state) => state.repeatMode);
    const setRepeatMode = useTrackPlayer((state) => state.setRepeatMode);
    const bottomSheetModalRef = useRef(null);

    const onShuffleHandler = async () => {
        await shuffleQueue();
    }
    const onPlayPauseHandler = async () => {
        if (playing) {
            await MicantoPlayer.pause();
        } else {
            await MicantoPlayer.play();
        }
    }
    const onPreviousTrackHandler = async () => {
        if (position < 3) {
            await MicantoPlayer.skipToPrevious();
        } else {
            await MicantoPlayer.seekTo(0);
        }
    }
    const onSliderChange = async (position) => {
        await MicantoPlayer.seekTo(position)
    }
    const onNextTrackHandler = async () => {
        await MicantoPlayer.skipToNext();
    }
    const onRepeatHandler = async () => {
        let newRepeatMode;
        switch(repeatMode) {
            case 'queue':
                newRepeatMode = 'track';
                await MicantoPlayer.setRepeatMode(RepeatMode.Track);
                break;
            case 'track':
                newRepeatMode = 'off';
                await MicantoPlayer.setRepeatMode(RepeatMode.Off);
                break;
            case 'off':
                newRepeatMode = 'queue';
                await MicantoPlayer.setRepeatMode(RepeatMode.Queue);
                break;
        }
        setRepeatMode(newRepeatMode);
    }

    const defaultUri = Image.resolveAssetSource(defaultImage).uri;

    const handleTrackMenu = () => {
        bottomSheetModalRef.current.present(track);
    }

    const onDownloadTrack = () => {
        let test= downloadTrack(track);
    }

    return (
      <SafeAreaView>
          <View style={{paddingHorizontal: 20, paddingTop: 20, flexDirection: 'row', justifyContent: "space-between",}}>
              <Ionicons
                  onPress={() => navigation.goBack()}
                  name="chevron-down"
                  size={24}
                  color="white"
              />

              <TouchableOpacity style={Common.contextButton} onPress={handleTrackMenu}>
                  <EntypoIcons
                      name="dots-three-horizontal"
                      size={14}
                      color="#FFFFFF"
                  />
              </TouchableOpacity>

          </View>

          {track &&
              <View style={{padding: 30}}>
                  {/* cover */}
                  <Image
                      style={{ width: '100%', borderRadius: 30, aspectRatio: 1,resizeMode: 'contain' }}
                      source={track.artwork ? { uri: track.artwork } : {uri: defaultUri}}
                  />
                  {/* track info */}
                  <View style={styles.trackInfoContainer}>
                      <Text
                          style={{ color: '#ffffff', ...FONTS.h2}}
                      >
                          {track.title}
                      </Text>
                      <Text
                          style={{
                              color: COLORS.lightGray,
                          }}
                      >
                          {track.artist}
                      </Text>
                  </View>

                  {/* progress bar  */}
                  <View style={styles.progressBarContainer}>
                      <Slider
                          style={{ width: '100%', height: 20, marginHorizontal: 10 }}
                          minimumValue={0}
                          maximumValue={track.duration}
                          tapToSeek={true}
                          onValueChange={onSliderChange}
                          value={position}
                          thumbTintColor={COLORS.primaryColor}
                          minimumTrackTintColor={COLORS.primaryColor}
                          maximumTrackTintColor={COLORS.lightGray2}
                      />
                  </View>
                  {/* time */}
                  <View style={styles.progressBarTimeContainer}>
                      <Text style={{ color: COLORS.lightGray, ...FONTS.body }}>
                          {secondsToHHMMSS(position)}
                      </Text>
                      <Text style={{ color: COLORS.lightGray, ...FONTS.body }}>
                          {secondsToHHMMSS(track.duration)}
                      </Text>
                  </View>

                  {/* controls */}
                  <View style={styles.controlsContainer}>
                      <TouchableOpacity onPress={onRepeatHandler} activeOpacity={0.7}>
                          {repeatMode === 'queue' &&
                              <MaterialCommunityIcons
                                  name="repeat"
                                  color={COLORS.active}
                                  size={28}
                              />
                          }

                          {repeatMode === 'track' &&
                              <MaterialCommunityIcons
                                  name="repeat-once"
                                  color={COLORS.active}
                                  size={28}
                              />
                          }

                          {repeatMode === 'off' &&
                              <MaterialCommunityIcons
                                  name="repeat-off"
                                  color="#fff"
                                  size={28}
                              />
                          }

                      </TouchableOpacity>
                      <TouchableOpacity
                          onPress={onPreviousTrackHandler}
                          activeOpacity={0.7}
                      >
                          <MaterialIcons
                              name="skip-previous"
                              color='#ffffff'
                              size={28}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity
                          onPress={onPlayPauseHandler}
                          style={styles.playPauseContainer}
                          activeOpacity={0.7}
                      >
                          <Ionicons
                              name={playing ? "pause" : "play"}
                              size={28}
                              color="#000"
                          />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={onNextTrackHandler} activeOpacity={0.7}>
                          <MaterialIcons
                              name="skip-next"
                              color='#ffffff'
                              size={28}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={onShuffleHandler} activeOpacity={0.7}>
                          <Ionicons
                              name="shuffle"
                              color={isShuffle ? COLORS.active : "white"}
                              size={28}
                          />
                      </TouchableOpacity>
                  </View>
                  {downloaded ?
                        <MaterialCommunityIcons name="progress-check" color={COLORS.active} size={28} />
                      :
                      <TouchableOpacity onPress={onDownloadTrack} activeOpacity={0.7}>
                          <MaterialCommunityIcons name="download-circle-outline" color="white" size={28} />
                      </TouchableOpacity>
                  }

              </View>
          }
          <TrackSheet bottomSheetModalRef={bottomSheetModalRef}/>
      </SafeAreaView>
    );
}

const styles= StyleSheet.create({
    upperLinearGradient: {
        height: 80,
        width: '100%',
        position: 'absolute',
    },
    downArrowContainer: {
        flex: 1,
        paddingLeft: 30,
        justifyContent: 'center',
    },
    headerInfoContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 30,
    },
    lowerLinearGradient: {
        height: 150,
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    trackInfoContainer: {
        paddingTop: 30,
        paddingBottom: 15,
    },
    progressBarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    playPauseContainer: {
        height: 60,
        width: 60,
        backgroundColor: '#ffffff',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default TrackPlayerScreen

