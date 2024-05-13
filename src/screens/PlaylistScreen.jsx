import { FlatList, SafeAreaView} from "react-native";
import React, { useEffect, useRef, useState} from "react";
import {MicantoApi} from "../api/MicantoApi";
import ScrollSpacer from "../components/ScrollSpacer";
import Loader from "../components/Loader";
import TrackSheet from "../components/BottomSheets/TrackSheet";
import DetailHeader from "../components/DetailHeader";
import {useTrackPlayer} from "../stores/trackPlayer";
import {useShallow} from "zustand/react/shallow";
import ListItem from "../components/ListItem";
import {arrToComma} from "../utils/helper";
import Header from "../components/Header";
import Animated, {useAnimatedScrollHandler, useSharedValue} from "react-native-reanimated";
import PlaylistSheet from "../components/BottomSheets/PlaylistSheet";
import EditPlaylistSheet from "../components/BottomSheets/EditPlaylistSheet";
import {play} from "../services/MicantoPlayer";
export default function({ route, navigation }) {
    const { itemId } = route.params;
    const [playlist, setPlaylist] = useState(null);
    const [playlists] = useTrackPlayer(useShallow(state => [state.playlists]));
    const [isLoading, setIsLoading] = useState(true);
    const [tracks, setTracks] = useState([]);
    const [page,setPage]=useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [isFirstPageReceived, setIsFirstPageReceived] = useState(false);
    const bottomSheetModalRef = useRef(null);
    const playlistModalRef = useRef(null);
    const editPlaylistModalRef = useRef(null);

    useEffect(() => {
        fetchFirstPage();
        let pl = playlists.filter(obj => {
            return obj.id == itemId
        })
        setPlaylist(pl? pl[0] : null);
    }, []);

    const sv = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: event => {
            'worklet';
            sv.value = event.contentOffset.y;
        },
    });

    const fetchFirstPage = () => {
        MicantoApi.getPlaylist(itemId).then((res) => {
            setTracks(res.data);
            setIsLoading(false);
            !isFirstPageReceived && setIsFirstPageReceived(true);
        })
    }

    const fetchNextPage = () => {
        if (!hasNext) return;
        setIsLoading(true);
        setPage((prevPage) => prevPage + 1);
        MicantoApi.getPlaylist(itemId,page +1 ).then((tracks) => {
            if(tracks?.links?.next) {
                setHasNext(true);
            } else {
                setHasNext(false);
            }
            setIsLoading(false);
            setTracks((prevItems) => [...prevItems, ...tracks.data]);
        });
    }

    const handleTrackMenu = (track) => {
        bottomSheetModalRef.current.present(track);
    }

    const handlePlaylistMenu = () => {
        playlistModalRef.current.present(playlist);
    }

    if (!isFirstPageReceived && isLoading && !playlist) {
        return <Loader />;
    }

    const context = {
        type: 'playlist',
        id: itemId,
        options: {
            index: 0,
            sortField: 'tracks.title',
            order: 'asc'
        }
    }

    const playHandler = ( item, index) => {
        context.options.index = index;
        play(item, context);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header
                title={playlist?.name}
                sv={sv}
                handleMenu={handlePlaylistMenu}
            />
            <Animated.FlatList
                data={tracks}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                ListHeaderComponent={<DetailHeader
                    title={playlist?.name}
                    image={playlist?.cover}
                    context={context}
                />}
                renderItem={({item,index}) => <ListItem
                    item={item}
                    title={item.title}
                    cover={item.cover}
                    subtitle={arrToComma(item.artists,'name')}
                    bottomSheetModalRef={bottomSheetModalRef}
                    clickHandler={(item) => playHandler(item, index)}
                    contextMenuHandler={handleTrackMenu}
                />}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.8}
                keyExtractor={item => item.id}

                ListFooterComponent={ <ScrollSpacer /> }
            />
            <TrackSheet itemId={itemId} bottomSheetModalRef={bottomSheetModalRef} onPlaylist={true}/>
            <PlaylistSheet
                itemId={itemId}
                bottomSheetModalRef={playlistModalRef}
                editRef={editPlaylistModalRef}

            />
            <EditPlaylistSheet
                itemId={itemId}
                bottomSheetModalRef={editPlaylistModalRef}
            />
        </SafeAreaView>
    )
}
