import  {View} from "react-native";
import Loader from "./Loader";

export default function OverlayLoader() {
    return (
        <View style={{
            position: 'absolute',
            zIndex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            top:0,
            left:0,
            right:0,
            bottom:0,
            backgroundColor: "#00000088"
        }}>
            <Loader />
        </View>
    );
}
