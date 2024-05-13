import {FlatList, SafeAreaView} from "react-native";
import ScrollSpacer from "../components/ScrollSpacer";
import {useEffect, useRef, useState} from "react";
import {MicantoApi} from "../api/MicantoApi";
import Loader from "../components/Loader";
import ListItem from "../components/ListItem";
import {arrToComma} from "../utils/helper";
import TrackSheet from "../components/BottomSheets/TrackSheet";
import {play} from "../services/MicantoPlayer";
export default function() {
    const [isLoading, setIsLoading] = useState(true);
    const [tracks, setTracks] = useState([]);
    const [page,setPage]=useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [isFirstPageReceived, setIsFirstPageReceived] = useState(false);
    const bottomSheetModalRef = useRef(null);

    useEffect(() => {
        MicantoApi.getTracks(1).then((res) => {
            setTracks(res.data);
            setIsLoading(false);
            !isFirstPageReceived && setIsFirstPageReceived(true);
        })
    }, []);

    const handleTrackMenu = (track) => {
        bottomSheetModalRef.current.present(track);
    }

    const fetchNextPage = () => {
        if (!hasNext) return;
        setIsLoading(true);
        setPage((prevPage) => prevPage + 1);
        MicantoApi.getTracks(page +1 ).then((tracks) => {
            if(tracks?.links?.next) {
                setHasNext(true);
            } else {
                setHasNext(false);
            }
            setIsLoading(false);
            setTracks((prevItems) => [...prevItems, ...tracks.data]);
        });
    }

    const context = {
        type: 'tracks',
        options: {
            'index': 0
        }
    }

    const playHandler = ( item, index) => {
        context.options.index = index;
        play(item, context);
    }

    if (!isFirstPageReceived && isLoading) {
        // Show loader when fetching first page data.
        return <Loader />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={tracks}
                renderItem={({item, index}) =>
                    <ListItem
                        title={item.title}
                        subtitle={arrToComma(item.artists,'name')}
                        cover={item.cover}
                        item={item}
                        clickHandler={(item) => playHandler(item, index)}
                        contextMenuHandler={handleTrackMenu}
                        context={context}
                    />
                }
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.8}
                keyExtractor={item => item.id}
                ListFooterComponent={ <ScrollSpacer /> }
            />
            <TrackSheet bottomSheetModalRef={bottomSheetModalRef}/>
        </SafeAreaView>
    )
}
