import LinearGradient from "react-native-linear-gradient";
import {Image, ImageBackground, StyleSheet, View} from "react-native";
import {Text} from "react-native-paper";
import {Common} from "../styles/styles";
import PlayAllBtn from "./PlayAllBtn";
import React from "react";
import defaultImage from "../assets/img/logo.png";
import ShuffleIndicator from "./ShuffleIndicator";
export default function DetailHeader({
    image,
    title,
    context
}) {
    const defaultUri = Image.resolveAssetSource(defaultImage).uri

    return(
        <View>
        <ImageBackground
            style={{height: '200', width: '100%'}}
            resizeMode={'cover'}
            source={image ? { uri: image } : {uri: defaultUri}}
        >
            <LinearGradient
                style={styles.upperLinearGradient}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                colors={[
                    'rgba(7, 7, 7, 0.00)',
                    'rgba(7, 7, 7, 0.55)',
                    '#000000',
                ]}
            />
            <View style={{padding: 12, position: 'relative', height: 200 }}>
                <View style={{ position:'absolute', zIndex: 1, bottom: 10, width:'100%'}}>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 90, flexGrow: 1}}>
                        <Text style={{...Common.h1, marginLeft: 10, paddingRight: 10, flexGrow: 1,
                            flexShrink: 1}}>{title}</Text>
                        <ShuffleIndicator size={40} style={{marginRight: 10}}/>
                        <PlayAllBtn context={context}/>
                    </View>
                </View>
            </View>
            <LinearGradient
                style={styles.lowerLinearGradient}
                colors={[
                    'rgba(7, 7, 7, 0.00)',
                    'rgba(7, 7, 7, 0.34)',
                    'rgba(7, 7, 7, 0.55)',
                    '#000000',
                ]}
            />
        </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: "space-between",
        padding: 12
    },
    upperLinearGradient: {
        height: 80,
        width: '100%',
        position: 'absolute',
    },
    lowerLinearGradient: {
        height: 150,
        width: '100%',
        position: 'absolute',
        bottom: 0,
    }
})
