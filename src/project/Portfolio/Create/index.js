import React from 'react';
// import * as common from '../../components/Common/Common';
import { Provider } from 'react-redux';
import store from '../reducer/configStorePortfolio';
import {connect} from 'react-redux';
import AppPortfolio from './App';

function PortfolioCreate(props) {
    return(
        <Provider store={store}>
            <AppPortfolio subNumberChange={props.subNumberChange}/>
        </Provider>
        
    )
}

function mapStateToProps(state) {
    return { 
        subNumberChange: state.rootMain['SUB_NUMBER']
    };
}

export default connect(mapStateToProps) (PortfolioCreate);