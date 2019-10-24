import TYPES from '../constants/COMMON_ACTION_TYPES';

export default function reducer(state, action) {
    const { type, payload } = action;

    switch(type) {
        // case TYPES.UPDATE_PING_INFO: {
        //     const { serviceReady } = payload;
        //     return {
        //         ...state,
        //         serviceReady,
        //     };
        // }
        case TYPES.UPDATE_CLASS_INFO: {
            return {
                ...state,
                classInfo: {...payload}
            };
        }
        case TYPES.UPDATE_APP_VERSION: {
            const { appVersion } = payload;
            return {
                ...state,
                appVersion,
            };
        }
        case TYPES.UPDATE_DEVICE_STATUS: {
            const { deviceStatus, serviceReady } = payload;
            return {
                ...state,
                deviceStatus,
                serviceReady,
            };
        }
        default: {
            return {
                ...state,
            };
        }
    }
}
