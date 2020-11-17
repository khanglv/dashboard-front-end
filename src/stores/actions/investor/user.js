import * as api from '../../api/api';
import {USER_REQUEST, USER_SUCCESS, USER_FAILED} from './actionTypes';

export const getListUser = fetchData => async (dispatch) => {
    dispatch({
        type: USER_REQUEST,
    })
    try {
        const res = await api.getListUser();
        if (res && !res.error) {
            return dispatch({
                type: USER_SUCCESS,
                data: res
            })
        } else {
            return dispatch({
                type: USER_FAILED,
                message: res.message,
            })
        }
    } catch (er) {
        return dispatch({
            type: USER_FAILED,
            message: er,
        })
    }
}
