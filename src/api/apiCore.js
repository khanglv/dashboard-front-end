import axios from 'axios';
import NProgress from 'nprogress';
import * as storage from './storage';
import * as common from '../components/Common/Common';

// const BASE_URL_CORE = "https://trading.vcsc.com.vn/rest/api/v1";

const BASE_URL_CORE = process.env.REACT_APP_BASE_URL;

// const BASE_URL_CORE = "http://10.11.13.150:3000/api/v1";
const BASE_URL_BUY_ABLE = `${BASE_URL_CORE}/equity/account/buyable`; //GET
const BASE_URL_SELL_ABLE = `${BASE_URL_CORE}/equity/account/sellable`;  //GET
const BASE_URL_EQUITY_ORDER = `${BASE_URL_CORE}/equity/order`;  //POST
const BASE_URL_MARKET = `${BASE_URL_CORE}/market`;  //GET (/stock , /futures)
const BASE_URL_EQUITY_ORDER_HISTORY = `${BASE_URL_CORE}/equity/order/history`; //GET
const BASE_URL_EQUITY_ORDER_STOP = `${BASE_URL_CORE}/equity/order/stop`; //GET
const BASE_URL_EQUITY_ORDER_STOP_HISTORY = `${BASE_URL_CORE}/equity/order/stop/history`; //POST
const BASE_URL_EQUITY_ORDER_STOP_CANCEL = `${BASE_URL_CORE}/equity/order/stop/cancel`; //GET
const BASE_URL_EQUITY_ORDER_CANCEL = `${BASE_URL_CORE}/equity/order/cancel`;  //PUT
const BASE_URL_EQUITY_ORDER_MODIFY = `${BASE_URL_CORE}/equity/order/modify`; //PUT
const BASE_URL_EQUITY_ACCOUNT_PROFITLOSS = `${BASE_URL_CORE}/equity/account/profitLoss`;  //GET
const BASE_URL_EQUITY_ACCOUNT_ASSET_INFO = `${BASE_URL_CORE}/equity/account/assetInfo`;  //GET
const BASE_URL_EQUITY_ACCOUNT_STOCK_DETAIL = `${BASE_URL_CORE}/equity/account/balance/details`;  //GET
const BASE_URL_EQUITY_ORDER_ADVANCE = `${BASE_URL_CORE}/equity/order/advance`;  //POST
const BASE_URL_EQUITY_ORDER_ADVANCE_HISTORY = `${BASE_URL_CORE}/equity/order/advance/history`;  //GET
const BASE_URL_EQUITY_ORDER_ADVANCE_CANCEL = `${BASE_URL_CORE}/equity/order/advance/cancel`;  //PUT
const BASE_URL_STOCK_CODE = `${BASE_URL_CORE}/market/stock`;  //PUT
const BASE_URL_CHANGE_HTS_PASSWORD = `${BASE_URL_CORE}/equity/account/changeHTSPassword`;  //PUT
const BASE_URL_DAILY_PROFIT = `${BASE_URL_CORE}/equity/account/dailyProfit`;  //GET
//trading view
const BASE_URL_TRADINGVIEW_HISTORY = `${BASE_URL_CORE}/tradingview/history`; //GET

const TIME_OUT = 10000;
// const IDVerify = "vcsc-rest";
// const PassVerify = "YRSfIzjbQgUaunSAolSjEWnaAAsRZUmzvzdcblbcrBqqzRGYyckXJKrEciCDWKTP";

// const IDVerify = "vcsc";
// const PassVerify = "vcsc";

// const IDVerify = "vcsc-rest";
// const PassVerify = "aCJ3gaDgQ4CRWCr1";

const doRequest = async (options, isProgress = true) => {
    try{
        if(isProgress){
            NProgress.start();
        }
        options = {
            ...options,
            timeout: TIME_OUT,
            config: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
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
                storage.removeStorageToken();
                window.location.href = "/login";
                common.notify('error', 'Your request in valid, try again !!!');
            }
            if(err.response.status === 501){
                common.notify('error', 'Request timeout, try again !!!');
                return;
            }
            if(err.response.status === 403){
                storage.removeStorageToken();
                window.location.href = "/login";
                common.notify('error', 'Bạn không có quyền truy cập, vui lòng đăng nhập lại !!!');
            }
            if(err.response.status === 404){
                return { ...err.response.data, error: true};
            }
            // common.notify("error", "Thao tác thất bại " + err.response.data.code);
            return { ...err.response.data, error: true};
        }else{
            common.notify('error', 'Server không phản hồi, thử lại !!!');
            return;
        }
    }
}

