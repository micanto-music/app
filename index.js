/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player'
import trackService from './src/services/TrackPlayerService'
import {AndroidAuto, AndroidAutoModule} from "./src/AndroidAuto/AndroidAuto";
AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => trackService)

// if (Platform.OS === 'android') {
//     AppRegistry.registerRunnable('AndroidAuto', AndroidAutoModule);
//     AppRegistry.registerComponent('RNCarPlayScene', () => AndroidAuto);
//     // AppRegistry.registerRunnable('androidAuto', AndroidAutoModule);
// }
