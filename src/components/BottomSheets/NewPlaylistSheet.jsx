import {Common} from "../../styles/styles";
import BaseSheet from "./BaseSheet";
import {BottomSheetView} from "@gorhom/bottom-sheet";
import {Text} from "react-native-paper";
import FormTextField from "../FormTextField";
import {useTranslation} from "react-i18next";
import {TouchableOpacity} from "react-native";
import {MicantoApi} from "../../api/MicantoApi";
import {useState} from "react";
import {useShallow} from "zustand/react/shallow";
import Snackbar from "../SnackbarManager";
import usePlaylistStore from "../../stores/PlaylistStore";

export default function NewPlaylistSheet( props ) {
    const [t] = useTranslation();
    const [name, setName] = useState('');
    const [playlists, setPlaylists] = usePlaylistStore(useShallow(state => [state.playlists, state.setPlaylists]));

    const handleSubmit = () => {
        let formData = {
            'name': name
        }
        MicantoApi.addPlaylist(formData).then((res) => {
            let newPlaylists = playlists;
            newPlaylists.push(res);
            setPlaylists(newPlaylists);
            props.bottomSheetModalRef?.current?.close();
            setName('');
            Snackbar.show(t('snackbar.addedPlaylist'));
        });
    }

    return(
        <BaseSheet props={{...props, name: 'editPlaylistSheet', snapPoints: ['55%']}}>
            {props => {
                return(
                    <BottomSheetView
                        style={Common.sheet.view}
                    >
                        <FormTextField
                            label={t('bottomsheet.playlist.label')}
                            placeholder={t('bottomsheet.playlist.placeholder')}
                            onChangeText={(text) => setName(text)}
                            value={name}
                        />

                        <TouchableOpacity style={Common.btnPrimary} onPress={handleSubmit}>
                            <Text style={Common.btnText}>{t('general.save')}</Text>
                        </TouchableOpacity>
                    </BottomSheetView>
                )}}
        </BaseSheet>
    )
}
