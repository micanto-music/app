import {StyleSheet} from "react-native";

export const COLORS = {
    primaryColor: '#ff69b4',
    secondaryColor: '#ff69b4',
    secondaryActiveColor: '#fc3f9e',
    backgroundColor: '#23263d',
    darkBackgroundColor: '#0d0e1c',
    lightBackgroundColor: '#383d5f',
    border: '#383a5a',
    lightGray: '#ccd0d8',
    gray: '#9ca3af',
    active: '#47d3ee',
    error: '#fc3f9e',
}

export const FONTS = {
    h2: {fontSize: 18, fontWeight: 'bold'},
    body: {fontSize: 12}
}

export const Common = StyleSheet.create({
    header: {
        headerStyle: {
            backgroundColor: '#222222',
        }
    },
    wrapper: {
        flex: 1,
        backgroundColor: COLORS.backgroundColor
    },
    container: {
        padding: 10,
        flex: 1
    },
    contextButton: {
        borderWidth: 2,
        borderColor:COLORS.border,
        borderRadius: 100,
        padding: 5
    },
    row: {
        flex: 1,
        padding: 10,
        justifyContent: "space-between"
    },
    sheet: {
        view: {
            // flex: 1
            minHeight: 100,
            paddingBottom: 50
        },
        sheetModal: {
            flex: 1,
            padding: 24,
            zIndex: 1000,
        },
    },
    cardWrapper: {
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "space-between",
        alignContent: "flex-start"
    },
    card: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.lightBackgroundColor,
        // width: '48%',
        padding: 10,
        // marginBottom: 10,
    },
    playlistItem: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.lightBackgroundColor,
        padding: 10,
    },
    listItem: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        height: 60
    },
    btnPrimary: {
        marginTop: 20,
        padding: 10,
        backgroundColor: COLORS.secondaryColor,
        borderRadius: 10
    },
    btnText: {
        color: "#fff",
        textAlign: "center"
    },
    headline: {
        fontWeight: "bold",
        fontSize: 18,
        marginLeft: 10,
        marginTop: 10
    },
    h1: {
        fontWeight: "bold",
        fontSize: 22,
    },
    playPauseContainer: {
        height: 60,
        width: 60,
        backgroundColor: '#ffffff',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
