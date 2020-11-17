import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    LOGIN_WITH_CORE_REQUEST,
    LOGIN_WITH_CORE_SUCCESS,
    LOGIN_WITH_CORE_FAILED
} from '../actions/investor/actionTypes';


const initialState = {
    username: '',
    password: '',
    accessToken: '',
    message: '',
    status: null,
    data: []
}

const reducer = (state = initialState, action)=>{
    switch(action.type){
        case LOGIN_REQUEST:
        case LOGIN_WITH_CORE_REQUEST:
            return{
                ...state,
                isFetching: true,
                isAuthenticated: false,
                message: '',
            }
        case LOGIN_SUCCESS:
            return{
                ...state,
                isFetching: true,
                isAuthenticated: true,
                message: '',
                accessToken: action.data.token
            }
        case LOGIN_WITH_CORE_SUCCESS:
            return{
                ...state,
                isFetching: true,
                isAuthenticated: true,
                message: '',
                accessToken: action.data.token
            }
        case LOGIN_FAILED:
        case LOGIN_WITH_CORE_FAILED:
            return {
                ...state,
                isFetching: false,
                isAuthenticated: false,
                message: action.message,
            }
        default: 
            return state;
    }
}

export default reducer;