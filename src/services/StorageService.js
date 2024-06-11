import AsyncStorage from '@react-native-async-storage/async-storage';

let token = null;
let host = null;
let downloaded = null;

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

export async function setDownloaded(newDownloaded) {
    downloaded = newDownloaded;
    if (downloaded !== null) {
        await AsyncStorage.setItem("downloaded", JSON.stringify(downloaded));
    } else {
        await AsyncStorage.removeItem("downloaded");
    }
}

export async function getDownloaded() {
    if(downloaded !== null) {
        return downloaded;
    }

    downloaded = await AsyncStorage.getItem("downloaded");
    return JSON.parse(downloaded);
}
