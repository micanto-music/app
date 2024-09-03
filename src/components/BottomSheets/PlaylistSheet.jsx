import {Common} from "../../styles/styles";
import BaseSheet from "./BaseSheet";
import {BottomSheetView} from "@gorhom/bottom-sheet";
import {Text} from "react-native-paper";
import {Alert, TouchableOpacity} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useTranslation} from "react-i18next";
import {useNavigation, useRoute} from "@react-navigation/native";
import {MicantoApi} from "../../api/MicantoApi";
import {useShallow} from "zustand/react/shallow";
import usePlaylistStore from "../../stores/PlaylistStore";

export default function PlaylistSheet( props ) {
    const [t] = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();
    const [playlists, setPlaylists] = usePlaylistStore(useShallow(state => [state.playlists, state.setPlaylists]));

    const onPress = (type, data) => {
        switch (type) {
            case "editPlaylist":
                props.bottomSheetModalRef.current.forceClose();
                props.editRef.current.present(data);
                break;
            case "removePlaylist":
                Alert.alert(t('alert.playlist.remove.title'), t('alert.playlist.remove.msg'), [
                    {
                        text: t('alert.cancel'),
                        onPress: () => {},
                        style: 'cancel',
                    },
                    {
                        text: t('alert.yes'),
                        onPress: () => {
                            MicantoApi.deletePlaylist(data.id).then(()=> {
                                setPlaylists(playlists.filter(v => v.id !== data.id));
                                navigation.goBack();
                            });
                        }
                    },
                ])
                props.bottomSheetModalRef.current.close();
                break;
            default:
                break;
        }
    }

    return(
        <BaseSheet props={{...props, name: 'playlistSheet', snapPoints: ['35%']}}>
            {props => {
                return(
                    <BottomSheetView
                        style={Common.sheet.view}
                    >
                        <TouchableOpacity style={{...Common.listItem,paddingLeft: 0}} onPress={() => onPress('editPlaylist', props.data)}>
                            <Text style={{width: 40, alignItems: 'center'}}><MaterialCommunityIcons size={28} name="playlist-edit"/></Text>
                            <Text>{t('bottomsheet.editPlaylist')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{...Common.listItem,paddingLeft: 0}} onPress={() => onPress('removePlaylist', props.data)}>
                            <Text style={{width: 40, alignItems: 'center'}}><MaterialCommunityIcons size={28} name="playlist-remove"/></Text>
                            <Text>{t('bottomsheet.removePlaylist')}</Text>
                        </TouchableOpacity>
                    </BottomSheetView>
                )}}
        </BaseSheet>
    )
}
