import * as api from '../../../api/api';
import {
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGIN_FAILED,
    LOGIN_WITH_CORE_REQUEST,
    LOGIN_WITH_CORE_SUCCESS,
    LOGIN_WITH_CORE_FAILED
} from './actionTypes';

export const loginRequest = (username)=>{
    return {
        type: LOGIN_REQUEST,
        username
    }
}

const loginSuccess= (info)=>{
    return {
        type: LOGIN_SUCCESS,
        info
    }
}

const loginFailed = (errorMessage, status)=>{
    return {
        type: LOGIN_FAILED,
        message: errorMessage,
    }
}

export const login = (username, password)=> (dispatch)=>{
    dispatch(loginRequest(username));
    return api.loginApi(username, password).then((response)=>{
        if(response && response.token){
            localStorage.setItem('accessTokenAuthKey', response.token);
            return dispatch(loginSuccess(response));
        }
        return dispatch(loginFailed(response.error));
    }).catch(err=>{
        console.log("login err " + JSON.stringify(err));
    });
}

export const loginWithCore = fetchData => async (dispatch) => {
    dispatch({
        type: LOGIN_WITH_CORE_REQUEST,
    })
    try {
        const res = await api.loginWithCore(fetchData);
        if (res && res.success) {
            localStorage.setItem('accessTokenAuthKey', res.data.TOKEN);
            return dispatch({
                type: LOGIN_WITH_CORE_SUCCESS,
                data: res.data
            })
        } else {
            return dispatch({
                type: LOGIN_WITH_CORE_FAILED,
                message: res.message,
            })
        }
    } catch (er) {
        return dispatch({
            type: LOGIN_WITH_CORE_FAILED,
            message: er,
        })
    }
}