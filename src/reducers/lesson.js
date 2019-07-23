import TYPES from '../constants/COMMON_ACTION_TYPES';

export default function reducer(state, action) {
    const { type, payload } = action;

    switch(type) {
        case TYPES.UPDATE_SUBJECT_LIST: {
            const { className, subjectList } = payload;
            return {
                ...state,
                className,
                subjectList: [...subjectList],
                subjectId: subjectList[0].id,
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
    // return {
    //     ...state
    // };
}
