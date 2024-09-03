import React, {useEffect, useRef, useState} from "react";
import {FlatList, SafeAreaView} from "react-native";
import ListItem from "../components/ListItem";
import {arrToComma} from "../utils/helper";
import {MicantoApi} from "../api/MicantoApi";
import ScrollSpacer from "../components/ScrollSpacer";
import Loader from "../components/Loader";
import {play} from "../services/MicantoPlayer";
import TrackSheet from "../components/BottomSheets/TrackSheet";
export default function() {

    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const bottomSheetModalRef = useRef(null);

    const context = {
        type: 'favorites',
        options: {
            index: 0,
            sortField: 'tracks.title',
            order: 'asc'
        }
    }

    useEffect(() => {
        MicantoApi.getFavorites('tracks.title', 'asc', 1).then((tracks) => {
            setTracks(tracks.data);
            setIsLoading(false);
        });
    }, []);

    const handleTrackMenu = (track) => {
        bottomSheetModalRef.current.present(track);
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={tracks}
                renderItem={ ({item}) =>
                    <ListItem
                        item={item}
                        title={item.title}
                        cover={item.cover}
                        subtitle={arrToComma(item.artists,'name')}
                        bottomSheetModalRef={bottomSheetModalRef}
                        clickHandler={(item) => play(item, context)}
                        contextMenuHandler={handleTrackMenu}
                    /> }
                keyExtractor={item => item.id}
                ListFooterComponent={ <ScrollSpacer /> }
            />
            <TrackSheet bottomSheetModalRef={bottomSheetModalRef}/>
        </SafeAreaView>
    )

}
