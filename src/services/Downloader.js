import RNBackgroundDownloader from '@kesha-antonov/react-native-background-downloader'
import RNFS from 'react-native-fs'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getHost, getToken} from "./StorageService";
import Bottleneck from "bottleneck";
import {bytesToHumanReadableString} from "../utils/helper";
import {useDownloaded} from "../stores/downloaded";

const addDownloaded = useDownloaded.getState().addDownloaded;

export const BackgroundDownloader = () => {
    const userAgent = 'Micanto/Android Mobile App'
    RNBackgroundDownloader.setConfig({
        headers: {
            'user-agent': userAgent
        }
    })

    return RNBackgroundDownloader
}

export const getDownloadedFilePath = async (id) => {
    const ext = '.mp3';
    const [downloader, customLocation] = await Promise.all([
        BackgroundDownloader(),
        AsyncStorage.getItem('EXT_STORAGE_DLOAD_LOCATION')
    ])
    const folderPath = customLocation ? customLocation : downloader.directories.documents;
    return `${folderPath}/${id}${ext}`
}

export const downloadTrack = async (
    track,
    restart = false
) => {

    const [downloader, customLocation] = await Promise.all([
        BackgroundDownloader(),
        AsyncStorage.getItem('EXT_STORAGE_DLOAD_LOCATION')
    ])
    const ext = '.mp3';
    const folderPath = customLocation ? RNFS.TemporaryDirectoryPath : downloader.directories.documents
    const destination = `${folderPath}/${track.id}${ext}`
    const host = await getHost();
    const downloadUrl = host+'/api/download/track/'+track.id;
    const token = await getToken();
    const timeout = 1000;

    const progressLimiter = new Bottleneck({
        highWater: 0,
        maxConcurrent: 1,
        minTime: 2000
    });

    // console.log({test: {Authorization: `Bearer ${token}`}});

    // setTimeout(() => {
        const task = downloader
            .download({
                id: 'track'+track.id,
                url: downloadUrl,
                destination: destination,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .begin((expectedBytes) => {
                console.log(`Going to download ${expectedBytes} bytes!`);
                if (!restart) {
                    // downloadTasks.push(task)
                    // episode.podcast = podcast
                    // addDownloadingEpisode(episode)
                } else {
                    // const downloadTaskIndex = downloadTasks.indexOf((x: any) => x.episodeId === episode.id)
                    // if (downloadTaskIndex > -1) {
                    //     downloadTasks[downloadTaskIndex] = task
                    // } else {
                    //     downloadTasks.push(task)
                    // }
                }
            })
            .progress(({ bytesDownloaded, bytesTotal }) => {
                console.log('progress?')
                progressLimiter
                    .schedule(() => {
                        const percent = bytesDownloaded / bytesTotal
                        const written = bytesToHumanReadableString(bytesDownloaded)
                        const total = bytesToHumanReadableString(bytesTotal)
                        console.log(percent, written, total);
                        // DownloadState.updateDownloadProgress(episode.id, percent, written, total)
                    })
                    .catch(() => {
                        // limiter has been stopped
                    })
            })
            .done(() => {
                addDownloaded({
                    id: track.id,
                    path: destination
                });
                console.log('Finished')
                // finishedDownloadQueue.enqueue(() =>
                //     finishDownload({
                //         customLocation,
                //         ext,
                //         episode,
                //         origDestination,
                //         podcast,
                //         progressLimiter
                //     })
                // )
            })
            .error((error) => {
                console.log('error' + error.errorCode);
                // DownloadState.updateDownloadError(episode.id)
                // errorLogger(_fileName, 'Download canceled', error)
            })
    // }, timeout)

}
