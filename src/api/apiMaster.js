import axios from 'axios';
import * as storage from './storage';
import NProgress from 'nprogress';
import * as common from '../components/Common/Common';

// import { BASE_URL } from './configURL';

const BASE_URL = process.env.REACT_APP_BASE_URL_MASTER_SERVICE;
const KEY_VERIFY = process.env.REACT_APP_BASE_URL_MASTER_KEY;

const GET_ALERT_CONFIGS = `${BASE_URL}/alert/configs`;
// const CREATE_ALERT_CONFIGS = `${BASE_URL}/alert/configs`;
// const EDIT_ALERT_CONFIGS = `${BASE_URL}/alert/configs`;
const GET_ALERT_SUB_CONTENT = `${BASE_URL}/alert/subContent`;
const GET_ALERT_MAIN_CONTENT = `${BASE_URL}/alert/mainContent`;

const TIME_OUT = 10000;

const doRequest = async (options) => {
    try {
        NProgress.start();
        options = {
            ...options,
            timeout: TIME_OUT,
            config: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        }
        const response = await axios(options);
        if(response.status>= 200 && response.status < 300){
            NProgress.done();
            return response.data;
        }
    }catch(err){
        NProgress.done();
        if(err.response){
            if(err.response.status === 401){
                common.notify('error', 'Your request in valid, try again !!!');
                storage.removeStorageToken();
                window.location.href = "/login";
                return;
            }
            if(err.response.status === 501){
                common.notify('error', 'Request timeout, try again !!!');
                return;
            }
            if(err.response.status === 403){
                window.location.href = "/login";
                common.notify('error', 'Bạn không có quyền truy cập, vui lòng đăng nhập lại !!!');
            }
            return err.response.data;
        }else{
            common.notify('error', 'Server không phản hồi, thử lại !!!');
            return;
        }
    }
}

const callApi = (options, needAuth = true)=>{
    if(needAuth){
        if(KEY_VERIFY){
            options = {
                ...options,
                headers: {
                    API_KEY: KEY_VERIFY
                }
            }
        }else{
            window.location.href = "/login";
            common.notify('error', 'Bạn không có quyền truy cập, vui lòng đăng nhập lại !!!');
        }
    }
    return doRequest(options);
}

export const getConfigs = (data)=>{
    const url = GET_ALERT_CONFIGS;
    const options = {
        url: url,
        method: "GET",
        params: data
    }
    return callApi(options);
}

export const updateConfigs = (data)=>{
    const url = GET_ALERT_CONFIGS;
    const options = {
        url: url,
        method: "PUT",
        data: data
    }
    return callApi(options);
}

export const getAlertSubContent = (data)=>{
    const url = GET_ALERT_SUB_CONTENT;
    const options = {
        url: url,
        method: "GET",
        parrams: data
    }
    return callApi(options);
}

export const getAlertMainContent = (data)=>{
    const url = GET_ALERT_MAIN_CONTENT;
    const options = {
        url: url,
        method: "GET",
        parrams: data
    }
    return callApi(options);
}