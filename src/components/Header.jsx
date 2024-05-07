import Ionicons from "react-native-vector-icons/Ionicons";
import Animated, {interpolate, interpolateColor, useAnimatedStyle} from "react-native-reanimated";
import {trimText} from "../utils/helper";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Common} from "../styles/styles";
import EntypoIcons from "react-native-vector-icons/Entypo";
import React from "react";
import {useNavigation} from "@react-navigation/native";

export default function Header({sv, title, handleMenu = null})
{
    const navigation = useNavigation();
    const headerTextStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(sv.value, [0, 170, 200], [0, 0.1, 1])
        };
    });
    const headerBGStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                sv.value,
                [0, 180],
                ['rgba(34,34,34,0.0)', 'rgba(34,34,34,1.0)'],
            )
        };
    });
    return(
        <Animated.View style={[styles.headerBackground,headerBGStyle]}>
            <Ionicons
                onPress={() => navigation.goBack()}
                name="arrow-back"
                size={24}
                color="white"
            />
            <Animated.Text style={[styles.headerText,headerTextStyle]}>{trimText(title,30)}</Animated.Text>
            {handleMenu &&
                <TouchableOpacity style={Common.contextButton} onPress={handleMenu}>
                    <EntypoIcons
                        name="dots-three-horizontal"
                        size={14}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
            }
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    headerBackground: {
        flexDirection: 'row',
        justifyContent: "space-between",
        padding: 12,
        position: 'absolute',
        zIndex: 12,
        width: '100%'
    },
    headerText: {
        color: '#fff'
    }
})
