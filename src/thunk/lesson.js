import { getClassSchedule } from '../serivces/lesson';
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
                console.log(schedule);
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
            return Promise.reject(e);
        }
    }
}