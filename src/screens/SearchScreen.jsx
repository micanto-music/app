import React, {useState, useCallback, useRef, useEffect} from "react";
import {SafeAreaView, ScrollView, View} from "react-native";
import {Searchbar, Text} from "react-native-paper";
import {useTranslation} from "react-i18next";
import debounce from "lodash/debounce";
import {MicantoApi} from "../api/MicantoApi";
import AlbumCard from "../components/AlbumCard";
import ArtistCard from "../components/ArtistCard";
import {Common} from "../styles/styles";
import Loader from "../components/Loader";
import ListItem from "../components/ListItem";
import {arrToComma} from "../utils/helper";
import {useNavigation} from "@react-navigation/native";
import ScrollSpacer from "../components/ScrollSpacer";
import TrackSheet from "../components/BottomSheets/TrackSheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LastSearches from "../components/LastSearches";
import {play} from "../services/MicantoPlayer";

export default function() {

    const [searchQuery, setSearchQuery] = useState('');
    const [result,setResult] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [t] = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const bottomSheetModalRef = useRef(null);
    const [lastSearches, setLastSearches] = useState([]);


    useEffect(() => {
        async function getLastSearches() {
            let searches = await AsyncStorage.getItem('lastSearches');
            if(searches === null) searches = [];
            setLastSearches(JSON.parse(searches));
        }
        getLastSearches();
    }, []);

    const trackClickHandler = (item) => {
        play(item, {
            type: 'album',
            id: item.album_id
        });
    }
    const albumClickHandler = (item) => {
        navigation.navigate('Album', {
            albumId: item.id
        });
    }

    const artistClickHandler = (item) => {
        navigation.navigate('Artist', {
            artistId: item.id
        });
    }

    const debouncedSave = useCallback(
        debounce((newValue) => fetchData(newValue), 500),
        []
    );

    const updateValue = (newValue) => {
        if(newValue !== '') {
            setIsLoading(true);
        }
        setSearchQuery(newValue);
        debouncedSave(newValue);
    };

    const handleTrackMenu = (track) => {
        bottomSheetModalRef.current.present(track);
    }

    const fetchData = async (term) => {
        try {
            MicantoApi.searchFor(term).then((res) => {
                setIsLoading(false);
                if(!res.top) {
                    setNoResults(true);
                } else {
                    setNoResults(false);
                }
                setResult(res);

                if(res?.top) {

                    let top = {
                        id: res.top.id,
                        type: res.top.type,
                        title: res.top.title ? res.top.title : res.top.name,
                        cover: res.top.cover ? res.top.cover : res.top.image,
                        original: res.top
                    };

                    setLastSearches(prevLastSearches => {
                        if(!prevLastSearches) return [];
                        if(!prevLastSearches.some(search => {
                            return search.type === res.top.type && search.id === res.top.id
                        })) {
                            if(prevLastSearches.length == 10) {
                                prevLastSearches.pop();
                            }
                            return [top, ...prevLastSearches];
                        } else {
                            return [...prevLastSearches];
                        }
                    })
                }
            })
        } catch (error) {
            setIsLoading(false);
            console.error(error)
        }
    }

    const removeFromLastSearch = () => {}

    useEffect(() => {
        async function setLastSearches() {
            if(lastSearches && lastSearches.length > 0) {
                await AsyncStorage.setItem('lastSearches', JSON.stringify(lastSearches));
            }
        }
        setLastSearches();
    }, [lastSearches]);

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{...Common.header.headerStyle, padding: 10}}>
            <Searchbar
                placeholder={t('screens.search.placeholder')}
                onChangeText={updateValue}
                value={searchQuery}
            />
            </View>
            {isLoading ? (
                <Loader />
            ) : (
                <ScrollView>
                    {lastSearches && searchQuery === '' &&
                        <LastSearches lastSearches={lastSearches} removeFromLastSearch={removeFromLastSearch}/>
                    }
                    {noResults && searchQuery !== '' &&
                        <View><Text style={{padding: 10, textAlign: "center"}}>{t('screens.search.noResults')}</Text></View>
                    }
                    {result?.top &&
                        <View>
                            <Text style={Common.headline}>{t('screens.search.top')}</Text>
                            {result?.top?.type == 'tracks' &&
                            <ListItem
                                title={result?.top.title}
                                cover={result?.top.cover}
                                subtitle={arrToComma(result.top.artists, 'name')}
                                item={result?.top}
                                contextMenuHandler={handleTrackMenu}
                                clickHandler={trackClickHandler}
                            />
                            }
                            {result?.top?.type == 'artist' &&
                                <ListItem
                                    title={result?.top.name}
                                    cover={result?.top.image}
                                    subtitle={t('general.artist')}
                                    item={result?.top}
                                    clickHandler={artistClickHandler}
                                />
                            }
                            {result?.top?.type == 'albums' &&
                                <ListItem
                                    title={result?.top.name}
                                    cover={result?.top.cover}
                                    subtitle={result.top.artist.name}
                                    item={result?.top}
                                    clickHandler={albumClickHandler}
                                />
                            }
                        </View>
                    }

                {result?.tracks?.length > 0 &&
                    <View>
                        <Text style={Common.headline}>{t('screens.search.tracks')}</Text>
                        {result?.tracks?.map((track, i) => (
                            <ListItem
                                title={track.title}
                                subtitle={arrToComma(track.artists,'name')}
                                cover={track.cover}
                                item={track}
                                key={'tracks'+i}
                                contextMenuHandler={handleTrackMenu}
                                clickHandler={trackClickHandler}
                                context={{
                                    type: 'album',
                                    id: track.album_id
                                }}
                            />
                        ))}
                    </View>
                }

                {result?.albums?.length > 0 &&
                    <View className="flex-1 flex-row">
                        <Text style={Common.headline}>{t('screens.search.albums')}</Text>
                        <View style={Common.cardWrapper}>
                            {result?.albums?.map((album, i) => (
                                <AlbumCard album={album} key={'album'+i} context={{'type': 'search'}} style={{width: '48%', marginBottom: 20}} />
                            ))}
                        </View>
                    </View>
                }

                    {result?.artists?.length > 0 &&
                        <View>
                            <Text style={Common.headline}>{t('screens.search.artists')}</Text>
                            <View style={{
                                padding: 10,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: "space-between",
                                alignContent: "flex-start"
                            }}
                            >
                                {result?.artists?.map((artist, i) => (
                                    <ArtistCard artist={artist} key={'artist'+i} context={{'type': 'search'}} style={{width: '48%', marginBottom: 20}} />
                                ))}
                            </View>
                        </View>
                    }
                    <ScrollSpacer />
                </ScrollView>
            )}
            <TrackSheet bottomSheetModalRef={bottomSheetModalRef}/>
        </SafeAreaView>
    )
}
