import Ionicons from "react-native-vector-icons/Ionicons";
import {TouchableOpacity} from "react-native";
import {Common} from "../styles/styles";
import React from "react";
import {play} from "../services/MicantoPlayer";
export default function PlayAllBtn({context}){

    const onPlayHandler = async() => {
        await play(null, context);
    }

    return(
        <TouchableOpacity
            onPress={onPlayHandler}
            style={Common.playPauseContainer}
            activeOpacity={0.7}
        >
            <Ionicons
                name="play"
                size={28}
                color="#000"
            />
        </TouchableOpacity>
    );

}
