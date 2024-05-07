import { MD3DarkTheme as DefaultTheme } from 'react-native-paper';
import {COLORS} from "./styles";
export const theme = {
    ...DefaultTheme,
    // Specify custom property in nested object
    colors: {
        ...DefaultTheme.colors,
        primary: COLORS.primaryColor,
        surfaceScale: "#f1c40f",
        text: '#ffffff',
        background: COLORS.backgroundColor,
        bgLighter: COLORS.lightBackgroundColor,
        border: COLORS.border

    },
};
