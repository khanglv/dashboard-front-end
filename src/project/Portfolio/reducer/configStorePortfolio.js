import {createStore, compose, applyMiddleware} from 'redux';
import rootReducer from './';
import thunk from 'redux-thunk';

const configureStore = createStore(rootReducer, compose(applyMiddleware(thunk)));

export default configureStore;