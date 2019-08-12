import { auth } from '../serivces/login';
import TYPES from '../constants/COMMON_ACTION_TYPES';
import { getSchedule, getClassInfo } from './lesson';

export const login = ({ userAccount, password}) => {
    return async dispatch => {
        // console.log(userAccount, password);
        try {
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
                dispatch(getClassInfo());
                dispatch(getSchedule());
                return Promise.resolve();
            }
            throw new Error(res.message);
        } catch(e) {
            return Promise.reject(e.message);
        }
    }
}