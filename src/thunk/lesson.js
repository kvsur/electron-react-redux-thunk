import { fetchClassSchedule, fetchClassInfo, classStart, classEnd } from '../serivces/lesson';
import TYPES from '../constants/COMMON_ACTION_TYPES';
import Bridge from '../utils/bridge';

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
            return Promise.reject(0);
        }
    }
}

export const getSchedule = () => {
    return async dispatch => {
        // console.log(userAccount, password);
        try {
            const res = await fetchClassSchedule();
            if (res.code === 0) {
                const data = res.data || [];

                const today = new Date().toLocaleString('zh-CN', {hour12: false, day: '2-digit', month: '2-digit', year: 'numeric'});

                const schedule = data.map(item => {
                    const { classStartTime, classEndTime } = item;
                    const milliesStartTime = new Date(`${today} ${classStartTime}`).getTime();
                    const milliesEndTime = new Date(`${today} ${classEndTime}`).getTime();
                    return {
                        ...item,
                        milliesStartTime,
                        milliesEndTime,
                    };
                }).sort((a, b) => a.milliesStartTime - b.milliesStartTime);

                const now = new Date().getTime();

                const firstSchedule = schedule.find(({milliesStartTime}) => (now < milliesStartTime));

                if (firstSchedule) {
                    Bridge.send('init-class', firstSchedule.milliesStartTime - now);
                }

                // const startTimeList =[], endTimeList = [];
                // const now = new Date().getTime();
                // data.forEach(item => {
                //     let { classStartTime, classEndTime } = item;
                //     const today = new Date().toLocaleString('zh-CN', {hour12: false, day: '2-digit', month: '2-digit', year: 'numeric'});

                //     classStartTime = new Date(`${today} ${classStartTime}`).getTime();
                //     classEndTime = new Date(`${today} ${classEndTime}`).getTime();

                //     // return {
                //     //     classStartTime,
                //     //     classEndTime
                //     // };
                //     if (classStartTime > now) startTimeList.push(classStartTime);
                //     if (classEndTime > now) endTimeList.push(classEndTime);
                // });

                // startTimeList.sort((a, b) => a - b);
                // endTimeList.sort((a, b) => a - b);

                // console.log(schedule);
                dispatch({
                    type: TYPES.UPDATE_SCHEDULE,
                    payload: {
                        schedule,
                    }
                });
                console.log('拉取作息表成功', schedule);
                return Promise.resolve();
            }
            throw new Error(res.message);
        } catch(e) {
            return Promise.reject(e.message);
        }
    }
}

export const startClass = ({time, subjectId, userAccount, scheduleTimeId}) => {
    return async dispatch => {
        try {
            const res = await classStart({time, subjectId , userAccount, scheduleTimeId});
            if (res.code === 0) {
                return Promise.resolve();
            }
            throw new Error(res.message);
        } catch(e) {
            return Promise.reject(e.message);
        }
    }
}

export const endClass = ({time, subjectId, userAccount, scheduleTimeId}) => {
    return async dispatch => {
        try {
            const res = await classEnd({time, subjectId, userAccount, scheduleTimeId});
            if (res.code === 0) {
                return Promise.resolve();
            }
            throw new Error(res.message);
        } catch(e) {
            return Promise.reject(e.message);
        }
    }
}