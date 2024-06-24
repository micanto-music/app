import {Common} from "../../styles/styles";
import BaseSheet from "./BaseSheet";
import {BottomSheetView} from "@gorhom/bottom-sheet";
import {Text} from "react-native-paper";
import {TouchableOpacity} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useTranslation} from "react-i18next";
import {useNavigation, useRoute} from "@react-navigation/native";
import { downloadArtist} from "../../services/Downloader";

export default function ArtistSheet( props ) {
    const [t] = useTranslation();
    const navigation = useNavigation();

    const onPress = (type, data) => {
        switch (type) {
            case "addToPlaylist":
                navigation.navigate('AddToPlaylist', {
                    type: 'artist',
                    data: data
                });
                break;
            case "download":
                downloadArtist(data.id);
            default:
                break;
        }
        props.bottomSheetModalRef.current.close();
    }

    return(
        <BaseSheet props={{...props, name: 'artistSheet'}}>
            {props => {
                return(
                    <BottomSheetView
                        style={Common.sheet.view}
                    >
                        <TouchableOpacity style={{...Common.listItem,paddingLeft: 0}} onPress={() => onPress('addToPlaylist', props.data)}>
                            <Text style={{width: 40, alignItems: 'center'}}><MaterialCommunityIcons size={28} name="music-note-plus"/></Text>
                            <Text>{t('bottomsheet.artistToPlaylist')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{...Common.listItem,paddingLeft: 0}} onPress={() => onPress('download', props.data)}>
                            <Text style={{width: 40, alignItems: 'center'}}><MaterialCommunityIcons size={28} name="download-circle-outline"/></Text>
                            <Text>{t('bottomsheet.downloadArtist')}</Text>
                        </TouchableOpacity>
                    </BottomSheetView>
                )}}
        </BaseSheet>
    )
}
