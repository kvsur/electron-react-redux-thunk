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
        try {
            const model = await getModel();
            dispatch({
                type: TYPES.UPDATE_MODEL_LIST,
                payload: {
                    model
                }
            });
        } catch(e) {
            message.error(e.message);
        } finally {
            dispatch({
                type: TYPES.CHANGE_MODEL_LIST_LOADING,
                payload: {
                    loading: false,
                }
            });
        }
    }
}