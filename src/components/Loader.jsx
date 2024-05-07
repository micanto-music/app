import {ActivityIndicator, View} from "react-native";
import {COLORS} from "../styles/styles";

export default function Loader() {
    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'}}
        >
            <ActivityIndicator size={'large'} color={COLORS.primaryColor}/>
        </View>
    );
}
