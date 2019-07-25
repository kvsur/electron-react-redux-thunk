import { getClassSchedule, classStart, classEnd } from '../serivces/lesson';
import TYPES from '../constants/COMMON_ACTION_TYPES';

export const getSchedule = () => {
    return async dispatch => {
        // console.log(userAccount, password);
        try {
            const res = await getClassSchedule();
            if (res.code === 'A0001') {
                const data = res.data || [];
                const schedule = data.map(item => {
                    let { studyRestBeginTime, studyRestEndTime } = item;
                    const today = new Date().toLocaleString('zh-CN', {hour12: false, day: '2-digit', month: '2-digit', year: 'numeric'});

                    studyRestBeginTime = new Date(`${today} ${studyRestBeginTime}`).getTime();
                    studyRestEndTime = new Date(`${today} ${studyRestEndTime}`).getTime();

                    return {
                        studyRestBeginTime,
                        studyRestEndTime
                    };
                });
                // console.log(schedule);
                dispatch({
                    type: TYPES.UPDATE_SCHEDULE,
                    payload: {
                        schedule,
                    }
                });
                return Promise.resolve();
            }
            throw new Error(res.message);
        } catch(e) {
            return Promise.reject(e.message);
        }
    }
}

export const startClass = ({time, subjectId}) => {
    return async dispatch => {
        try {
            const res = await classStart({time, subjectId});
            if (res.code === 'A0001') {
                return Promise.resolve();
            }
            throw new Error(res.message);
        } catch(e) {
            return Promise.reject(e.message);
        }
    }
}

export const endClass = ({time, subjectId}) => {
    return async dispatch => {
        try {
            const res = await classEnd({time, subjectId});
            if (res.code === 'A0001') {
                return Promise.resolve();
            }
            throw new Error(res.message);
        } catch(e) {
            return Promise.reject(e.message);
        }
    }
}