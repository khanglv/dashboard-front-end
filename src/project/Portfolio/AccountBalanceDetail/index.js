import React, {Component} from 'react';
import { Provider } from 'react-redux';
import store from '../reducer/configStorePortfolio';
import {connect} from 'react-redux';
import AccountBalanceDetailNew from './AccountBalanceDetailNew';
import FirstHeaderChil from '../../FirstHeaderChil';

class IndexAccountBalanceDetail extends Component{
    render(){
        return(
            <Provider store={store}>
                <FirstHeaderChil/>
                <AccountBalanceDetailNew subNumberChange={this.props.subNumberChange}/>
            </Provider>
        )
    }
}

function mapStateToProps(state) {
    return { 
        subNumberChange: state.rootMain['SUB_NUMBER']
    };
}

export default connect(mapStateToProps) (IndexAccountBalanceDetail);