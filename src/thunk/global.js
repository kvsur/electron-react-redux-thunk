import { doPingApi, fetchClassInfo, getDeviceStatusApi, doAuthorizeApi } from '../serivces/global';
import TYPES from '../constants/COMMON_ACTION_TYPES';

export const doPing = () => {
    return async dispatch => {
        try {
            const res = await doPingApi();
            return Promise.resolve(res);
        } catch(e) {
            return Promise.resolve({
                code: -1,
                message: '网络异常，请检测网络连接',
            });
        }
    }
}

export const doAuthorize = ({deviceName, licenseId}) => {
    return async _ => {
        try {
            const res = await doAuthorizeApi({deviceName, licenseId});
            return Promise.resolve(res.code);
        } catch(e) {
            return Promise.resolve(-1);
        }
    }
}

export const getClassInfo = () => {
    return async dispatch => {
        try {
            const res = await fetchClassInfo();
            if (res.code === 0) {
                dispatch({
                    type: TYPES.UPDATE_CLASS_INFO,
                    payload: {...res.data},
                });
                return Promise.resolve(1);
            }
            throw new Error(res.message);
        } catch(e) {
            return Promise.resolve(0);
        }
    }
}

export const getDeviceStatus = (fromLoading=false) => {
    return async dispatch => {
        try {
            const res = await getDeviceStatusApi();
           if (res.code === 0 || res.code === -1) {
                dispatch({
                    type: TYPES.UPDATE_DEVICE_STATUS,
                    payload: {
                        deviceStatus: !!res.code ? (fromLoading ? '' : res.message) : '',
                        serviceReady: true,
                    },
                });
                return Promise.resolve({
                    ...res
                });
            }else {
                throw new Error('');
            }
        } catch(e) {
            dispatch({
                type: TYPES.UPDATE_DEVICE_STATUS,
                payload: {
                    deviceStatus: (fromLoading ? '' : '服务未就绪'),
                    serviceReady: false,
                },
            });
            return Promise.resolve({
                code: -1,
                message: (fromLoading ? '' : '服务未就绪')
            });
        }
    }
}
