import {FlatList, SafeAreaView, View} from "react-native";
import {MicantoApi} from "../api/MicantoApi";
import {useState, useEffect} from "react";
import ScrollSpacer from "../components/ScrollSpacer";
import AlbumCard from "../components/AlbumCard";
import Loader from "../components/Loader";
import {Common} from "../styles/styles";

export default function() {
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [page,setPage]=useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [isFirstPageReceived, setIsFirstPageReceived] = useState(false);

    useEffect(() => {
        MicantoApi.getAlbums(1).then((res) => {
            setItems(res.data);
            setIsLoading(false);
            !isFirstPageReceived && setIsFirstPageReceived(true);
        })
    }, []);

    const fetchNextPage = () => {
        if (!hasNext) return;
        setIsLoading(true);
        setPage((prevPage) => prevPage + 1);
        MicantoApi.getAlbums(page +1 ).then((items) => {
            if(items?.links?.next) {
                setHasNext(true);
            } else {
                setHasNext(false);
            }
            setIsLoading(false);
            setItems((prevItems) => [...prevItems, ...items.data]);
        });
    }

    if (!isFirstPageReceived && isLoading) {
        return <Loader />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <FlatList
                    data={items}
                    renderItem={({item}) => <AlbumCard album={item} style={{width: '48%'}} />}
                    onEndReached={fetchNextPage}
                    onEndReachedThreshold={0.8}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    columnWrapperStyle={Common.row}
                    ListFooterComponent={ <ScrollSpacer /> }
                />
            </View>

        </SafeAreaView>
    )
}
