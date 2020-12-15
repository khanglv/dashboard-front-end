import { combineReducers } from 'redux';
import login from './login';
import indexCore from './indexCore';
import indexInvestor from './indexInvestor';
import rootMain from './rootMain';
import indexMasterService from './indexMasterService';

//core
import loginCore from './loginCore';

export default combineReducers({
    login: login,
    loginCore: loginCore,
    indexCore: indexCore,
    indexInvestor: indexInvestor,
    indexMasterService: indexMasterService,
    rootMain: rootMain
});