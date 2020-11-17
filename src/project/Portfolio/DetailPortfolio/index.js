import React, {Component} from 'react';
import { Provider } from 'react-redux';
import store from '../reducer/configStorePortfolio';
import {connect} from 'react-redux';
import AppDetailPortfolio from './App';

class IndexDetailPortfolio extends Component{
    render(){
        return(
            <Provider store={store}>
                <AppDetailPortfolio {...this.props}/>
            </Provider>
        )
    }
}

function mapStateToProps(state) {
    return { 
        subNumberChange: state.rootMain['SUB_NUMBER']
    };
}

export default connect(mapStateToProps) (IndexDetailPortfolio);