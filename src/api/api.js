import axios from 'axios';
import * as storage from './storage';
import NProgress from 'nprogress';
import * as common from '../components/Common/Common';

// import { BASE_URL } from './configURL';

const BASE_URL = process.env.REACT_APP_BASE_URL_INVEST;
const BASE_URL_BOND = process.env.REACT_APP_BASE_URL_BONDS;
// const BASE_URL_BOND = 'http://10.11.0.113:3001';

const LOGIN_CORE = `${BASE_URL}/login/core`;
const URL_INDEX =`${BASE_URL}/indexs`;
const URL_PROPORTION =`${URL_INDEX}/proportion`;
const URL_UPLOAD_ICON =`${URL_INDEX}/uploadIcon`;
const URL_GET_INDEXS_ID =`${URL_INDEX}/getIndexsId`;
const URL_FILL_MONEY =`${URL_INDEX}/fillMoney`;
const URL_REFRESH_PRICE =`${URL_INDEX}/refreshPrice`;
const URL_MANAGEMENT_INDEX =`${URL_INDEX}/managementIndexs`;
const URL_ASSET_INFO_INDEX =`${URL_INDEX}/assetInfo`;
const URL_ORDER =`${BASE_URL}/order`;
const URL_HISTORY =`${BASE_URL}/history`;
const URL_HISTORY_INDEX_TIME =`${URL_HISTORY}/refreshIndexs`;
const URL_INDEX_INVESTING =`${URL_INDEX}/getIndexsInvestingId`;
const URL_INDEX_QUANTITY_FOR_SELL =`${URL_INDEX}/getQuantityForSell`;
const URL_INDEX_FILL_MONEY_SELL =`${URL_INDEX}/fillMoneySell`;
const URL_INDEX_REBALANCE =`${URL_INDEX}/rebalance`;
const URL_INDEX_UPDATE =`${URL_INDEX}/updateIndexs`;
const URL_INDEX_LOGS =`${URL_INDEX}/log`;
const URL_INDEX_REFRESH_SET_AGAIN =`${URL_INDEX}/refreshSetAgain`;
const URL_INDEX_MOVE =`${URL_INDEX}/move`;

//check token is available
const URL_CHECK_TOKEN = `${BASE_URL}/indexs/testToken`;

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
            // if(err.response.status === 404){
            //     common.notify('error', 'URL not found');
            //     return;
            // }
            return err.response.data;
        }else{
            common.notify('error', 'Server không phản hồi, thử lại !!!');
            return;
        }
    }
}

