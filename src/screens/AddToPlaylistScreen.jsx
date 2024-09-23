import {FlatList, SafeAreaView} from "react-native";
import ListItem from "../components/ListItem";
import ScrollSpacer from "../components/ScrollSpacer";
import {useTranslation} from "react-i18next";
import {MicantoApi} from "../api/MicantoApi";
import Snackbar from "../components/SnackbarManager";
import usePlaylistStore from "../stores/PlaylistStore";
export default function({route}) {
    const { data, type } = route.params;
    const [ playlists, updatePlaylist ] = usePlaylistStore((state) => [state.playlists, state.updatePlaylist]);
    const [t] = useTranslation();

    const onSelect = async (playlist, e) => {
        let updated;
        switch (type) {
            case 'album':
                updated = await MicantoApi.addPlaylistItems(playlist.id, 'album', [data.id]);
                break;
            case 'artist':
                updated = await MicantoApi.addPlaylistItems(playlist.id, 'artist', [data.id]);
                break;
            case 'tracks':
                updated = await MicantoApi.addPlaylistItems(playlist.id, 'tracks', [data.id]);
                break;
        }

        await updatePlaylist(updated.data);

        Snackbar.show(t('snackbar.added'));
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
                    clickHandler={onSelect}
                    //selectHandler={onSelect}
                />
                }
                keyExtractor={item => item.id}
                ListFooterComponent={ <ScrollSpacer /> }
            />
        </SafeAreaView>
    )
}
