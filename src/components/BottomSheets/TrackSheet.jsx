import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
    BottomSheetBackdrop
} from '@gorhom/bottom-sheet';
import {Text} from "react-native-paper";
import {cloneElement, useCallback, useMemo, useRef} from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {COLORS, Common} from "../../styles/styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5Icons from "react-native-vector-icons/FontAwesome5";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import {MicantoApi} from "../../api/MicantoApi";
import Snackbar from "../SnackbarManager";
import BaseSheet from "./BaseSheet";
import {downloadTrack} from "../../services/Downloader";

export default function TrackSheet( props ) {

    const navigation = useNavigation();
    const route = useRoute();
    const [t] = useTranslation();
    const {onPlaylist, itemId} = props;

    const onPress = (type, data) => {
        switch (type) {
            case "album":
                let albumId = data?.albumId ? data?.albumId : data.album_id
                navigation.navigate('Album', {
                    albumId: albumId
                });
                break;
            case "artist":
                let artistId = data?.artistId ? data?.artistId : data.artists[0].id
                navigation.navigate('Artist', {
                    artistId: artistId
                });
                break;
            case "download":
                downloadTrack(data);
                break;
            case "addToPlaylist":
                navigation.navigate('AddToPlaylist', {
                    type: 'tracks',
                    data: data
                });
                break;
            case "removeFromPlaylist":
                MicantoApi.removePlaylistItems(itemId, 'tracks', [data.id]);
                Snackbar.show(t('snackbar.removed'));
                navigation.replace(route.name, route.params)
                break;
            default:
                break;
        }
        props.bottomSheetModalRef.current.close();
    }

    return(
        <BaseSheet props={{...props, name: 'trackSheet'}}>
            {props => {
                return(
                    <BottomSheetView
                        style={Common.sheet.view}
                    >
                        <TouchableOpacity style={{...Common.listItem,paddingLeft: 0}} onPress={() => onPress('album', props.data)}>
                            <Text style={{width: 40, alignItems: 'center'}}><FontAwesome5Icons size={28} name="compact-disc"/></Text>
                            <Text>{t('bottomsheet.gotoAlbum')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{...Common.listItem,paddingLeft: 0}} onPress={() => onPress('artist', props.data)}>
                            <Text style={{width: 40, alignItems: 'center'}}><MaterialCommunityIcons size={28} name="account-group-outline"/></Text>
                            <Text>{t('bottomsheet.gotoArtist')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{...Common.listItem,paddingLeft: 0}} onPress={() => onPress('download', props.data)}>
                            <Text style={{width: 40, alignItems: 'center'}}><MaterialCommunityIcons size={28} name="download-circle-outline"/></Text>
                            <Text>{t('bottomsheet.download')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{...Common.listItem,paddingLeft: 0}} onPress={() => onPress('addToPlaylist', props.data)}>
                            <Text style={{width: 40, alignItems: 'center'}}><MaterialCommunityIcons size={28} name="music-note-plus"/></Text>
                            <Text>{t('bottomsheet.toPlaylist')}</Text>
                        </TouchableOpacity>
                        {onPlaylist &&
                            <TouchableOpacity style={{...Common.listItem,paddingLeft: 0}} onPress={() => onPress('removeFromPlaylist', props.data)}>
                                <Text style={{width: 40, alignItems: 'center'}}><MaterialCommunityIcons size={28} name="music-note-off"/></Text>
                                <Text>{t('bottomsheet.fromPlaylist')}</Text>
                            </TouchableOpacity>
                        }
                    </BottomSheetView>
            )}}

        </BaseSheet>
    )
}