const doRequestFile = async (options) => {
    try{
        //NProgress.start();
        options = {
            ...options,
            timeout: TIME_OUT,
            config: {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        }
        const response = await axios(options);
        if(response.status>= 200 && response.status < 300){
            //NProgress.done();
            return response.data;
        }
    }catch(err){
        //NProgress.done();
        console.log(err.response);
        if(err.response){
            if(err.response.status === 401){
            }
            if(err.response.status === 501){
            }
            if(err.response.status === 403){
                window.location.href = "/login";
            }
        
            return err.response.data;
        }else{
            return;
        }
    }
}

const callApi = (options, needAuth = true, isFile = false)=>{
    if(needAuth){
        const accessTokenAuth = storage.accessTokenAuth();
        if(accessTokenAuth){
            options = {
                ...options,
                headers: {
                    Authorization: `Bearer ${accessTokenAuth}`
                }
            }
        }else{
            window.location.href = "/login";
            common.notify('error', 'Bạn không có quyền truy cập, vui lòng đăng nhập lại !!!');
        }
    }
    if(isFile){
        return doRequestFile(options);
    }else{
        return doRequest(options);
    }
}

export const loginApi = (userName, password)=> {
    const url = `${BASE_URL}/login`;
    const data = {
        "UserName": userName,
        "Password": password
    };
    const options = {
        url: url,
        method: "POST",
        data: data
    }
    return callApi(options, false);
}

export const loginWithCore = (data)=>{
    const url = LOGIN_CORE;
    const options = {
        url: url,
        method: "POST",
        data: data
    }
    return callApi(options, false);
}

export const actionProportion = (data)=>{
    const url = URL_PROPORTION;
    const options = {
        url: url,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

export const actionUploadIcon = (data)=>{
    const options = {
        url: URL_UPLOAD_ICON,
        method: "POST",
        data: data
    }
    return callApi(options, true, true);
}

export const actionCheckToken = (data)=>{
    const options = {
        url: URL_CHECK_TOKEN,
        method: "GET"
    }
    return callApi(options, true);
}

export const actionIndex = (data)=>{
    const options = {
        url: URL_INDEX,
        method: "POST",
        data: data
    }
    return callApi(options, true);
}

export const actionEditIndex = (data)=>{
    const options = {
        url: URL_INDEX,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

export const getListIndex = (data)=>{
    const options = {
        url: `${URL_INDEX}/${data.numberPage}/${data.subNumber}`,
        method: "GET"
    }
    return callApi(options, true);
}

export const getIndexsId = (data)=>{
    const options = {
        url: `${URL_GET_INDEXS_ID}/${data.indexsId}/${data.subNumber}`,
        method: "GET"
    }
    return callApi(options, true);
}

export const getFillMoney = (data)=>{
    const options = {
        url: URL_FILL_MONEY,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

export const onRefreshPrice = (data)=>{
    const options = {
        url: URL_REFRESH_PRICE,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

export const onOrderPortfolio = (data)=>{
    const options = {
        url: URL_ORDER,
        method: "POST",
        data: data
    }
    return callApi(options, true);
}

export const getIndexsManagement = (obj)=>{
    const options = {
        url: `${URL_MANAGEMENT_INDEX}/${obj.indexPage}/${obj.numberPage}/${obj.subNumber}`,
        method: "GET"
    }
    return callApi(options, true);
}

export const getHistory = (data)=>{
    const options = {
        url: URL_HISTORY,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

export const getHistoryIndexTime = (data)=>{
    const options = {
        url: URL_HISTORY_INDEX_TIME,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

export const getAssetInfoIndex = (subNumber)=>{
    const options = {
        url: `${URL_ASSET_INFO_INDEX}/${subNumber}`,
        method: "GET"
    }
    return callApi(options, true);
}

export const deleteIndex = (data)=>{
    const options = {
        url: URL_INDEX,
        method: "DELETE",
        data: data
    }
    return callApi(options, true);
}

export const getIndexInvesting = (data)=>{
    const options = {
        url: `${URL_INDEX_INVESTING}/${data.indexsId}`,
        method: "GET"
    }
    return callApi(options, true);
}

export const indexQuantityForSell = (data)=>{
    const options = {
        url: URL_INDEX_QUANTITY_FOR_SELL,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

export const indexFillMoneySell = (data)=>{
    const options = {
        url: URL_INDEX_FILL_MONEY_SELL,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

export const indexReblance = (data)=>{
    const options = {
        url: URL_INDEX_REBALANCE,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

export const indexUpdateBackground = (data)=>{
    const options = {
        url: URL_INDEX_UPDATE,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

export const indexLogs = (data)=>{
    const options = {
        url: URL_INDEX_LOGS,
        method: "POST",
        data: data
    }
    return callApi(options, true);
}

export const refreshSetAgain = (data)=>{
    const options = {
        url: URL_INDEX_REFRESH_SET_AGAIN,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

export const getListPortfolio = (data)=>{
    const options = {
        url: `${URL_INDEX}/investorVcsc`,
        method: "GET",
        params: data
    }
    return callApi(options, true);
}

export const getListIndexInvest = (data)=>{
    const options = {
        url: `${URL_INDEX}/invest`,
        method: "GET",
        params: data
    }
    return callApi(options, true);
}

export const listIndexMove = (data)=>{
    const options = {
        url: URL_INDEX_MOVE,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

export const actionIndexMove = (data)=>{
    const options = {
        url: URL_INDEX_MOVE,
        method: "POST",
        data: data
    }
    return callApi(options, true);
}

//connect bonds
export const connectBonds = (data)=>{
    const options = {
        url: `${BASE_URL_BOND}/login/hide`,
        method: "POST",
        data: data
    }
    return callApi(options, false);
}