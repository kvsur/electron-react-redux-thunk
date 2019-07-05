import { getModel } from "../serivces/home";
import { message } from "antd";
import TYPES from '../constants/COMMON_ACTION_TYPES';

export const getSingleModel = () => {
    return async dispatch => {
        dispatch({
            type: TYPES.CHANGE_MODEL_LIST_LOADING,
            payload: {
                loading: true,
            }
        });
        let error = void 0;
        try {
            const model = await getModel();
            dispatch({
                type: TYPES.UPDATE_MODEL_LIST,
                payload: {
                    model
                }
            });
            // return Promise.resolve('1')
        } catch(e) {
            message.error(e.message);
            error = 1;
        } finally {
            dispatch({
                type: TYPES.CHANGE_MODEL_LIST_LOADING,
                payload: {
                    loading: false,
                }
            });
            return error ? Promise.reject() : Promise.resolve(12);
        }
    }
}