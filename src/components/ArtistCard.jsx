import {Card, Text} from "react-native-paper";
import {Image, View, TouchableOpacity} from "react-native";
import React from "react";
import {useNavigation} from "@react-navigation/native";
import {trimText} from "../utils/helper";
import {Common} from "../styles/styles";
import defaultImage from '../assets/img/logo.png'

export default function ArtistCard( {artist, style = []}) {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('Artist', {
            artistId: artist.id
        });
    }

    const defaultUri = Image.resolveAssetSource(defaultImage).uri
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={handlePress} style={{...Common.card, ...style}}>
            <View>
                <View style={{flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Image
                        style={{ width: '100%', aspectRatio: 1,  marginBottom: 5 }}
                        resizeMode="contain"
                        source={artist.image ? { uri: artist.image } : {uri: defaultUri}}
                    />
                </View>

                <Text>{trimText(artist.name, 20)}</Text>
            </View>
        </TouchableOpacity>
    );

}
