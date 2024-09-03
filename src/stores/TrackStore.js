import {create} from "zustand";

const useTrackStore = create((set, get) => ({
    items : [],
    setItems: (items) => {
        set({
            items: items
        });
    },
    addItems: (items) => set((state) => ({ items: [...state.items, ...items]})),
    updateItems: (response) => {
        const currentItems = get().items;
        let newItems = [ ...currentItems];

        // find updated items in items and update
        response['tracks'].map((track) => {
            let index = currentItems.findIndex(music => music.id === track.id);
            newItems[index] = track;
        });

        set({
            items: newItems
        })
    },
    trackCount: 0,
    setTrackCount: (count) => set(() => ({ trackCount: count })),
    trackLength: 0,
    setTrackLength: (length) => set(() => ({ trackLength: length })),
}));

export default useTrackStore;