const callApi = (options, needToken = false, tokenCurrent = null, isProgress = true)=>{
    if(tokenCurrent){
        options = {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `jwt ${tokenCurrent}`
            }
        }
    }
    if(needToken){
        const accessToken = storage.accessTokenCore();
        options = {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `jwt ${accessToken}`
            }
        }
    }
    return doRequest(options, isProgress);
}


export const loginCore = async(dataTmp)=>{
    const url = `${BASE_URL_CORE}/login`;
    const data = {
        "grant_type": "password_otp", 
        "username": dataTmp.userName,
        "password": dataTmp.password
    };
    const options = {
        url: url,
        method: "POST",
        data: data
    }
    return callApi(options, false);
}

export const loginCoreOTP = (obj)=>{
    const url = `${BASE_URL_CORE}/login/sec/verifyOTP`;
    const data = {
        otp_value: obj.otp
    };
    const options = {
        url: url,
        method: "POST",
        data: data
    }
    return callApi(options, false, obj.token);
}

export const getCashBalance = (data)=>{
    const url = `${BASE_URL_CORE}/equity/account/cashBalance?accountNumber=${data.accountNumber}&subNumber=00`;
    const options = {
        url: url,
        method: "GET"
    }
    return callApi(options);
}

export const getUser = (data)=>{
    const url = `${BASE_URL_CORE}/equity/account/info?accountNumber=${data.accountNumber}`;
    const options = {
        url: url,
        method: "GET"
    }
    return callApi(options, true);
}

export const getAccountBank = (data)=>{
    const url = `${BASE_URL_CORE}/equity/withdraw/banks?accountNumber=${data.accountNumber}`;
    const options = {
        url: url,
        method: "GET"
    }
    return callApi(options, true);
}

export const getBanks = (data)=>{
    const url = `${BASE_URL_CORE}/equity/account/banks?accountNumber=${data.accountNumber}&subNumber=00`;
    const options = {
        url: url,
        method: "GET"
    }
    return callApi(options, true);
}

export const sendOTPMobile = (token)=>{
    const url = `${BASE_URL_CORE}/notifyMobileOtp`;
    const options = {
        url: url,
        method: "POST"
    }
    return callApi(options, false, token);
}

export const getBankAccount = (data)=>{
    const url = `${BASE_URL_CORE}/equity/account/banks?accountNumber=${data.accountNumber}&subNumber=${data.subNumber}`;
    const options = {
        url: url,
        method: "GET"
    }
    return callApi(options, true);
}

//************ API - Order **************

//GET danh sách C.Phiếu
export const getStockList = ()=>{
    const url = 'https://tradex-vn.s3.ap-southeast-1.amazonaws.com/market_data/market_data_gzip.json';
    const options = {
        url: url,
        method: "GET"
    }
    return callApi(options);
}

//Sử dụng api core 

//GET SL khả dụng, sức mua
export const getAccountBuyAble = (data)=>{
    const url = `${BASE_URL_BUY_ABLE}?accountNumber=${data.accountNumber}&orderPrice=${data.orderPrice}&orderQuantity=${data.orderQuantity}&subNumber=${data.subNumber}`;
    const options = {
        url: url,
        method: "GET"
    }
    return callApi(options, true);
}

//GET SL bán
export const getAccountSellAble = (data)=>{
    const url = `${BASE_URL_SELL_ABLE}?accountNumber=${data.accountNumber}&orderPrice=${data.orderPrice}&subNumber=${data.subNumber}&fetchCount=100`;
    const options = {
        url: url,
        method: "GET"
    }
    return callApi(options, true);
}

//Mua thường (/equity/order)
export const equityOrder = (data)=>{
    const url = BASE_URL_EQUITY_ORDER;
    const options = {
        url: url,
        method: "POST",
        data: data
    }
    return callApi(options, true);
}

