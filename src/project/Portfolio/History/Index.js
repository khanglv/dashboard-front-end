import React, {Component} from 'react';
import { Provider } from 'react-redux';
import store from '../reducer/configStorePortfolio';
import {connect} from 'react-redux';
import AppHistory from './App';

class IndexHistory extends Component{
    render(){
        return(
            <Provider store={store}>
                <AppHistory subNumberChange={this.props.subNumberChange}/>
            </Provider>
        )
    }
}

function mapStateToProps(state) {
    return { 
        subNumberChange: state.rootMain['SUB_NUMBER']
    };
}

export default connect(mapStateToProps) (IndexHistory);