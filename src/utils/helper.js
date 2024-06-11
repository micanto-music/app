import {useDownloaded} from "../stores/downloaded";
import {getDownloadedFilePath} from "../services/Downloader";
import RNFS from 'react-native-fs';
const downloaded = useDownloaded.getState().downloaded;
const addDownloaded = useDownloaded.getState().addDownloaded;

export const trimText = (text, maxLength) => {
    return text.length > maxLength
        ? text.substring(0, maxLength) + '...'
        : text.trim()
}

export const arrToComma = (arr, key) => {
    return arr.map(item => item[key]).join(', ');
}

export const secondsToHHMMSS = (seconds) => {
    seconds = Number(seconds)
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor((seconds % 3600) % 60)
    const hrs = h > 0 ? (h < 10 ? `0${h}:` : `${h}:`) : ''
    const mins = m > 0 ? (m < 10 ? `0${m}:` : `${m}:`) : '00:'
    const secs = s > 0 ? (s < 10 ? `0${s}` : s) : '00'
    return `${hrs}${mins}${secs}`
}

export const bytesToHumanReadableString = (bytes) => {
    let thresh = 1000;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}

export const trackUrl = (track) => {
    let index = downloaded.findIndex(music => music.id === track.id);

    if(index > -1) {
        // console.log('downloaded');
        return 'file://'+downloaded[index].path;
    }

    (async () => {
    try {
        const filePath = await getDownloadedFilePath(track.id);
        await RNFS.stat(filePath);
        // console.log('local');
        addDownloaded({
            id: track.id,
            path: filePath
        })

        return 'file://'+filePath;
    } catch (innerErr) {
        //
    }
    })();

    return track.url;
}

export const toTrackPlayerObject = ( tracks, token ) => {
    return tracks.map((track) => {
        {
            return {
                id: track.id,
                // url: track.url, // Load media from the network
                url: trackUrl(track),
                title: track.title,
                artist: arrToComma(track.artists, 'name'),
                artistId: track.artists[0].id,
                albumId: track.album_id,
                album: track.album,
                genre: track.gerne,
                date: '2014-05-20T07:00:00+00:00', // RFC 3339
                artwork: track.cover, // Load artwork from the network
                duration: track.duration,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        }
    });
}

export const reorderArr = (i, arr) => {
    return [...arr.slice(i), ...arr.slice(0,i)];
}

export const cleanQuery = (query) => {
    query = query || '';
    query = query.toLowerCase();
    // clean words
    query = query.replace(/in micanto$|in me canto$/g, '');
    query = query.replace(/on micanto$|on me canto$/g, '');
    query = query.trim()
    return query
}
