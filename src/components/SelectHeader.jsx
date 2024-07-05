import {TouchableOpacity, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
import {COLORS} from "../styles/styles";
import {Portal, Text} from "react-native-paper";
import { useHeaderHeight } from '@react-navigation/elements';
import {useTranslation} from "react-i18next";

export default function SelectHeader({ count, deleteHandler, selectAll, resetSelectMode }) {
    const headerHeight = useHeaderHeight();
    const [t] = useTranslation();

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

                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={selectAll}>
                        <Text style={{fontSize: 18, paddingRight: 20}}>{t('general.selectAll')}</Text>
                    </TouchableOpacity>

                    <Ionicons
                        onPress={deleteHandler}
                        name="trash"
                        size={24}
                        color="white"
                    />
                </View>

            </View>
        </Portal>
    );

};
