import {Image, TouchableOpacity, View} from "react-native";
import {Text} from "react-native-paper";
import {trimText} from "../utils/helper";
import EntypoIcons from "react-native-vector-icons/Entypo";
import React, {useRef} from "react";
import {COLORS, Common} from "../styles/styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {State, TapGestureHandler} from "react-native-gesture-handler";
import {MicantoApi} from "../api/MicantoApi";
import useTrackStore from "../stores/TrackStore";

export default function ListItem({title, clickHandler, doubleTap = true, item, subtitle = '', cover = null, contextMenuHandler = null}) {

    const doubleTapRef = useRef();
    const updateItems = useTrackStore((state) => state.updateItems);
    const handleDoubleTap = (e) => {
        if(doubleTap && e.nativeEvent.state === State.ACTIVE)
        {
            item.liked = !item.liked;
            MicantoApi.like(item?.id);
            updateItems([item]);
        }
    }

    return (
        <TapGestureHandler
            onHandlerStateChange={(e) => {if(e.nativeEvent.state === State.ACTIVE) {clickHandler(item, e) }}}
            waitFor={doubleTapRef}>
            <TapGestureHandler
                onHandlerStateChange={handleDoubleTap}
                numberOfTaps={2}
                ref={doubleTapRef}>
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
                    <View>
                        <Image
                            style={{ height: 50, width: 50, borderRadius: 10, marginRight: 10 }}
                            source={cover ? { uri: cover } : require('../assets/img/logo.png')}
                        />
                        {item.liked &&
                            <View style={{position: "absolute", left: -5, bottom: -8}}>
                                <MaterialCommunityIcons
                                    name="heart"
                                    color={COLORS.primaryColor}
                                    size={20}
                                />
                            </View>
                        }
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
            </TapGestureHandler>
        </TapGestureHandler>
    );
}
