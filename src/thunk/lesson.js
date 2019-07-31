import { fetchClassSchedule, fetchClassInfo, classStart, classEnd } from '../serivces/lesson';
import TYPES from '../constants/COMMON_ACTION_TYPES';

export const getClassInfo = () => {
    return async dispatch => {
        try {
            const res = await fetchClassInfo();
            if (res.code === 'A0001') {
                dispatch({
                    type: TYPES.UPDATE_CLASS_INFO,
                    payload: {...res.data},
                });
                return Promise.resolve();
            }
            throw new Error(res.message);
        } catch(e) {
            return Promise.reject(e.message);
        }
    }
}

export const getSchedule = () => {
    return async dispatch => {
        // console.log(userAccount, password);
        try {
            const res = await fetchClassSchedule();
            if (res.code === 'A0001') {
                const data = res.data || [];
                const startTimeList =[], endTimeList = [];
                const now = new Date().getTime();
                data.forEach(item => {
                    let { classStartTime, classEndTime } = item;
                    const today = new Date().toLocaleString('zh-CN', {hour12: false, day: '2-digit', month: '2-digit', year: 'numeric'});

                    classStartTime = new Date(`${today} ${classStartTime}`).getTime();
                    classEndTime = new Date(`${today} ${classEndTime}`).getTime();

                    // return {
                    //     classStartTime,
                    //     classEndTime
                    // };
                    if (classStartTime > now) startTimeList.push(classStartTime);
                    if (classEndTime > now) endTimeList.push(classEndTime);
                });

                startTimeList.sort((a, b) => a - b);
                endTimeList.sort((a, b) => a - b);

                // console.log(schedule);
                dispatch({
                    type: TYPES.UPDATE_SCHEDULE,
                    payload: {
                        schedule: {
                            startTimeList,
                            endTimeList
                        },
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

export const startClass = ({time, subjectId, userAccount}) => {
    return async dispatch => {
        try {
            const res = await classStart({time, subjectId , userAccount});
            if (res.code === 'A0001') {
                return Promise.resolve();
            }
            throw new Error(res.message);
        } catch(e) {
            return Promise.reject(e.message);
        }
    }
}

export const endClass = ({time, subjectId, userAccount}) => {
    return async dispatch => {
        try {
            const res = await classEnd({time, subjectId, userAccount});
            if (res.code === 'A0001') {
                return Promise.resolve();
            }
            throw new Error(res.message);
        } catch(e) {
            return Promise.reject(e.message);
        }
    }
}