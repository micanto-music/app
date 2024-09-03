import {create} from "zustand";

const usePlaylistStore = create((set, get) => ({
    playlists : [],
    setPlaylists: (playlists) => {
        set({
            playlists: playlists
        });
    },
    updatePlaylist: (playlist) => {
        let playlists =   get().playlists;
        let index = playlists.findIndex(pl => pl.id === playlist.id);
        if(index > -1) {
            playlists[index] = playlist;
        }
        set({
            playlists: playlists
        });
    }
}));

export default usePlaylistStore;
