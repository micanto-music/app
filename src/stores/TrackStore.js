import {create} from "zustand";

const useTrackStore = create((set, get) => ({
    screenItems : [],
    setScreenItems: (items, type) => {
        const currentItems = get().screenItems;

        let newItems = {...currentItems};
        newItems[type] = items;

        set({
            screenItems: newItems
        })
    },
    addScreenItems: (items,type) => {
        const currentScreenItems = get().screenItems;
        let updated = {...currentScreenItems}
        let newItems = [...updated[type], items];

        updated[type] = newItems;
        set({
            screenItems: updated
        })
    },
    updateItems: (tracks) => {
        const currentScreenItems = get().screenItems;
        if(Object.entries(currentScreenItems).length) {
            let newScreenItems = {...currentScreenItems};
            for (const [type, screenItems] of Object.entries(currentScreenItems)) {
                tracks.map((track) => {
                    let index = screenItems.findIndex(music => music.id === track.id);
                    if(index > -1) {
                        newScreenItems[type][index] = track;
                    }
                });
            }
            set({
                screenItems: newScreenItems
            })
        }
    }
}));

export default useTrackStore;
