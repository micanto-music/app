import {useEffect, useState} from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer }  from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import {loadUser} from "./src/services/AuthService";
import AuthContext from "./src/contexts/AuthContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import ButtonTabs from "./src/components/ButtonTabs";
import './src/localization/i18n';
import TrackPlayerScreen from "./src/screens/TrackPlayerScreen";
import {theme} from "./src/styles/theme";
import {Common} from "./src/styles/styles";
import SplashScreen from 'react-native-splash-screen'
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {getDownloaded} from "./src/services/StorageService";
import {useDownloaded} from "./src/stores/downloaded";
import {useTrackPlayer} from "./src/stores/trackPlayer";
import {useShallow} from "zustand/react/shallow";

const Stack = createNativeStackNavigator();
export default function App() {

    const [user,setUser] = useState();
    const [status,setStatus] = useState("loading");
    const [downloaded, addDownloaded] = useDownloaded(useShallow(state => [state.downloaded, state.setDownloaded]));
    useEffect(() => {
        async function runEffect() {
            try {
                const user = await loadUser();
                setUser(user);
                const localDownloaded = await getDownloaded();
                setDownloaded(localDownloaded);
                SplashScreen.hide();
            } catch(e) {
                SplashScreen.hide();
            }
        }

        setStatus("idle");

        runEffect();
    }, [])

    if(status === "loading") {

    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={theme}>
                <AuthContext.Provider value={{user, setUser}}>
                    <BottomSheetModalProvider>
                    <NavigationContainer theme={theme}>
                        <Stack.Navigator screenOptions={{orientation: 'portrait', headerShown: false, ...Common.header}}>
                            {user ? (
                                <Stack.Group>
                                    <Stack.Screen name="Buttons" component={ButtonTabs} />
                                    <Stack.Screen name="TrackPlayer" component={TrackPlayerScreen} options={{animation: 'fade_from_bottom',}}/>
                                </Stack.Group>

                            ) : (
                                <Stack.Screen name="Login" component={LoginScreen} />
                            )}
                        </Stack.Navigator>
                    </NavigationContainer>
                    </BottomSheetModalProvider>
                </AuthContext.Provider>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}
