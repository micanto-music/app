import {Image, View} from "react-native";
import {createMaterialBottomTabNavigator} from "react-native-paper/react-navigation";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useTranslation} from "react-i18next";
import {Portal} from "react-native-paper";

/* Screens */
import SearchScreen from "../screens/SearchScreen";
import HomeScreen from "../screens/HomeScreen";
import LibraryScreen from "../screens/LibraryScreen";
import TracksScreen from "../screens/TracksScreen";
import AlbumsScreen from "../screens/AlbumsScreen";
import AlbumScreen from "../screens/AlbumScreen";
import ArtistsScreen from "../screens/ArtistsScreen";
import ArtistScreen from "../screens/ArtistScreen";
import QueueScreen from "../screens/QueueScreen";
import PlaylistsScreen from "../screens/PlaylistsScreen";
import PlaylistScreen from "../screens/PlaylistScreen";
import AddToPlaylistScreen from "../screens/AddToPlaylistScreen";
import UserScreen from "../screens/UserScreen";

/* Icons */
import FeatherIcons from 'react-native-vector-icons/Feather';
import EntypoIcons from 'react-native-vector-icons/Entypo';

/* Own */
import AudioPlayer from "./AudioPlayer";
import {useTrackPlayer} from "../stores/trackPlayer";
import {COLORS, Common} from "../styles/styles";
import SnackbarContainer from "./SnackbarContainer";
import {useContext} from "react";
import AuthContext from "../contexts/AuthContext";
import defaultUserImage from '../assets/img/user.png'

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
    const [t] = useTranslation();
    return (
    <Stack.Navigator screenOptions={() => ({ headerShown: true, animation: 'fade', ...Common.header })}>
        <Stack.Screen name="Home"
                      component={HomeScreen}
                      options={{headerShown: false}}
        />
        <Stack.Screen name="Album" component={AlbumScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Artist" component={ArtistScreen} options={{headerShown: false}} />
        <Stack.Screen name="Playlist" component={PlaylistScreen} options={{headerShown: false}} />
        <Stack.Screen name="AddToPlaylist" component={AddToPlaylistScreen} options={{title: t('screens.addToPlaylist.navTitle')}}/>
    </Stack.Navigator>
    )
}

const SearchStack = () => {
    return (
        <Stack.Navigator screenOptions={() => ({ headerShown: true,animation: 'fade', ...Common.header })}>
            <Stack.Screen name="Search"
                          component={SearchScreen}
                          options={{headerShown: false}}
            />
            <Stack.Screen name="Album" component={AlbumScreen} options={{headerShown: false}} />
            <Stack.Screen name="Artist" component={ArtistScreen} options={{headerShown: false}} />
        </Stack.Navigator>
    );
}

const LibraryStack = () => {
    const [t] = useTranslation();
    return (
    <Stack.Navigator screenOptions={() => ({ headerShown: true,animation: 'fade', ...Common.header })}>
        <Stack.Screen name="Library"
                      component={LibraryScreen}
                      options={{headerShown: false}}
        />
        <Stack.Screen name="Playlists" component={PlaylistsScreen} options={{title: t('screens.playlists.navTitle')}}/>
        <Stack.Screen name="Playlist" component={PlaylistScreen} options={{headerShown: false}} />
        <Stack.Screen name="Tracks" component={TracksScreen} options={{title: t('screens.tracks.navTitle')}}/>
        <Stack.Screen name="Artists" component={ArtistsScreen} options={{title: t('screens.artists.navTitle')}}/>
        <Stack.Screen name="Artist" component={ArtistScreen} options={{headerShown: false}} />
        <Stack.Screen name="Albums" component={AlbumsScreen} options={{title: t('screens.albums.navTitle')}}/>
        <Stack.Screen name="Album" component={AlbumScreen} options={{headerShown: false}} />
        <Stack.Screen name="Queue" component={QueueScreen} options={{title: t('screens.queue.navTitle')}}/>
    </Stack.Navigator>
    )
}

const UserStack = () => {
    const [t] = useTranslation();
    return (
        <Stack.Navigator screenOptions={() => ({ headerShown: true,animation: 'fade', ...Common.header })}>
            <Stack.Screen name="User"
                          component={UserScreen}
                          options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
}

export default function ButtonTabs() {
    const [t] = useTranslation();
    const trackPlayer = useTrackPlayer();
    const {user } = useContext(AuthContext);
    const defaultUri = Image.resolveAssetSource(defaultUserImage).uri
    return (
        <View style={{ flex: 1, width: '100%' }}>
            <Tab.Navigator
                barStyle={{ backgroundColor: '#222' }}
                inactiveColor={COLORS.gray}
                activeColor={COLORS.active}
                activeIndicatorStyle={{backgroundColor: COLORS.backgroundColor, borderColor: COLORS.border, borderWidth: 1}}
            >
                <Tab.Screen
                    name="HomeStack"
                    component={HomeStack}
                    options={{
                        tabBarLabel: t('navigation.home'),
                        tabBarIcon: ({ color }) => (
                            <FeatherIcons name="home" color={color} size={26} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="SearchStack" tabBarLabel={t('navigation.search')}
                    options={{
                        tabBarLabel: t('navigation.search'),
                        tabBarIcon: ({ color }) => (
                            <FeatherIcons name="search" color={color} size={26} />
                        ),
                    }}
                    component={SearchStack} />
                <Tab.Screen
                    name="LibraryStack" tabBarLabel={t('navigation.library')}
                    options={{
                        tabBarLabel: t('navigation.library'),
                        tabBarIcon: ({ color }) => (
                            <EntypoIcons name="beamed-note" color={color} size={26} />
                        ),
                    }}
                    component={LibraryStack} />
                <Tab.Screen
                    name="UserStack" tabBarLabel={t('navigation.user')}
                    options={{
                        tabBarLabel: t('navigation.user'),
                        tabBarIcon: ({ color }) => (
                            <Image
                                source={user?.image ? { uri: user.image } : {uri: defaultUri}}
                                style={{width:26, height: 26}}/>
                        ),
                    }}
                    component={UserStack} />
            </Tab.Navigator>
            {trackPlayer.currentTrack && <AudioPlayer />}
            <Portal>
                <SnackbarContainer />
            </Portal>
        </View>
    );
}
