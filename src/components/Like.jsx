import {LuHeart} from "react-icons/lu";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {MicantoApi} from "../api/MicantoApi";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {Pressable} from "react-native";
import {COLORS} from "../styles/styles";
export default function ({track}) {

    const [liked, setLiked] = useState(track.liked);
    const [t] = useTranslation();
    const onPress = () => {
        setLiked(!liked);
        MicantoApi.like(track?.id);
    }

    return (
        <Pressable onPress={onPress}>
            <MaterialCommunityIcons
                name={liked ? "heart" : "heart-outline" }
                color={liked ? COLORS.primaryColor : "#898989" }
                size={28}
            />
        </Pressable>
    );

}
