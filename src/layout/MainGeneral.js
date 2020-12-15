import React from 'react';
//import layout
import SiderBarMenu from './SiderBarMenu/SiderBarMenu';
import HeaderCom from './HeaderCom';

//import project
import MainTrading from '../project/TradingView/MainTrading';
import OrderMain from '../project/Order/index';
import PortfolioCreate from '../project/Portfolio/Create/index';
import DetailPortfolio from '../project/Portfolio/DetailPortfolio/index';
import ListPortfolio from '../project/Portfolio/ListPortfolio/Index';
import IndexHistory from '../project/Portfolio/History/Index';
import IndexAccountBalance from '../project/Portfolio/AccountBalance/index';
import IndexAccountBalanceDetail from '../project/Portfolio/AccountBalanceDetail/index';
import IndexPortfolioInvesting from '../project/Portfolio/PortfolioInvesting/index';
import InfoAccount from '../components/InfoAccount/InfoAccount';
import ChartReview from '../project/ChartReview/index';

//Alert
import AlertConfigs from '../project/Alert/Configs';
import ManagementAlert from '../project/Alert/ManagementAlert'

import {Event} from '../components/Common/Event';

import { UnorderedListOutlined, LeftOutlined } from '@ant-design/icons';
import "./styles.css"

//** Import các component **
import Home from '../components/Home/Home';

import { Layout } from 'antd';

// function defaultHeaderChil(){
//     return(
//         <div></div>
//     )
// }
let componentEvent = new Event();

function Main (View, props){
    const [isOpenMenu, setOpenMenu] = React.useState(false);
    
    const openMennu = (status) => (event)=>{
        setOpenMenu(status);
    }

    const _onCloseMenu = ()=> {
        setOpenMenu(false);
    }

    return(
        <div style={{position: 'relative'}}>
            <Layout>
                <div style={styles.appIcon} onClick={openMennu(isOpenMenu ? false : true)}>
                    {
                        !isOpenMenu ? <UnorderedListOutlined/>
                        : <span>
                            <LeftOutlined className="iconHide"/>
                            <LeftOutlined className="iconHide_2"/>
                        </span>
                    }
                </div>
                <HeaderCom componentEvent={componentEvent}/>
                <Layout>
                    <SiderBarMenu isOpen={isOpenMenu} onCloseMenu={_onCloseMenu}/>
                    <Layout style={styles.layoutBody}>
                        <View style={styles.wrapper} {...props} componentEvent={componentEvent} />
                    </Layout>
                </Layout>
            </Layout>
        </div>
    )
}

export const FHome = ()=> Main(Home)
export const FMainTrading = ()=> Main(MainTrading)
export const FOrderMain = ()=> Main(OrderMain)
export const FPortfolioCreate = ()=> Main(PortfolioCreate)
export const FDetailPortfolio = (props)=> Main(DetailPortfolio, props)
export const FListPortfolio = ()=> Main(ListPortfolio)
export const FIndexHistory = ()=> Main(IndexHistory)
export const FIndexAccountBalance = ()=> Main(IndexAccountBalance)
export const FIndexAccountBalanceDetail = ()=> Main(IndexAccountBalanceDetail)
export const FPortfolioInvesting = (props)=> Main(IndexPortfolioInvesting, props)
export const FInfoAccount = ()=> Main(InfoAccount)
export const FChartReview = ()=> Main(ChartReview)
export const FAlertConfigs = ()=> Main(AlertConfigs)
export const FManagementAlert = ()=> Main(ManagementAlert)

const styles = {
    appIcon: {
        position: 'absolute',
        width: 40,
        height: 40,
        color: '#00377b',
        cursor: 'pointer',
        backgroundColor: '#fafafa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16
    },
    layoutBody: {
        height: 'calc(100vh - 40px)',
        backgroundImage: `url(${'/images/background/bg_dashboard.jpg'})`,
        overflow: 'hidden'
    },
    wrapper: {
        height: '100%',
        width: '100%',
        overflow: 'auto'
    }
}
