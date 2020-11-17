import {
    LOGIN_CORE_REQUEST,
    LOGIN_CORE_SUCCESS,
    LOGIN_CORE_FAILED,
    LOGIN_OTP_REQUEST,
    LOGIN_OTP_SUCCESS,
    LOGIN_OTP_FAILED,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILED,
    GET_ACCOUNT_BANK_REQUEST,
    GET_ACCOUNT_BANK_SUCCESS,
    GET_ACCOUNT_BANK_FAILED,
    GET_BANK_CORE_REQUEST,
    GET_BANK_CORE_SUCCESS,
    GET_BANK_CORE_FAILED
} from '../actions/core/actionCoreType';

const initialState = {
    accessToken: '',
    message: '',
    data: [],
    dataOTP: [],
    dataUser: [],
    databank: [],
    coreBank: [],
}

const reducer = (state = initialState, action)=>{
    switch(action.type){
        case LOGIN_CORE_REQUEST:
        case LOGIN_OTP_REQUEST:
        case GET_USER_REQUEST:
        case GET_ACCOUNT_BANK_REQUEST:
        case GET_BANK_CORE_REQUEST:
            return{
                ...state,
                isFetching: true
            }
        case LOGIN_CORE_SUCCESS:
            return{
                ...state,
                data: action.data,
            }
        case LOGIN_OTP_SUCCESS:
            return{
                ...state,
                dataOTP: action.data,
            }
        case GET_USER_SUCCESS:
            return{
                ...state,
                dataUser: action.data,
            }
        case GET_ACCOUNT_BANK_SUCCESS:
            return{
                ...state,
                databank: action.data,
            }
        case GET_BANK_CORE_SUCCESS:
            return{
                ...state,
                coreBank: action.data,
            }
        case LOGIN_CORE_FAILED:
        case LOGIN_OTP_FAILED:
        case GET_USER_FAILED:
        case GET_ACCOUNT_BANK_FAILED:
        case GET_BANK_CORE_FAILED:
            return {
                ...state,
                message: action.message,
            }
        default: 
            return state;
    }
}

export default reducer;