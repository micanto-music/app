import {Image, TouchableOpacity, View} from "react-native";
import {Text} from "react-native-paper";
import {trimText} from "../utils/helper";
import EntypoIcons from "react-native-vector-icons/Entypo";
import React from "react";
import {COLORS, Common} from "../styles/styles";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ListItem({title, type, clickHandler, item, subtitle = '', cover = null, contextMenuHandler = null, longPressHandler = null}) {
    return (
        <TouchableOpacity
            activeOpacity={0.7} onPress={() => clickHandler(item) }
            onLongPress={() => {if(longPressHandler) longPressHandler(item)}}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 8,
                    justifyContent: "space-between"
                }}
            >
                <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <View style={{position: "relative"}}>
                        <Image
                            style={{ height: 50, width: 50, borderRadius: 10, marginRight: 10 }}
                            source={cover ? { uri: cover } : require('../assets/img/logo.png')}
                        />
                        {item.selected === true && <View style={{
                            position: "absolute",
                            right: 0,
                            bottom: -10
                        }}>
                            <Ionicons
                                name="checkmark-circle"
                                color={COLORS.primaryColor}
                                size={20}
                            />
                        </View>}
                    </View>
                    <View>
                        <Text
                            style={{fontWeight: 'bold'}}
                        >
                            {trimText(title, 30)}
                        </Text>
                        {subtitle &&
                            <Text>
                                {trimText(`${(subtitle)}`,35)}
                            </Text>
                        }
                    </View>
                </View>
                {contextMenuHandler &&
                    <View style={{paddingRight: 10}}>
                        <TouchableOpacity onPress={() => contextMenuHandler(item)} style={Common.contextButton}>
                            <EntypoIcons
                                name="dots-three-horizontal"
                                size={14}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </TouchableOpacity>
    );
}
