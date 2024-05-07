import Ionicons from "react-native-vector-icons/Ionicons";
import {COLORS} from "../styles/styles";
import {TouchableOpacity} from "react-native";
import React from "react";
import {useTrackPlayer} from "../stores/trackPlayer";
import {shuffleQueue} from "../services/MicantoPlayer";

export default function ShuffleIndicator({size = 28, style= {}}) {
    const isShuffle = useTrackPlayer((state) => state.shuffle);
    const onShuffleHandler = async() => {
        await shuffleQueue();
    }

    return(
        <TouchableOpacity onPress={onShuffleHandler} activeOpacity={0.7} style={{...style}}>
            <Ionicons
                name="shuffle"
                color={isShuffle ? COLORS.active : "white"}
                size={size}
            />
        </TouchableOpacity>
    );
}
