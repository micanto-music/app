import {View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
import {COLORS} from "../styles/styles";
import {Portal, Text} from "react-native-paper";
import { useHeaderHeight } from '@react-navigation/elements';

export default function SelectHeader({ count, deleteHandler, resetSelectMode }) {
    const headerHeight = useHeaderHeight();
    return(
        <Portal>
            <View style={{paddingHorizontal: 15, backgroundColor: COLORS.lightBackgroundColor, height: headerHeight, flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>
                <View style={{flexDirection: 'row'}}>
                    <Ionicons
                        onPress={() => resetSelectMode()}
                        name="chevron-back"
                        size={24}
                        color="white"
                    />
                    <Text style={{fontSize: 18, paddingLeft: 10}}>{count}</Text>
                </View>

                <Ionicons
                    onPress={deleteHandler}
                    name="trash"
                    size={24}
                    color="white"
                />
            </View>
        </Portal>
    );

};
