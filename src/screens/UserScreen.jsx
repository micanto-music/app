import {FlatList, Image, SafeAreaView, ScrollView, TouchableOpacity, View} from "react-native";
import NavLink from "../components/NavLink";
import {useTranslation} from "react-i18next";
import {Text} from "react-native-paper";
import {logout} from "../services/AuthService";
import {useContext} from "react";
import AuthContext from "../contexts/AuthContext";
import defaultUserImage from "../assets/img/user.png";
import {Common} from "../styles/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function() {
    const [t] = useTranslation();
    const {user, setUser } = useContext(AuthContext);
    const defaultUri = Image.resolveAssetSource(defaultUserImage).uri

    async function handleLogout() {
        await logout();
        setUser(null);
    }
    return(
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{flex:1}}>
                <ScrollView>
                    <View style={{padding: 10}}>
                        <Text style={Common.h1}>Hi, {user.name}</Text>
                        <View style={{paddingVertical: 20,alignItems: 'center'}}>
                            <Image
                                source={user?.image ? { uri: user.image } : {uri: defaultUri}}
                                style={{width:100, height: 100, borderWidth: 4, borderColor:'#fff', borderRadius: 100, marginBottom: 20}}/>
                            <Text style={{fontWeight: "bold"}}>{user.name}</Text>
                            <Text>{user.email}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={Common.listItem}>
                        <Text style={{marginRight: 10, width: 40, alignItems: 'center'}}><MaterialIcons size={28} name="logout" /></Text>
                        <Text style={{fontSize: 16}}>{t('screens.user.logout')}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );

}