//get info stock code & futures
export const getMarketStock = (stockCode)=>{
    const url = `${BASE_URL_MARKET}/stock/${stockCode}`;
    const options = {
        url: url,
        method: "GET"
    }
    return callApi(options, true);
}

export const getMarketFutures = (futuresCode)=>{
    const url = `${BASE_URL_MARKET}/futures/${futuresCode}`;
    const options = {
        url: url,
        method: "GET"
    }
    return callApi(options, true);
}

//get equity order history
export const getEquityOrderHistory = (data, isProgress)=>{
    const url = BASE_URL_EQUITY_ORDER_HISTORY;
    const options = {
        url: url,
        method: "GET",
        params: data
    }
    return callApi(options, true, null, isProgress);
}

//post equity order stop
export const equityOrderStop = (data)=>{
    const url = BASE_URL_EQUITY_ORDER_STOP;
    const options = {
        url: url,
        method: "POST",
        data: data
    }
    return callApi(options, true);
}

//get equity order stop history
export const getEquityOrderStopHistory = (data)=>{
    const url = BASE_URL_EQUITY_ORDER_STOP_HISTORY;
    const options = {
        url: url,
        method: "GET",
        params: data
    }
    return callApi(options, true);
}

//cancel equity order stop
export const equityOrderStopCancel = (data)=>{
    const url = BASE_URL_EQUITY_ORDER_STOP_CANCEL;
    const options = {
        url: url,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

//equity order cancel
export const equityOrderCancel = (data)=>{
    const url = BASE_URL_EQUITY_ORDER_CANCEL;
    const options = {
        url: url,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

//equity order modify
export const equityOrderModify = (data)=>{
    const url = BASE_URL_EQUITY_ORDER_MODIFY;
    const options = {
        url: url,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

//equity account profitLoss
export const equityAccountProfitLoss = (data)=>{
    const url = BASE_URL_EQUITY_ACCOUNT_PROFITLOSS;
    const options = {
        url: url,
        method: "GET",
        params: data
    }
    return callApi(options, true);
}

//equity account asset info
export const equityAccountAssetInfo = (data)=>{
    const url = BASE_URL_EQUITY_ACCOUNT_ASSET_INFO;
    const options = {
        url: url,
        method: "GET",
        params: data
    }
    return callApi(options, true);
}

//equity account stock detail
export const equityAccountStockDetail = (data)=>{
    const url = BASE_URL_EQUITY_ACCOUNT_STOCK_DETAIL;
    const options = {
        url: url,
        method: "GET",
        params: data
    }
    return callApi(options, true);
}

//equity order advance
export const equityOrderAdvance = (data)=>{
    const url = BASE_URL_EQUITY_ORDER_ADVANCE;
    const options = {
        url: url,
        method: "POST",
        data: data
    }
    return callApi(options, true);
}

//equity order advance history
export const equityOrderAdvanceHistory = (data)=>{
    const url = BASE_URL_EQUITY_ORDER_ADVANCE_HISTORY;
    const options = {
        url: url,
        method: "GET",
        params: data
    }
    return callApi(options, true);
}

//equity order advance cancel
export const equityOrderAdvanceCancel = (data)=>{
    const url = BASE_URL_EQUITY_ORDER_ADVANCE_CANCEL;
    const options = {
        url: url,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

//
export const getStockCodeQuote = (data, isProgress)=>{
    const url = `${BASE_URL_STOCK_CODE}/${data.stockCode}/quote`;
    const options = {
        url: url,
        method: "GET",
        params: {...data, stockCode: null}
    }
    return callApi(options, true, null, isProgress);
}

//change HTS password
export const changeHTSPassword = (data)=>{
    const url = BASE_URL_CHANGE_HTS_PASSWORD;
    const options = {
        url: url,
        method: "PUT",
        data: data
    }
    return callApi(options, true);
}

//daily profit
export const getDailyProfit = (data, isProgress = null)=>{
    const url = BASE_URL_DAILY_PROFIT;
    const options = {
        url: url,
        method: "GET",
        params: data
    }
    return callApi(options, true, null, isProgress);
}

//TRADING VIEW
export const loadTradingHistory = (data, isProgress)=>{
    const url = BASE_URL_TRADINGVIEW_HISTORY;
    const options = {
        url: url,
        method: "GET",
        params: data
    }
    return callApi(options, true, null, isProgress);
}