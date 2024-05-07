// SnackbarManager.ts
class SnackbarManager {
    listener= null;

    constructor() {
        this.show = this.show.bind(this);
        this.setListener = this.setListener.bind(this);
    }

    setListener(listener) {
        this.listener = listener;
    }

    show(title) {
        this.listener?.(title);
    }
}

export default new SnackbarManager();
