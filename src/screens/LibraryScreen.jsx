import {SafeAreaView, View, FlatList} from "react-native";
import {Text} from "react-native-paper";
import {links} from "../constants/links";
import {useTranslation} from "react-i18next";
import NavLink from "../components/NavLink";
import {Common} from "../styles/styles";
export default function() {

    const [t] = useTranslation();


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{flex:1}}>
                <Text style={{padding: 10, ...Common.h1}}>{t('screens.library.headline')}</Text>
                <FlatList
                    data={links}
                    renderItem={({item}) => <NavLink item={item} title={t(`screens.library.${item.name}`)}/>}
                />
            </View>
        </SafeAreaView>
    )
}
