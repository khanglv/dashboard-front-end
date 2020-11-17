//action login core 
export const LOGIN_CORE_REQUEST = 'LOGIN_CORE_REQUEST';
export const LOGIN_CORE_SUCCESS = 'LOGIN_CORE_SUCCESS';
export const LOGIN_CORE_FAILED = 'LOGIN_CORE_FAILED';

//OTP login core 
export const LOGIN_OTP_REQUEST = 'LOGIN_OTP_REQUEST';
export const LOGIN_OTP_SUCCESS = 'LOGIN_OTP_SUCCESS';
export const LOGIN_OTP_FAILED = 'LOGIN_OTP_FAILED';

// get user
export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILED = 'GET_USER_FAILED';
//get account bank
export const GET_ACCOUNT_BANK_REQUEST = 'GET_ACCOUNT_BANK_REQUEST';
export const GET_ACCOUNT_BANK_SUCCESS = 'GET_ACCOUNT_BANK_SUCCESS';
export const GET_ACCOUNT_BANK_FAILED = 'GET_ACCOUNT_BANK_FAILED';

//get banks core
export const GET_BANK_CORE_REQUEST = 'GET_BANK_CORE_REQUEST';
export const GET_BANK_CORE_SUCCESS = 'GET_BANK_CORE_SUCCESS';
export const GET_BANK_CORE_FAILED = 'GET_BANK_CORE_FAILED';

export const ORDER_TYPE = {
    BANK_ACCOUNT: {
        LIST: {}
    },
    STOCKS: {
        LIST: null,
        QUOTE: []
    },
    BUY_ABLE: {
        LIST: {}
    },
    SELL_ABLE: {
        LIST: {}
    },
    EQUITY_ORDER: {
        LIST: [],
        HISTORY: [],
        CANCEL: {},
        MODIFY: {}
    },
    EQUITY_ORDER_STOP: {
        HISTORY: [],
        POST: {},
        CANCEL: {}
    },
    EQUITY_ORDER_ADVANCE: {
        HISTORY: [],
        POST: {},
        CANCEL: {}
    },
    MARKET_STOCK: {
        OBJ: []
    },
    MARKET_FUTURES: {
        OBJ: []
    },
    EQUITY_ACCOUNT: {
        PROFIT_LOSS: {},
        //ASSET_INFO: {},
        STOCK_DETAIL: [],
        HTSPassword: {}
    },
    DAILY: {
        PROFIT: []
    }
}


export const TRADING_VIEW = {
    TRADING: {
        HISTORY: {}
    }
}