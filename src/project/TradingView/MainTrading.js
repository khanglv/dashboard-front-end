import React, {Component} from 'react';
import {Row, List} from 'antd';
import {css} from 'emotion';

import {connect} from 'react-redux';
import {getStockList} from '../../stores/actions/core/stockListAction';

import TVChartContainer from './TradingView';
import FirstHeaderChil from '../FirstHeaderChil';
import BuyUpSellDown from './buyUpSellDown';
import OrderTrading from './Order';

// let color = window['colors'];

const mainTrading_trading = css`
    height: calc(100vh - 85px);
    padding: 0;
    @media only screen and (max-width: 992px) {
        overflow: auto;
    }
    .leftTrading{
        width: calc(100% - 450px);
        float: left;
        @media only screen and (max-width: 992px) {
            width: 100%;
            padding: 5px;
        }
    }
    .isFullScreen{
        width: calc(100vw - 50px)!important;
    }
    .isHideScreen{
        width: 50px!important;
    }
    .rightTrading{
        width: 450px;
        float: right;
        position: relative;
        @media only screen and (max-width: 992px) {
            /* display: block; */
            width: 100%;
        }
        .mainOrder{
            width: calc(100% - 45px);
            padding-right: 5px;
            padding-bottom: 10px;
            height: calc(100vh - 85px);
            overflow: auto;
            ::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            ::-webkit-scrollbar-track {
                /* box-shadow: inset 0 0 5px #b6b5b5; 
                border-radius: 8px; */
            }

            ::-webkit-scrollbar-thumb {
                background: #e0dede; 
                border-radius: 8px;
                width: 100px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #c3c3c3;
            }
            @media only screen and (max-width: 992px) {
                width: 100%;
                overflow: hidden;
                height: auto;
                padding: 0;
                padding-bottom: 5px;
                margin-top: 40px;
            }
            .isHidden{
                display: none;
            }
        }
        .leftOptionOrder{
            position: absolute;
            right: 0;
            top: 0;
            width: 45px;
            background-color: #fff;
            height: calc(100vh - 85px);
            @media only screen and (max-width: 992px) {
                width: calc(100% - 10px);
                background-color: #fff;
                height: 45px;
                margin: 5px;
            }
            .itemOptionOrder{
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                width: 100%;
                height: 45px;
                @media only screen and (max-width: 992px) {
                    width: 25%;
                    padding: 0px;
                }
                &.isActive{
                    background-color: #c6dfff;
                    .svg{
                        filter: invert(8%) sepia(20%) saturate(878%) hue-rotate(140deg) brightness(504%) contrast(690%);
                    }
                }
                &:hover{
                    background-color: #c6dfff;
                }
            }
        }
    }
`

class MainTrading extends Component{
    constructor(props){
        super(props);
        this.state = {
            key: 0,
            codeStock: '',
            isHidden: false
        }

        this.props_master = props;
    }

    componentWillMount(){
        // this.loadData();
    }

    // loadData = async()=>{
    //     try {
    //         await this.props.getStockList();
    //     } catch (error) {
            
    //     }
    // }

    onClickIconAction = (stt)=> {
        const {
            key
        } = this.state;
        if(key === stt){
            this.setState({isHidden: !this.state.isHidden});
        }else{
            this.setState({isHidden: false});
        }
        this.setState({key: stt});
    }

    render(){
        const {
            key,
            isHidden
        } = this.state;

        return(
            <div>
                <FirstHeaderChil />
                <div className={mainTrading_trading}>
                    <div className={`leftTrading ${isHidden ? "isFullScreen" : ''}`}>
                        <TVChartContainer />
                    </div>
                    <div className={`rightTrading ${isHidden ? "isHideScreen" : ''}`}>
                        <div className="mainOrder">
                            {
                                (() => {
                                    switch(key) {
                                        case 0:
                                            return <div className={`animateCross slideIn ${isHidden ? "isHidden" : ''}`}>
                                                        <OrderTrading
                                                            componentEvent={this.props.componentEvent}
                                                            // lstStock={this.props.lstStock}
                                                        />
                                                    </div>    
                                        case 1: 
                                            return  <div className={`animateCross slideIn ${isHidden ? "isHidden" : ''}`}>
                                                        <BuyUpSellDown />
                                                    </div>    
                                        default: 
                                            return ;
                                    }
                                })()
                            }
                        </div>
                        <div className="leftOptionOrder">
                            <List>
                                <Row>
                                    <List.Item 
                                        className={key === 0 ? "itemOptionOrder isActive" : "itemOptionOrder"}
                                        onClick={()=> this.onClickIconAction(0)}
                                    >
                                        <img alt="" className="svg" src="./images/toolbar/ic_order.svg" />
                                    </List.Item>
                                    <List.Item
                                        className={key === 1 ? "itemOptionOrder isActive" : "itemOptionOrder"}
                                        onClick={()=> this.onClickIconAction(1)}
                                    >
                                        <img alt="" className="svg" src="./images/toolbar/ic_khop_lenh.svg" />
                                    </List.Item>
                                    <List.Item 
                                        className={key === 2 ? "itemOptionOrder isActive" : "itemOptionOrder"}
                                        onClick={()=> this.onClickIconAction(2)}
                                    >
                                        <img alt="" className="svg" src="./images/toolbar/ic_info.svg" />
                                    </List.Item>
                                    <List.Item 
                                        className={key === 3 ? "itemOptionOrder isActive" : "itemOptionOrder"}
                                        onClick={()=> this.onClickIconAction(3)}
                                    >
                                        <img alt="" className="svg" src="./images/toolbar/ic_alert.svg" />
                                    </List.Item>
                                </Row>
                            </List>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstStock: state.indexCore['STOCKS.LIST'],
        marketStockInit: state.indexCore['MARKET_STOCK.OBJ'],
        marketFuturesInit: state.indexCore['MARKET_FUTURES.OBJ']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getStockList: ()=> dispatch(getStockList()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MainTrading);