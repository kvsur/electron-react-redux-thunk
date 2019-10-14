import TYPES from '../constants/COMMON_ACTION_TYPES';

export default function reducer(state, action) {
    const { type, payload } = action;

    switch(type) {
        case TYPES.UPDATE_USER_ACCOUNT: {
            const { userAccount } = payload;
            return {
                ...state,
                userAccount,
            };
        }
        case TYPES.UPDATE_SUBJECT_LIST: {
            const { name:userName, subjectList } = payload;
            return {
                ...state,
                userName,
                subjectList: [...subjectList],
                subjectId: subjectList[0].subjectId,
            };
        }
        case TYPES.UPDATE_CURRENT_SCHEDULE: {
            const { currentSchedule } = payload;
            return {
                ...state,
                currentSchedule,
            };
        }
        case TYPES.UPDATE_SCHEDULE: {
            const { schedule } = payload;
            return {
                ...state,
                schedule: [...schedule],
            };
        }
        case TYPES.UPDATE_SUBJECT_ID: {
            const { subjectId } = payload;
            return {
                ...state,
                subjectId,
            };
        }
        default: {
            return {
                ...state,
            };
        }
    }
}
