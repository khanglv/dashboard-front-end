import { combineReducers } from 'redux';
import portFolio from './portFolio';
import rootMain from '../../../stores/reducers/rootMain';

export default combineReducers({
    portFolio: portFolio,
    rootMain: rootMain
});