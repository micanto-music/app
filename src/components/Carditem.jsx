import {Image, TouchableOpacity, View} from "react-native";
import {Text} from "react-native-paper";
import {Common} from "../styles/styles";
import {trimText} from "../utils/helper";
import React from "react";
import defaultImage from "../assets/img/logo.png";

export default function Carditem( {title, cover, clickHandler, style = []})  {

    const defaultUri = Image.resolveAssetSource(defaultImage).uri;
    return (
        <TouchableOpacity activeOpacity={0.7} onPress={clickHandler} style={{...Common.card, ...style, marginTop: 5, marginBottom: 5}}>
            <View>
                <View style={{flex: 1,
                    justifyContent: "center",
                    alignItems: "center"}}>
                    <Image
                        style={{ width: '100%', aspectRatio: 1,  marginBottom: 5 }}
                        resizeMode="contain"
                        source={cover ? { uri: cover } : {uri: defaultUri}}
                    />
                </View>

                <Text>{trimText(title, 20)}</Text>

            </View>
        </TouchableOpacity>
    )
}
