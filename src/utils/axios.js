import axiosLib from "axios";
import {getHost, getToken} from "../services/StorageService";

const axios = axiosLib.create({
    headers: {
        Accept: "application/json"
    }
});

var isAbsoluteURLRegex = /^(?:\w+:)\/\//;

axios.interceptors.request.use(async( req) => {
    const token = await getToken();
    const host = await getHost();

    if(token !== null) {
        req.headers["Authorization"] = `Bearer ${token}`;
    }

    if ( !isAbsoluteURLRegex.test(req.url) && host !== null ) {
        req.url = host + '/api' + req.url;
    }

    return req;
});

export default axios;
