import {Common} from "../../styles/styles";
import BaseSheet from "./BaseSheet";
import {BottomSheetView} from "@gorhom/bottom-sheet";
import {Text} from "react-native-paper";
import {TouchableOpacity} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useTranslation} from "react-i18next";
import {useNavigation, useRoute} from "@react-navigation/native";
import FontAwesome5Icons from "react-native-vector-icons/FontAwesome5";

export default function ArtistSheet( props ) {
    const [t] = useTranslation();
    const navigation = useNavigation();
    const route = useRoute();

    const onPress = (type, data) => {
        switch (type) {
            // case "album":
            //     navigation.navigate('Album', {
            //         albumId: data.album_id
            //     });
            //     break;
            case "addToPlaylist":
                navigation.navigate('AddToPlaylist', {
                    type: 'artist',
                    data: data
                });
                break;
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
                        {/*<TouchableOpacity style={{...Common.listItem,paddingLeft: 0}} onPress={() => onPress('album', props.data)}>*/}
                        {/*    <Text style={{width: 40, alignItems: 'center'}}><FontAwesome5Icons size={28} name="compact-disc"/></Text>*/}
                        {/*    <Text>{t('bottomsheet.gotoAlbum')}</Text>*/}
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity style={{...Common.listItem,paddingLeft: 0}} onPress={() => onPress('addToPlaylist', props.data)}>
                            <Text style={{width: 40, alignItems: 'center'}}><MaterialCommunityIcons size={28} name="music-note-plus"/></Text>
                            <Text>{t('bottomsheet.artistToPlaylist')}</Text>
                        </TouchableOpacity>
                    </BottomSheetView>
                )}}
        </BaseSheet>
    )
}
