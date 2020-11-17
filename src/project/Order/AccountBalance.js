import React, {Component} from 'react';
import {Table} from 'antd';

import {connect} from 'react-redux';
import {equityAccountStockDetail} from '../../stores/actions/core/equityAccountAction';

import {css} from 'emotion';

import * as common from '../../components/Common/Common';

const color = window['colors'];

const tableOrder = css`
    font-weight: 500;
    max-width: 1024px;
    .ant-table-body, .ant-table-content{
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-thumb {
            background: #e0dede; 
            border-radius: 8px;
            width: 100px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #c3c3c3;
        }
    }
    .ant-table-thead{
        font-size: 12px;
        tr{
            th{
                font-weight: 600;
                color: #999999;
                background-color: #f2f2f2!important;
            }
        }
    }
    .ant-table-tbody{
        font-size: 13px;
        tr{
            td{
                border-bottom: 0;
            }
        }
    }
    .ant-table-row{
        &:hover{
            .ant-table-cell{
                background-color: ${color._HOVER};
            }
            .hide{
                display: inline-block;
                position: absolute;
                top: 0.5em;
            }
        }
    }
`

class AccountBalance extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            accountInfo: JSON.parse(localStorage.getItem('accountInfoKey')),
        }

        props.componentEvent.on("changeSubNumber", (subNumber)=>{
            this.loadData(subNumber);
        });
    }

    componentDidMount(){
        this.loadData();
    }

    componentDidUpdate(prev){
        if(this.props.isReloadAccountBalance){
            this.loadData();
            this.props.onStopLoadAccountBalance();
        }
    }

    loadData = async(sub = null)=>{
        try {
            const{
                accountInfo,
            } = this.state;
    
            if(accountInfo){
                let subNumber = '00';
                if(sub){
                    subNumber = sub;
                }else{
                    let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
                    if (obj) {
                        if(obj.SUB_NUMBER){
                            subNumber = obj.SUB_NUMBER;
                        }
                    }
                }
                
                this.setState({isLoading: true});
                await this.props.equityAccountStockDetail({
                    accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                    subNumber: subNumber,
                    date: common.dateToYYYYMMDD(new Date()),
                    fetchCount: 100
                });
                
                this.setState({isLoading: false});
            }
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    changeStockCodeShortcut = (value)=>{
        this.props._changeStockCodeShortcut(value);
    }

    setPriceShortcut = (value)=>{
        this.props._changeQuantitySell(value);
    }

    render(){
        const {
            isLoading
        } = this.state;

        const arrData = this.props.lstEquityAccountStockDetail.length ? this.props.lstEquityAccountStockDetail.map((item, idx)=>{
            return{
                ...item,
                key: idx
            }
        }) : null;

        const columns = [
            {
                title: 'Mã CP (Margin)',
                dataIndex: 'stockCode',
                fixed: 'left',
                width: 120,
                render: (id, record) => {
                    return(
                        <div style={{fontWeight: 600, cursor: 'pointer'}} onClick={()=>this.changeStockCodeShortcut(record.stockCode)}>
                           {record.stockCode} {record.marginRatio > 0 ? <span style={{color: color._ORANGE}}>({record.marginRatio*100}%)</span> : null}
                        </div>
                        
                    )
                }
            },
            {
                title: 'Số dư GD',
                dataIndex: 'availableQuantity',
                fixed: 'left',
                align: 'right',
                width: 90,
                render: availableQuantity =>{
                    return(
                        <div 
                            style={{fontWeight: 600}}
                            // onClick={()=>this.setPriceShortcut(availableQuantity)}
                        >
                            {common.convertTextDecimal(availableQuantity)}
                        </div>
                    )
                }
            },
            {
                title: 'Số lượng CP',
                align: 'right',
                dataIndex: 'totalBalance',
                render: totalBalance =>{
                    return(
                        <div>{common.convertTextDecimal(totalBalance)}</div>
                    )
                }
            },
            {
                title: 'Giá mua',
                dataIndex: 'avgBuyingPrice',
                align: 'right',
                render: avgBuyingPrice =>{
                    return(
                        <div>{common.convertTextDecimal(avgBuyingPrice)}</div>
                    )
                }
            },
            {
                title: 'Giá hiện tại',
                dataIndex: 'marketPrice',
                align: 'right',
                render: marketPrice =>{
                    return(
                        <div>{common.convertTextDecimal(marketPrice)}</div>
                    )
                }
            },
            {
                title: 'Giá trị hiện tại',
                dataIndex: 'totalMarketValue',
                align: 'right',
                render: totalMarketValue =>{
                    return(
                        <div>{common.convertTextDecimal(totalMarketValue)}</div>
                    )
                }
            },
            {
                title: 'Lãi/Lỗ',
                dataIndex: 'profitOnLoss',
                align: 'right',
                render: profitOnLoss => {
                    return(
                        <div style={{color: profitOnLoss > 0 ? color._GREEN : color._RED_VCSC}}>
                            {common.convertTextDecimal(profitOnLoss)}
                        </div>
                    )
                }
            },
            {
                title: '%Lãi/Lỗ',
                dataIndex: 'profitOnLossRate',
                align: 'right',
                render: profitOnLossRate => {
                    return(
                        <div style={{color: profitOnLossRate > 0 ? color._GREEN : color._RED_VCSC}}>
                            {profitOnLossRate}
                        </div>
                    )
                }
            },
            {
                title: 'Mua T0',
                dataIndex: 'tBuyQuantity',
                align: 'right',
                render: tBuyQuantity =>{
                    return(
                        tBuyQuantity === 0 ? '-' : <div style={{color: color._GREEN}}>{common.convertTextDecimal(tBuyQuantity)}</div>
                    )
                }
            },
            {
                title: 'Bán T0',
                dataIndex: 'tSellQuantity',
                align: 'right',
                render: tSellQuantity =>{
                    return(
                        tSellQuantity === 0 ? '-' : <div style={{color: color._RED_VCSC}}>{common.convertTextDecimal(tSellQuantity)}</div>
                    )
                }
            },
            {
                title: 'Mua T1',
                dataIndex: 't1BuyQuantity',
                align: 'right',
                render: t1BuyQuantity =>{
                    return(
                        t1BuyQuantity === 0 ? '-' : <div style={{color: color._GREEN}}>{common.convertTextDecimal(t1BuyQuantity)}</div>
                    )
                }
            },
            {
                title: 'Bán T1',
                dataIndex: 't1SellQuantity',
                align: 'right',
                render: t1SellQuantity =>{
                    return(
                        t1SellQuantity === 0 ? '-' : <div style={{color: color._RED_VCSC}}>{common.convertTextDecimal(t1SellQuantity)}</div>
                    )
                }
            },
            {
                title: 'Mua T2',
                dataIndex: 't2BuyQuantity',
                align: 'right',
                render: t2BuyQuantity =>{
                    return(
                        t2BuyQuantity === 0 ? '-' : <div style={{color: color._GREEN}}>{common.convertTextDecimal(t2BuyQuantity)}</div>
                    )
                }
            },
            {
                title: 'Bán T2',
                dataIndex: 't2SellQuantity',
                align: 'right',
                render: t2SellQuantity =>{
                    return(
                        t2SellQuantity === 0 ? '-' : <div style={{color: color._RED_VCSC}}>{common.convertTextDecimal(t2SellQuantity)}</div>
                    )
                }
            },
            {
                title: 'Bán chưa khớp',
                dataIndex: 'unmatchedSellT',
                align: 'right',
                render: unmatchedSellT =>{
                    return(
                        <div>{common.convertTextDecimal(unmatchedSellT)}</div>
                    )
                }
            },
        ];

        return(
            <div>
                <Table
                    className={tableOrder}
                    columns={columns} 
                    dataSource={arrData}
                    size={'small'}
                    scroll={{x: 1800, y: '34em'}}
                    pagination={false}
                    loading={isLoading}
                />
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstEquityAccountStockDetail: state.indexCore['EQUITY_ACCOUNT.STOCK_DETAIL'],
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        equityAccountStockDetail: (data)=> dispatch(equityAccountStockDetail(data)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AccountBalance);