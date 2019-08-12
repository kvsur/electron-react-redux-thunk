import TYPES from '../constants/COMMON_ACTION_TYPES';

export default function reducer(state, action) {
    const { type, payload } = action;

    switch(type) {
        case TYPES.UPDATE_PAGE_TITLE: {
            const { pageTitle } = payload;
            return {
                ...state,
                pageTitle,
            };
        }
        default: {
            return {
                ...state,
            };
        }
    }
}
