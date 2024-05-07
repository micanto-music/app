import {Image, TouchableOpacity, View} from "react-native";
import {Text} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import {COLORS, Common} from "../styles/styles";
import {trimText} from "../utils/helper";
import React from "react";
import defaultImage from "../assets/img/logo.png";

export default function PlaylistCard( {playlist, style = []}) {
    const navigation = useNavigation();

    const onPlaylistItemHandler = () => {
        navigation.navigate('Playlist', {
            itemId: playlist.id
        });
    }
    const defaultUri = Image.resolveAssetSource(defaultImage).uri;
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onPlaylistItemHandler} style={{...Common.card, ...style, marginTop: 5, marginLeft: 10, marginBottom: 5}}>
            <View style={{width: 180, height: 200}}>
                <View style={{flex: 1,
                    justifyContent: "center",
                    alignItems: "center"}}>
                    <Image
                        style={{ width: '100%', aspectRatio: 1,  marginBottom: 5 }}
                        resizeMode="contain"
                        source={playlist.cover ? { uri: playlist.cover } : {uri: defaultUri}}
                    />
                </View>

                <Text>{trimText(playlist.name, 20)}</Text>

            </View>
        </TouchableOpacity>
    )
}
