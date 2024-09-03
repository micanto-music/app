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
import usePlaylistStore from "../../stores/PlaylistStore";

export default function EditPlaylistSheet( props ) {
    const [t] = useTranslation();
    const [name, setName] = useState(null);
    const [id, setId] = useState(null);
    const [playlists, setPlaylists] = usePlaylistStore(useShallow(state => [state.playlists, state.setPlaylists]));

    const handleSubmit = () => {
        let formData = {
            'id': id,
            'name': name
        }
        MicantoApi.editPlaylist(formData).then(() => {
            let a = playlists.map(item => item.id == id ? {...item,name:name} : item);
            setPlaylists(a);
            props.bottomSheetModalRef?.current?.close();
        });
    }

    return(
        <BaseSheet props={{...props, name: 'editPlaylistSheet', snapPoints: ['55%']}}>
            {props => {
                if(!name) setName(props.data?.name);
                setId(props.data?.id);
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
