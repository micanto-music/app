import {SafeAreaView} from "react-native";
import {MicantoApi} from "../api/MicantoApi";
import React, {useState, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import ScrollSpacer from "../components/ScrollSpacer";
import Loader from "../components/Loader";
import DetailHeader from "../components/DetailHeader";
import Header from "../components/Header";
import ListItem from "../components/ListItem";
import {arrToComma} from "../utils/helper";
import TrackSheet from "../components/BottomSheets/TrackSheet";
import {play} from "../services/MicantoPlayer";
import AlbumSheet from "../components/BottomSheets/AlbumSheet";
import Animated, {
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";
export default function({route}) {
    const { albumId } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [tracks, setTracks] = useState([]);
    const [album, setAlbum] = useState([]);
    const [t] = useTranslation();
    const bottomSheetModalRef = useRef(null);
    const albumSheetRef = useRef(null);

    const sv = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: event => {
            'worklet';
            sv.value = event.contentOffset.y;
        },
    });

    const handleTrackMenu = (track) => {
        bottomSheetModalRef.current.present(track);
    }

    const handleAlbumMenu = () => {
        albumSheetRef.current.present(album);
    }

    useEffect(() => {
        MicantoApi.getAlbum(albumId).then((res) => {
            setAlbum(res.album);
            setIsLoading(false);
            let combined = [];
            for (const [key, value] of Object.entries(res.discs)) {
                setTracks([...value]);
                combined.push(...value)
            }
            setTracks(combined);
        })
    }, []);



    const animatedStyles = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolate(
                sv.value,
                [0, 200],
                ['rgba(35,31,68,1.0)', 'rgba(35,31,68,0.0)'],
            ),
        };
    });

    if (isLoading) {
        return <Loader />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <Header
                sv={sv}
                title={album?.name}
                handleMenu={handleAlbumMenu}
            />

            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
            >
                <DetailHeader
                    title={album.name}
                    image={album.cover}
                    context={{
                        'type': 'album',
                        'id': album.id
                    }}
                />

                <Animated.View>
                    {tracks?.map((item, i) => (
                        <ListItem
                            item={item}
                            key={item.id}
                            title={item.title}
                            subtitle={arrToComma(item.artists,'name')}
                            cover={item.cover}
                            contextMenuHandler={handleTrackMenu}
                            clickHandler={(item) => play(item, {
                                type: 'album',
                                id: album.id
                            })}
                        />
                    ))}
                    <ScrollSpacer />
                </Animated.View>
            </Animated.ScrollView>
            {/*<FlatList*/}
            {/*    data={tracks}*/}
            {/*    renderItem={({item}) =>*/}
            {/*        <ListItem*/}
            {/*            item={item}*/}
            {/*            title={item.title}*/}
            {/*            subtitle={arrToComma(item.artists,'name')}*/}
            {/*            cover={item.cover}*/}
            {/*            contextMenuHandler={handleTrackMenu}*/}
            {/*            clickHandler={(item) => play(item, {*/}
            {/*                type: 'album',*/}
            {/*                id: album.id*/}
            {/*            })}*/}
            {/*        />}*/}
            {/*    keyExtractor={item => item.id + 'album'}*/}
            {/*    ListFooterComponent={() => <ScrollSpacer />}*/}
            {/*/>*/}
            <TrackSheet bottomSheetModalRef={bottomSheetModalRef}/>
            <AlbumSheet bottomSheetModalRef={albumSheetRef} />
        </SafeAreaView>
    )
}
