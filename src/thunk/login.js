import { auth } from '../serivces/login';
import TYPES from '../constants/COMMON_ACTION_TYPES';
import { getSchedule } from './lesson';

export const login = ({ userAccount, password}) => {
    return async dispatch => {
        // console.log(userAccount, password);
        try {
            const res = await auth({ userAccount, password});
            if (res.code === 'A0001') {
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
            return Promise.reject(e.message);
        }
    }
}