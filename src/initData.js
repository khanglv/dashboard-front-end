import React, { Component } from 'react';
import RouteURL from './routers/Router';
import {getStockList} from '../src/stores/actions/core/stockListAction';
import {getConfigs} from '../src/stores/actions/masterService/alertAction';
import {getAlertSubContent} from '../src/stores/actions/masterService/alertAction';
import {socketIoInit} from '../src/project/Alert/socketIo/socketIo';

import {connect} from 'react-redux';

class InitData extends Component {
    componentWillMount(){  
        this.loadData();
    }

    loadData = async()=>{
        try {
            const accountInfo = JSON.parse(localStorage.getItem('accountInfoKey'));
            let stringMSNDT = '';
            
            if(accountInfo){
                stringMSNDT = accountInfo.userInfo.accounts[0].accountNumber
            }

            await this.props.getStockList();
            await this.props.getConfigs({msndt: stringMSNDT});
            await this.props.getAlertSubContent({msndt: stringMSNDT});
            await socketIoInit();
            // await Promise.all([this.props.getStockList(), this.props.getConfigs({msndt: stringMSNDT})]);
           
        } catch (error) {
            
        }
    }

    render(){
        return (
            <div>
                <RouteURL />
            </div>
        )
    }
    
}


const mapDispatchToProps = dispatch =>{
    return{
        getStockList: () => dispatch(getStockList()),
        getConfigs: (data) => dispatch(getConfigs(data)),
        getAlertSubContent: (data) => dispatch(getAlertSubContent(data)),
    }
}

export default connect(null, mapDispatchToProps) (InitData);
