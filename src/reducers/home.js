import TYPES from '@/constants/COMMON_ACTION_TYPES';

export default function reducer(state, action) {
    const { type, payload } = action;

    switch(type) {
        case TYPES.CHANGE_MODEL_LIST_LOADING: {
            return {
                ...state,
                ...payload
            };
        }
        case TYPES.UPDATE_MODEL_LIST: {
            return {
                ...state,
                models: [...state.models, payload.model]
            };
        }
        default: return {...state};
    }
}
