import {FlatList, SafeAreaView, Text} from "react-native";
import ListItem from "../components/ListItem";
import {useShallow} from "zustand/react/shallow";
import ScrollSpacer from "../components/ScrollSpacer";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import usePlaylistStore from "../stores/PlaylistStore";
export default function() {
    const [ playlists ] = usePlaylistStore(useShallow((state) => [state.playlists]));
    const navigation = useNavigation();
    const [t] = useTranslation();
    const onPress = (playlist) => {
        navigation.navigate('Playlist', {
            itemId: playlist.id
        });
    }

    return (
        <SafeAreaView>
            <FlatList
                data={playlists}
                renderItem={({item}) => <ListItem
                    title={item.name}
                    type="playlist"
                    cover={item.cover}
                    subtitle={`${item.tracks_count} ${t('general.tracks')}`}
                    item={item}
                    clickHandler={onPress}
                />
            }
                keyExtractor={item => item.id}
                ListFooterComponent={ <ScrollSpacer /> }
            />
        </SafeAreaView>
    )
}
