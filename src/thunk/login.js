import { auth } from '../serivces/login';
import TYPES from '../constants/COMMON_ACTION_TYPES';
import { getSchedule } from './lesson';
import { getClassInfo, getDeviceStatus } from './global';

export const login = ({ userAccount, password}) => {
    return async dispatch => {
        // console.log(userAccount, password);
        try {
            // 首先对服务及其设备状态进行检测
            const checkedRes = await dispatch(getDeviceStatus());
            if (checkedRes.code !== 0) return Promise.reject(checkedRes.message);


            await dispatch(getClassInfo());
            const res = await auth({ userAccount, password});
            if (res.code === 0) {
                dispatch({
                    type: TYPES.UPDATE_USER_ACCOUNT,
                    payload: {
                        userAccount
                    }
                });
                dispatch({
                    type: TYPES.UPDATE_SUBJECT_LIST,
                    payload: {
                        ...res.data,
                    }
                });
                dispatch(getSchedule());
                return Promise.resolve();
            }
            throw new Error(res.message);
        } catch(e) {
            return Promise.reject('登录失败，请检测');
        }
    }
}