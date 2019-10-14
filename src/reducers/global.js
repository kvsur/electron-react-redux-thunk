import TYPES from '../constants/COMMON_ACTION_TYPES';

export default function reducer(state, action) {
    const { type, payload } = action;

    switch(type) {
        // case TYPES.UPDATE_PAGE_TITLE: {
        //     const { pageTitle } = payload;
        //     return {
        //         ...state,
        //         pageTitle,
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
            const { deviceStatus } = payload;
            return {
                ...state,
                deviceStatus,
            };
        }
        default: {
            return {
                ...state,
            };
        }
    }
}
