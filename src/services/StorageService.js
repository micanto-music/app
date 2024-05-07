import AsyncStorage from '@react-native-async-storage/async-storage';

let token = null;
let host = null;

export async function setToken(newToken) {
    token = newToken;

    if (token !== null) {
        await AsyncStorage.setItem("token", token);
    } else {
        await AsyncStorage.removeItem("token");
    }
}

export async function getToken() {
    if (token !== null) {
        return token;
    }

    token = await AsyncStorage.getItem("token");
    return token;
}

export async function setHost(newHost) {
    host = newHost;

    if (host !== null) {
        await AsyncStorage.setItem("host", host);
    } else {
        await AsyncStorage.removeItem("host");
    }
}

export async function getHost() {
    if (host !== null) {
        return host;
    }

    host = await AsyncStorage.getItem("host");
    return host;
}
