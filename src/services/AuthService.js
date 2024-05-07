import axios from "../utils/axios";
import {setHost, setToken} from "./StorageService";

export async function login(host, credentials) {
    const {data} = await axios.post(host+"/api/login", credentials);
    await setHost(host);
    await setToken(data.token);
}

export async function loadUser(credentials) {
    const { data: user } = await axios.get("/user");
    return user.data;
}

export async function logout() {
    await axios.post("/logout", {})
    await setToken(null);
}
