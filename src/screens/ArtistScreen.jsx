import {
    SafeAreaView,
    View
} from "react-native";
import {MicantoApi} from "../api/MicantoApi";
import React, {useState, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Text} from "react-native-paper";
import {Common} from "../styles/styles";
import ListItem from "../components/ListItem";
import ScrollSpacer from "../components/ScrollSpacer";
import DetailHeader from "../components/DetailHeader";
import {arrToComma} from "../utils/helper";
import AlbumCard from "../components/AlbumCard";
import TrackSheet from "../components/BottomSheets/TrackSheet";
import ArtistSheet from "../components/BottomSheets/ArtistSheet";
import Header from "../components/Header";
import Animated, {useAnimatedScrollHandler, useSharedValue} from "react-native-reanimated";
import Loader from "../components/Loader";
import {play} from "../services/MicantoPlayer";

export default function({route}) {
    const { artistId } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [artist, setArtist] = useState(null);
    const [tracks, setTracks] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const [featured, setFeatures] = useState([]);
    const [t] = useTranslation();
    const bottomSheetModalRef = useRef(null);
    const artistSheetRef = useRef(null);

    const handleArtistMenu = () => {
        artistSheetRef.current.present(artist);
    }
    useEffect(() => {
        MicantoApi.getArtist(artistId).then((res) => {
            // response handling
            setAlbums(res.albums);
            setArtist(res.artist);
            setTopTracks(res.topTracks);
            setFeatures(res.featured);
            setTracks(res.tracks);
            setIsLoading(false);
        })
    }, []);

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

    if (isLoading) {
        return <Loader />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header
                title={artist.name}
                handleMenu={handleArtistMenu}
                sv={sv}
            />
            <Animated.ScrollView
                style={{ paddingTop: 0 }}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
            >
                <DetailHeader
                    title={artist.name}
                    image={artist.image}
                    context={{
                        'type': 'artist',
                        'id': artist.id
                    }}
                />

                {topTracks?.length > 0 &&
                    <View>
                        <Text style={Common.headline}>{t('screens.artist.topTracks')}</Text>
                        <View>
                            {topTracks?.map((track, i) => (
                                <ListItem
                                    item={track}
                                    key={track.id + '-'+i}
                                    cover={track.cover}
                                    title={track.title}
                                    subtitle={arrToComma(track.artists,'name')}
                                    clickHandler={(item) => play(item, {
                                        type: 'artist',
                                        id: artist.id
                                    })}
                                    contextMenuHandler={handleTrackMenu}
                                />
                            ))}
                        </View>
                    </View>
                }

                {albums?.length > 0 &&
                    <View>
                        <Text style={Common.headline}>{t('screens.artist.discography')}</Text>
                        <View style={Common.cardWrapper}>
                            {albums?.map((album, i) => (
                                <AlbumCard album={album} key={'album'+i} style={{width: '48%', marginBottom: 20}} />
                            ))}
                        </View>
                    </View>
                }

                {featured?.length > 0 &&
                    <View>
                        <Text style={Common.headline}>{t('screens.artist.features')}</Text>
                        <View>
                            {featured?.map((track, i) => (
                                <ListItem
                                    item={track}
                                    title={track.title}
                                    cover={track.cover}
                                    subtitle={arrToComma(track.artists,'name')}
                                    key={track.id + '-'+i}
                                    clickHandler={(item) => play(item, {
                                        type: 'artist',
                                        id: artist.id
                                    })}
                                    contextMenuHandler={handleTrackMenu}
                                />
                            ))}
                        </View>
                    </View>
                }
                <ScrollSpacer />
            </Animated.ScrollView>
            <TrackSheet bottomSheetModalRef={bottomSheetModalRef}/>
            <ArtistSheet bottomSheetModalRef={artistSheetRef}/>
        </SafeAreaView>
    )
}
