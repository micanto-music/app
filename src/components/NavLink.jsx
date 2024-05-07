import {TouchableOpacity} from "react-native";
import {Divider, Text} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import {Common} from "../styles/styles";

export default function NavLink({item, title}) {
    const navigation = useNavigation();


    const onNaviHandler = () => {
        navigation.navigate(item.to);
    }

    return(
        <TouchableOpacity onPress={onNaviHandler} style={Common.listItem}>
            <Text style={{marginRight: 10, width: 40, alignItems: 'center'}}>{item.icon}</Text>
            <Text style={{fontSize: 16}}>{title}</Text>
            <Divider />
        </TouchableOpacity>
    );

}
