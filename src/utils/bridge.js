const electron = window.electron;
const { ipcRenderer } = electron || {};

function init() {
    if (ipcRenderer) {
        ipcRenderer.on('process_event', (_, event, ...params) => {
            const handles = Bridge.EVENT_MAP[event];

            if (handles instanceof Array) {
                const [...tempHandles] = handles;
                tempHandles.forEach(handle => {
                    try {
                        handle(...params);
                    } catch(e) {
                        console.error(e);
                    }
                });
            }
        });
    }
}

export default class Bridge {
    static EVENT_MAP = {
        any: [],
    };

    static send(event, ...data) {
        if (ipcRenderer) {
            ipcRenderer.send(event, ...data);
        }
    }

    static on(event, handle) {
        if (handle instanceof Function) {
            const handles = this.EVENT_MAP[event] || [];
            this.EVENT_MAP[event] = handles;

            if (handles.indexOf(handle) === -1) {
                return handles.push(handle);
            }
        }
        return [];
    }

    static cancel(event, handle) {
        const handles = this.EVENT_MAP[event];
        if (handles) {
            const index = handles.indexOf(handle);
            if (index !== -1) {
                handles.splice(index, 1);
            }
        }
    }
}

init();
