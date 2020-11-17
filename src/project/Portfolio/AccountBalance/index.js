import React, {Component} from 'react';
import { Provider } from 'react-redux';
import store from '../reducer/configStorePortfolio';
import {connect} from 'react-redux';
import AppAccountBalance from './App';

class IndexAccountBalance extends Component{
    render(){
        return(
            <Provider store={store}>
                <AppAccountBalance subNumberChange={this.props.subNumberChange}/>
            </Provider>
        )
    }
}

function mapStateToProps(state) {
    return { 
        subNumberChange: state.rootMain['SUB_NUMBER']
    };
}

export default connect(mapStateToProps) (IndexAccountBalance);