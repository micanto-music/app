import { useEffect, useState } from 'react';
import {Snackbar as PaperSnackbar, Text} from 'react-native-paper';

import SnackbarManager from './SnackbarManager';

const Snackbar = () => {
    const [state, setState] = useState({ visible: false });

    useEffect(() => {
        SnackbarManager.setListener((title) => setState({ visible: true, title }));
        return () => SnackbarManager.setListener(null);
    }, []);

    return (
        <PaperSnackbar style={{backgroundColor: '#07bc0c'}} visible={state.visible} onDismiss={() => setState({ ...state, visible: false })} duration={3000}>
            <Text>{state.title}</Text>
        </PaperSnackbar>
    );
};

export default Snackbar;
