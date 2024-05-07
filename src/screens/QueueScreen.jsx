import {FlatList, SafeAreaView} from "react-native";
import TrackPlayer from "react-native-track-player";
import {useEffect, useState} from "react";
import ScrollSpacer from "../components/ScrollSpacer";
import ListItem from "../components/ListItem";
import {play} from "../services/MicantoPlayer";
export default function() {
    const [queue, setQueue] = useState([])

    useEffect(() => {

        async function load() {
            let newQueue = await TrackPlayer.getQueue();
            setQueue(newQueue);
        }

        load();

    }, []);


    const trackClickHandler = (item) => {
        play(item, {
            type: 'queue',
            id: null
        });
    }

    return (
        <SafeAreaView>
            <FlatList
                data={queue}
                renderItem={ ({item}) =>
                    <ListItem
                        item={item}
                        title={item.title}
                        subtitle={item?.artist}
                        cover={item.artwork}
                        clickHandler={trackClickHandler}
                    /> }
                keyExtractor={item => item.id}
                ListFooterComponent={ <ScrollSpacer /> }
            />
        </SafeAreaView>
    )
}
