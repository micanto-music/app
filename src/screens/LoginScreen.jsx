import {useState, useContext, useEffect} from "react";
import {SafeAreaView, View, Platform, Image, Pressable, Text} from "react-native";
import FormTextField from "../components/FormTextField";
import {login,loadUser} from "../services/AuthService";
import AuthContext from "../contexts/AuthContext";
import {Common} from "../styles/styles";
import {useTranslation} from "react-i18next";
import {getHost} from "../services/StorageService";
import OverlayLoader from "../components/OverlayLoader";
export default function() {
    const {setUser} = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [host, setHost] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [t] = useTranslation();
    const [loading, setLoading] = useState(false);

    const loadHost = async () => {
        let loadedHost = await getHost();
        setHost(loadedHost);
    }

    useEffect(() => {
        loadHost();
    }, []);

    async function handleLogin() {
        setErrors({});
        setLoading(true);
        try {
            await login(host, {
                email,
                password,
                device_name: `${Platform.OS} ${Platform.Version}`
            });
            const user = await loadUser();
            setUser(user);
            setLoading(false);
        } catch (e) {



            if(e.code === 'ERR_NETWORK') {
                setErrors({'host': [t('errors.host')]})
            }
            else if(e.response?.status === 422) {
                setErrors({'email': [t('errors.email')]})
            }
            else if(e.code === 'ERR_BAD_REQUEST') {
                setErrors({'password': [t('errors.toomany')]})
            }
            else {
                setErrors({'email': [t('errors.email')]})
            }

            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={Common.wrapper}>
            {loading &&
                <OverlayLoader />
            }
            <View style={{alignItems: 'center',padding: 20}}>
                <Image
                    source={require('../assets/img/logo.png')}
                    style={{width: 150, height: 150}}
                />
            </View>
            <View style={Common.container}>
                <FormTextField
                    label={t('screens.login.host')}
                    value={host}
                    onChangeText={(text) => setHost(text)}
                    errors={errors.host}
                />
                <FormTextField
                    label={t('screens.login.email')}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    errors={errors.email}
                />
                <FormTextField
                    label={t('screens.login.password')}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    errors={errors.password}
                />

                <Pressable style={Common.btnPrimary} onPress={handleLogin}>
                    <Text style={Common.btnText}>{t('screens.login.loginBtn')}</Text>
                </Pressable>
            </View>

        </SafeAreaView>
    )
}
