import axios from "../utils/axios";
export const MicantoApi = {

    getInitialData: async function () {
        const response = await axios.request({
            url: `/getAll`,
            method: "GET"
        })

        return response.data;
    },

    getTracks: async function (page = 1, cancel = false,) {
        const response = await axios.request({
            url: `/tracks?page=${page}&sort=tracks.title&order=asc`,
            method: "GET",
            // retrieving the signal value by using the property name
            //signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
        })

        return response.data;
    },

    searchFor: async function (word) {
        const response = await axios.request({
            url: `/search?term=${word}`,
            method: "GET"
        });

        return response.data;
    },

    getQueue: async function (context) {
        const response = await axios.request({
            url: `/player/getQueue`,
            method: "POST",
            data: {context: context}
        });

        return response.data;
    },

    getArtists: async function (page) {
        const response = await axios.request({
            url: `/artists?page=${page}`,
            method: "GET"
        });

        return response.data;
    },

    getArtist: async function (id) {
        const response = await axios.request({
            url: `/artist/${id}`,
            method: "GET"
        });

        return response.data;
    },

    getAlbums: async function (page) {
        const response = await axios.request({
            url: `/albums?page=${page}`,
            method: "GET"
        })

        return response.data;
    },

    getAlbum: async function (id) {
        const response = await axios.request({
            url: `/album/${id}`,
            method: "GET"
        }).catch(err => {
            throw new Response("", {
                status: 404,
                statusText: "Not Found",
            });
        });

        return response.data;
    },

    getPlaylists: async function () {
        const response = await axios.request({
            url: `/playlists`,
            method: "GET"
        });
        return response.data;
    },

    getPlaylist: async function (id, page = 1, sortField = 'tracks.title', order = 'asc') {
        const response = await axios.request({
            url: `/playlist/${id}?page=${page}&sort=${sortField}&order=${order}`,
            method: "GET"
        });
        return response.data;
    },

    addPlaylistItems: async function (id, type, ids) {
        const response = await axios.request({
            url: `/playlist/${id}/addItems`,
            method: "POST",
            data: {
                type: type,
                ids: ids
            }
        });

        return response.data;
    },
    removePlaylistItems: async function (id, type, ids) {
        const response = await axios.request({
            url: `/playlist/${id}/removeItems`,
            method: "POST",
            data: {
                type: type,
                ids: ids
            }
        });

        return response.data;
    },

    addPlaylist: async function (formData) {
        const response = await axios.request({
            url: `/playlist`,
            method: "PUT",
            data: {
                formData: formData
            }
        });
        return response.data;
    },

    editPlaylist: async function (formData) {
        const response = await axios.request({
            url: `/playlist/${formData.id}`,
            method: "POST",
            data: {
                formData: formData
            }
        });
        return response.data;
    },

    deletePlaylist: async function (id) {
        const response = await axios.request({
            url: `/playlist/${id}`,
            method: "DELETE"
        });
        return response.data;
    },

    updateSession: async function (currentTime, currentTrack, musicContext) {
        const response = await axios.request({
            url: `/player/updateSession`,
            method: "POST",
            data: {
                time: currentTime,
                track: currentTrack,
                context: musicContext
            }
        })

        return response.data;
    },

    setPlayed: async function (currentTrack) {
        const response = await axios.request({
            url: `/player/played`,
            method: "POST",
            data: {
                track: currentTrack
            }
        })

        return response.data;
    },

    like: async function (trackId) {
        const response = await axios.request({
            url: `/like`,
            method: "POST",
            data: {track: trackId}
        });
        return response.data;
    },

    getFavorites: async function (sortField = 'tracks.title', order = 'asc',  page = 1) {
        const response = await axios.request({
            url: `/favorites?page=${page}&sort=${sortField}&order=${order}`,
            method: "GET"
        });

        return response.data;
    },
}
