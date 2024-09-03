import EntypoIcons from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5Icons from "react-native-vector-icons/FontAwesome5";
export const links = [
    {
        name: 'playlists',
        description: 'playlists',
        to: 'Playlists',
        icon: <MaterialCommunityIcons size={28} name="playlist-music-outline"/>
    },
    {name: 'tracks', to: 'Tracks', icon: <EntypoIcons size={28} name="beamed-note"/>},
    {name: 'artists', to: 'Artists', icon: <MaterialCommunityIcons size={28} name="account-group-outline"/>},
    {name: 'albums', to: 'Albums', icon: <FontAwesome5Icons size={28} name="compact-disc"/>},
    {name: 'favorites', to: 'Favorites', icon: <MaterialCommunityIcons size={28} name="heart"/>},
    {name: 'queue', to: 'Queue', icon: <MaterialCommunityIcons size={28} name="format-list-bulleted-square"/>},
];
