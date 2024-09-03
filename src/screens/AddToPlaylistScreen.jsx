import {FlatList, SafeAreaView, Text, View} from "react-native";
import ListItem from "../components/ListItem";
import {useEffect, useState} from "react";
import {useTrackPlayer} from "../stores/trackPlayer";
import {useShallow} from "zustand/react/shallow";
import ScrollSpacer from "../components/ScrollSpacer";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import {MicantoApi} from "../api/MicantoApi";
import Snackbar from "../components/SnackbarManager";
import usePlaylistStore from "../stores/PlaylistStore";
export default function({route}) {
    const { data, type } = route.params;
    const [ playlists, updatePlaylist ] = usePlaylistStore((state) => [state.playlists, state.updatePlaylist]);
    const navigation = useNavigation();
    const [t] = useTranslation();
    const [selected, setSelected] = useState([]);

    const onSelect = async (playlist) => {
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
