import {useTranslation} from "react-i18next";
import {Common} from "../styles/styles";
import {View} from "react-native";
import {Text} from "react-native-paper";
import Carditem from "./Carditem";
import {useNavigation} from "@react-navigation/native";
import {play} from "../services/MicantoPlayer";

export default function LastSearches({lastSearches, removeFromLastSearch}) {
    const [t] = useTranslation();
    const navigation = useNavigation();

    const clickHandler = (item) => {
        switch(item.type) {
            case 'tracks':
                play(item.original, {
                    type: 'album',
                    id: item.original.album_id
                })
                break;
            case 'albums':
                navigation.navigate('Album',{
                    albumId: item.id
                })
                break;
            case 'artist':
                navigation.navigate('Artist',{
                    artistId: item.id
                })
                break;
        }
    }

    return(
        <View>
            {lastSearches.length > 0 &&
                <View>
                    <Text style={Common.headline}>{t('screens.search.lastSearches')}</Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 10, justifyContent: 'space-between'}}>
                    {lastSearches?.map((item, i) => (
                        <Carditem
                            title={item.title}
                            key={item.type+'-'+item.id}
                            cover={item.cover}
                            style={{width: '48%'}}
                            clickHandler={() => clickHandler(item)}
                        />
                    ))}
                    </View>
                </View>
            }
        </View>
    );
}
