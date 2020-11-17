import React, {Component} from 'react';
import {
    BrowserRouter,
    Route,
    Switch,
} from 'react-router-dom';

import {Error404} from '../components/Error404/Error404';
import Login from '../components/Login/Login';
import Loading from '../components/Loading/Loading';
import Test from '../components/Test';

import {
    FHome,
    FMainTrading,
    FOrderMain,
    FPortfolioCreate,
    FDetailPortfolio,
    FListPortfolio,
    FIndexHistory,
    FIndexAccountBalance,
    FIndexAccountBalanceDetail,
    FPortfolioInvesting,
    FInfoAccount,
    FChartReview,
    FAlertConfigs
} from '../layout/MainGeneral';


import jwtDecode  from 'jwt-decode';
import * as storage from '../api/storage';

const accessTokenAuth = localStorage.getItem('accessTokenCore');

class RouteURL extends Component{
    constructor(props){
        super(props);
        this.state = {
            isShowLoading: true
        }
    }
    componentDidMount(){
        this.setState({isShowLoading : false});
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(accessTokenAuth){
            if (jwtDecode(accessTokenAuth).exp < Date.now() / 1000) {
                storage.removeStorageToken();
                window.location.href = "/login";
                return false;
            }
            return true;
        }else{
            let currentRouteName = window.location.pathname;
            if(currentRouteName!=='/login'){
                window.location.href = "/login";
                return false;
            }
            return true;
        }
    }

    render() {
        return (
            <Loading isLoading={this.state.isShowLoading}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route exact path="/" component={FHome} />
                        <Route this path="/home" component={FHome} />
                        <Route this path="/web-trading" component={FMainTrading} />
                        <Route this path="/order-stock" component={FOrderMain} />
                        <Route this path="/portfolio-create" component={FPortfolioCreate} />
                        <Route this path="/detail-portfolio/:indexID" component={FDetailPortfolio} />
                        <Route this path="/list-portfolio" component={FListPortfolio} />
                        <Route this path="/history-portfolio" component={FIndexHistory} />
                        <Route this path="/account-balance" component={FIndexAccountBalance} />
                        <Route this path="/account-balance-detail" component={FIndexAccountBalanceDetail} />
                        <Route this path="/detail-portfolio-investing" component={FPortfolioInvesting} />
                        <Route this path="/info-account" component={FInfoAccount} />
                        <Route this path="/chart-review" component={FChartReview} />
                        <Route this path="/alert-configs" component={FAlertConfigs} />
                        <Route this path="/test" component={Test} />
                        <Route exact path="*" component={Error404} />
                    </Switch>
                </BrowserRouter>
            </Loading>
        );
    }
}

export default RouteURL;