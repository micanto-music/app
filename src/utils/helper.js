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

// export const toApiObject = (track) => {
//     return {
//         id: track.id,
//         url: track.url, // Load media from the network
//         title: track.title,
//         artists: arrToComma(track.artists, 'name'),
//         album: track.album,
//         genre: track.gerne,
//         date: '2014-05-20T07:00:00+00:00', // RFC 3339
//         artwork: track.cover, // Load artwork from the network
//         duration: track.duration,
//     }
// }
export const toTrackPlayerObject = ( tracks, token ) => {
    return tracks.map((track) => {
        {
            return {
                id: track.id,
                url: track.url, // Load media from the network
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
