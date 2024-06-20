import {create} from "zustand";
import {setDownloaded} from "../services/StorageService";

export const useDownloaded = create((set, get) => ({
    downloaded: [],
    addDownloaded: (downloadObject) => {
        let downloaded = get().downloaded;
        let alreadyDownloadedIndex = downloaded.findIndex(track => track.id === downloadObject.id);
        if(alreadyDownloadedIndex > -1) {
            downloaded[alreadyDownloadedIndex] = downloadObject;
        } else {
           downloaded.push(downloadObject);
        }
        set(() => ({ downloaded: downloaded}));
        setDownloaded(downloaded);

    },
    setDownloaded: (downloaded) => {
        set(() => ({ downloaded: downloaded}));
    },
    removeDownloaded: (idsToRemove) => {
        let downloaded = get().downloaded;
        idsToRemove.map((id) => {
            let indexToRemove = downloaded.findIndex(music => id === music.id);
            downloaded.splice(indexToRemove, 1);
        });
        console.log(downloaded);
        set(() => ({ downloaded: downloaded}));

    },
    isDownloaded: (id) => {
        let downloaded = get().downloaded;
        let alreadyDownloadedIndex = downloaded.findIndex(track => track.id === id);
        return alreadyDownloadedIndex > -1;
    }
}));
