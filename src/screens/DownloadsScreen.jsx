import {FlatList, SafeAreaView} from "react-native";
import {useEffect, useState} from "react";
import ScrollSpacer from "../components/ScrollSpacer";
import ListItem from "../components/ListItem";
import {play} from "../services/MicantoPlayer";
import {useDownloaded} from "../stores/downloaded";
import Loader from "../components/Loader";
import {MicantoApi} from "../api/MicantoApi";
import {toTrackPlayerObject} from "../utils/helper";
import SelectHeader from "../components/SelectHeader";
import {deleteFiles} from "../services/Downloader";
export default function() {
    const [downloaded,removeDownloaded] = useDownloaded((state) => [state.downloaded, state.removeDownloaded]);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadList, setDownloadList] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectMode, setSelectMode] = useState(false);

    useEffect(() => {

        async function load() {
            let ids = downloaded.map(item => item['id']);
            MicantoApi.findByIds(ids).then((items) => {
                setDownloadList(toTrackPlayerObject(items.data));
                setIsLoading(false);
            });
        }

        load();

    }, []);

    const deleteHandler = async () => {
        setSelectMode(false);
        let filesToDelete = downloaded.filter((item) => {
           if(selected.indexOf(item.id) > -1) {
               return true;
           }
           return false;
        });
        await deleteFiles(filesToDelete);
        removeDownloaded(selected);
        selected.map((id) => {
            let indexToRemove = downloadList.findIndex(music => id === music.id);
            downloadList.splice(indexToRemove, 1);
        });
        setDownloadList(downloadList);
    }

    const longPressHandler = (item) => {
        setSelectMode(true);
        setSelected([item.id]);
        let index = downloadList.findIndex(music => music.id === item.id);
        downloadList[index].selected = !downloadList[index].selected;
        setDownloadList([...downloadList]);
    }

    const trackClickHandler = (item) => {
        if(selectMode) {
            let index = downloadList.findIndex(music => music.id === item.id);
            let selectedIndex = selected.findIndex((music => music === item.id));
            downloadList[index].selected = !downloadList[index].selected;
            setDownloadList([...downloadList]);

            if(selectedIndex > -1) {
                selected.splice(selectedIndex, 1);
            } else {
                selected.push(item.id);
            }
            setSelected([...selected]);
        }
        // else {
        //     play(item, {
        //         type: 'queue',
        //         id: null
        //     });
        // }
    }

    const resetSelectMode = () => {
        setSelectMode(false);
        setSelected([]);
        downloadList.map((item) => {
           item.selected = false;
        });
        setDownloadList([...downloadList]);
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <SafeAreaView>
            {selectMode === true && <SelectHeader count={selected.length} resetSelectMode={resetSelectMode} deleteHandler={deleteHandler}/>}
            <FlatList
                data={downloadList}
                renderItem={ ({item}) =>
                    <ListItem
                        item={item}
                        title={item.title}
                        subtitle={item?.artist}
                        cover={item.artwork}
                        clickHandler={trackClickHandler}
                        longPressHandler={longPressHandler}
                    /> }
                keyExtractor={item => item.id}
                ListFooterComponent={ <ScrollSpacer /> }
            />
        </SafeAreaView>
    )
}
