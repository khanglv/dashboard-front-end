import React, {Component} from 'react';
import { Provider } from 'react-redux';
import store from '../reducer/configStorePortfolio';
import {connect} from 'react-redux';
import AppPortfolioInvesting from './App';

class IndexPortfolioInvesting extends Component{
    render(){
        return(
            <Provider store={store}>
                <AppPortfolioInvesting {...this.props} subNumberChange={this.props.subNumberChange}/>
            </Provider>
        )
    }
}

function mapStateToProps(state) {
    return { 
        subNumberChange: state.rootMain['SUB_NUMBER']
    };
}

export default connect(mapStateToProps) (IndexPortfolioInvesting);