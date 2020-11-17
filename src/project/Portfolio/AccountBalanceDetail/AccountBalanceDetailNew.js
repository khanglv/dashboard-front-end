import React, {Component} from 'react';
import {Row, Col, Table} from 'antd';

import {connect} from 'react-redux';
import {
    equityAccountProfitLoss, 
    equityAccountAssetInfo
} from '../../../stores/actions/core/equityAccountAction';
import {getBankAccount} from '../../../stores/actions/core/bankAccountAction';
import {equityAccountStockDetail} from '../../../stores/actions/core/equityAccountAction';

import Loading from '../../../components/Loading/Loading';
import {css} from 'emotion';

import * as common from '../../../components/Common/Common';

const color = window['colors'];

const rootBody = css`
    display: flex;
    justify-content: center;
    overflow: auto;
    .rootMain{
        height: calc(100vh - 85px);
        padding-top: 10px;
        padding-bottom: 1em;
        max-width: 1400px;
        width: 100%;
        @media only screen and (max-width: 1200px) {
            height: calc(100vh - 100px);
            padding-top: 10px;
            padding-bottom: 1em;
            max-width: 1200px;
        }
        
        @media only screen and (max-width: 992px) {
            padding-right: 0.5rem;
            padding-left: 0.5rem;
            padding-bottom: 1em;
            width: 100%;
        }
        .comHeaderRoot{
            @media only screen and (max-width: 992px) {
                overflow: auto;
            }
            .scroll{
                @media only screen and (max-width: 992px) {
                    width: 300%;
                    height: auto;
                }
                .headerTotalStatistical{
                    border-radius: 8px;
                    padding: 20px 0;
                    background-color: ${color._WHITE};
                    .itemComp{
                        padding: 0 20px;
                        word-wrap: break-word;
                        .title{
                            font-weight: 600;
                            color: ${color._GREY_999};
                            font-size: 12px
                        }
                        .content{
                            font-weight: 500;
                            color: ${color._BLUE_VCSC};
                            font-size: 22px;
                            @media only screen and (max-width: 992px) {
                                font-size: 18px;
                            }
                        }
                        .contentWarning{
                            font-weight: 500;
                            font-size: 22px;
                            @media only screen and (max-width: 992px) {
                                font-size: 18px;
                            }
                        }
                    }
                    .borderRight{
                        border-right: 1px solid ${color._GREY_LIGHT_2};
                    }
                }
            }
        }
    }
    .tableOrder{
        font-weight: 500;
        .ant-table-body, .ant-table-content{
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
    }
`

class AccountBalanceDetailNew extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            accountInfo: JSON.parse(localStorage.getItem('accountInfoKey')),
            arrData: []
        }
    }

    componentDidUpdate(prev){
        if(this.props.subNumberChange && prev.subNumberChange !== this.props.subNumberChange){
            this.loadData(this.props.subNumberChange);
        }
    }


    componentDidMount(){
        this.loadData();
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
                await this.getBankAccountInv(accountInfo);
                await this.loadAllRecordQuote([], subNumber);
                const accountBank = this.props.bankAccount.length > 0 ? this.props.bankAccount[0] : [];
                this.props.equityAccountProfitLoss({
                    accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                    subNumber: subNumber,
                    bankCode: accountBank.bankCode || '',
                    bankAccount: accountBank.bankAccount || '',
                });
                this.props.equityAccountAssetInfo({
                    accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                    subNumber: subNumber,
                    bankCode: accountBank.bankCode || '',
                    bankAccount: accountBank.bankAccount || '',
                });
            }
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    loadAllRecordQuote = async (arrData = [], sub)=>{
        try {
            this.setState({isLoading: true});
            const res = await this.loadOneHundredRecord(arrData, sub);
            if(res.type === 'EQUITY_ACCOUNT.STOCK_DETAIL'){
                if(res.data.length >= 100){
                    arrData = [...arrData, ...res.data]
                    this.loadAllRecordQuote(arrData, sub);
                }else{
                    let dataEndLoad = [
                        ...arrData,
                       ...res.data
                    ];
                    let arrDataTmp = [];
                    if(dataEndLoad.length > 0){
                        arrDataTmp = dataEndLoad.map((item, idx)=>{
                            return{
                                ...item,
                                key: idx
                            }
                        });
                    }
                    this.setState({arrData: arrDataTmp, isLoading: false});
                }
            }else{
                this.setState({isLoading: false});
            }
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    loadOneHundredRecord = async(arrData, sub)=>{
        try {
            const {
                accountInfo
            } = this.state;
            
            let lastOrder = {stockCode: null};
            if(arrData.length > 0){
                lastOrder = arrData[arrData.length-1];
            }
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
            return this.props.equityAccountStockDetail({
                accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                subNumber: subNumber,
                date: common.dateToYYYYMMDD(new Date()),
                lastStockCode: lastOrder.stockCode,
                fetchCount: 100
            }, false);
        } catch (error) {
            
        }
    }


    getBankAccountInv = async(accountInfo)=> {
        try {
            await this.props.getBankAccount({
                accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                subNumber: accountInfo.userInfo.accounts[0].accountSubs[0].subNumber
            });
        } catch (error) {
            
        }
    }

    render(){
        const {
            isLoading,
            arrData
        } = this.state;

        const dataProfitLoss = this.props.dataProfitLoss;
        const dataAssetInfo = this.props.dataAssetInfo;

        const columns = [
            {
                title: 'STT',
                dataIndex: 'key',
                fixed: 'left',
                width: 50,
                render: key => {
                    return(
                        key + 1
                    )
                }
            },
            {
                title: 'Mã CP (Margin)',
                dataIndex: 'stockCode',
                fixed: 'left',
                width: 120,
                render: (i, record) =>{
                    return(
                        <div style={{fontWeight: 600}}>
                            {record.stockCode} {record.marginRatio > 0 ? <span style={{color: color._ORANGE}}>({record.marginRatio*100}%)</span> : null}
                        </div>
                    )
                }
            },
            {
                title: 'Tổng số dư CP',
                dataIndex: 'totalBalance',
                align: 'right',
                fixed: 'left',
                width: 110,
                render: totalBalance =>{
                    return(
                        <div style={{fontWeight: 600, cursor: 'pointer'}}>{common.convertTextDecimal(totalBalance)}</div>
                    )
                }
            },
            {
                title: 'KL CP được GD',
                dataIndex: 'availableQuantity',
                fixed: 'left',
                align: 'right',
                width: 120,
                render: availableQuantity =>{
                    return(
                        <div style={{fontWeight: 600, cursor: 'pointer'}}>{common.convertTextDecimal(availableQuantity)}</div>
                    )
                }
            },
            {
                title: 'CP Thưởng',
                dataIndex: 'bonusShares',
                align: 'right',
                render: bonusShares => {
                    return(
                        <div>{common.convertTextDecimal(bonusShares)}</div>
                    )
                }
            },
            {
                title: 'Quyền mua dự kiến',
                dataIndex: 'subscriptionsQuantity',
                align: 'right',
                render: (i, record) => {
                    return(
                        <div>{common.convertTextDecimal(record.subscriptionsQuantity)}</div>
                    )
                }
            },
            {
                title: 'Quyền mua đã ĐK',
                dataIndex: 'registeredSubscriptionsQuantity',
                align: 'right',
                render: registeredSubscriptionsQuantity => {
                    return(
                    <div>{common.convertTextDecimal(registeredSubscriptionsQuantity)}</div>
                    )
                }
            },
            {
                title: 'Phong tỏa khác',
                dataIndex: 'blockadeQuantity',
                align: 'right',
                render: blockadeQuantity => {
                    return(
                    <div>{common.convertTextDecimal(blockadeQuantity)}</div>
                    )
                }
            },
            {
                title: 'Mua T0',
                dataIndex: 'tBuyQuantity',
                align: 'right',
                width: 80,
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
                width: 80,
                render: tSellQuantity =>{
                    return(
                        tSellQuantity === 0 ? '-' : <div style={{color: color._RED_VCSC}}>{common.convertTextDecimal(tSellQuantity)}</div>
                    )
                }
            },
            {
                title: 'Mua T1',
                width: 80,
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
                width: 80,
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
                width: 80,
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
                width: 80,
                dataIndex: 't2SellQuantity',
                align: 'right',
                render: t2SellQuantity =>{
                    return(
                        t2SellQuantity === 0 ? '-' : <div style={{color: color._RED_VCSC}}>{common.convertTextDecimal(t2SellQuantity)}</div>
                    )
                }
            },
            {
                title: 'KL bán chưa khớp',
                dataIndex: 'unmatchedSellT',
                align: 'right',
                render: unmatchedSellT => {
                    return(
                        <div>{common.convertTextDecimal(unmatchedSellT)}</div>
                    )
                }
            },
            {
                title: 'Giá mua TB',
                dataIndex: 'avgBuyingPrice',
                align: 'right',
                render: avgBuyingPrice => {
                    return(
                        <div>{common.convertTextDecimal(avgBuyingPrice)}</div>
                    )
                }
            },
            {
                title: 'Giá hiện tại',
                dataIndex: 'marketPrice',
                align: 'right',
                render: marketPrice => {
                    return(
                        <div>{common.convertTextDecimal(marketPrice)}</div>
                    )
                }
            },
            {
                title: 'Tổng GT mua',
                dataIndex: 'totalBuyingAmount',
                align: 'right',
                render: totalBuyingAmount => {
                    return(
                        <div>{common.convertTextDecimal(totalBuyingAmount)}</div>
                    )
                }
            },
            {
                title: 'Tổng GT hiện tại',
                dataIndex: 'totalMarketValue',
                align: 'right',
                render: totalMarketValue => {
                    return(
                        <div>{common.convertTextDecimal(totalMarketValue)}</div>
                    )
                }
            },
            {
                title: 'Cổ tức tiền mặt',
                dataIndex: 'cashDividends',
                align: 'right',
                render: cashDividends => {
                    return(
                        <div>{common.convertTextDecimal(cashDividends)}</div>
                    )
                }
            },
            {
                title: 'Lãi/Lỗ',
                dataIndex: 'profitOnLoss',
                align: 'right',
                render: profitOnLoss => {
                    return(
                        <div style={{color: profitOnLoss > 0 ? color._GREEN : color._RED_VCSC}}>{common.convertTextDecimal(profitOnLoss)}</div>
                    )
                }
            }
            // {
            //     title: '%Margin',
            //     width: 100,
            //     dataIndex: 'marginRatio',
            //     align: 'right',
            //     render: marginRatio => {
            //         return(
            //             <div style={{paddingRight: '1em', color: marginRatio > 0 ? color._GREEN : color._RED_VCSC}}>{common.convertTextDecimal(marginRatio)}</div>
            //         )
            //     }
            // },
        ];

        return(
            <Loading isLoading={isLoading}>
                <div className={rootBody}>
                    <div className="rootMain" id="control">
                        <div className="comHeaderRoot p-top10">
                            <Row className="scroll">
                                <Col span={18}>
                                    <Row className="headerTotalStatistical">
                                        <Col span={6} className="itemComp borderRight">
                                            <div className="title">TÀI SẢN RÒNG</div>
                                            <div className="content">{common.convertTextDecimal(dataProfitLoss.netAsset || 0)}</div>
                                        </Col>
                                        <Col span={6} className="itemComp borderRight">
                                            <div className="title">TỔNG TÀI SẢN</div>
                                            <div className="content">{common.convertTextDecimal(dataAssetInfo.totalAsset || 0)}</div>
                                        </Col>
                                        <Col span={6} className="itemComp borderRight">
                                            <div className="title">GTCK HIỆN TẠI</div>
                                            <div className="content">{common.convertTextDecimal(dataProfitLoss.totalEvaluationAmount || 0)}</div>
                                        </Col>
                                        <Col span={6} className="itemComp">
                                            <div className="title">TIỀN CÓ THỂ RÚT</div>
                                            <div className="content">{common.convertTextDecimal(dataAssetInfo.withdrawableAmount || 0)}</div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={6} style={{paddingLeft: 10}}>
                                    <div className="headerTotalStatistical">
                                        <div className="itemComp">
                                            <div className="title">LÃI / LỖ</div>
                                            <div className="contentWarning" style={{color: dataProfitLoss.totalProfitLossRate > 0 ? color._GREEN : color._RED_VCSC}}>{common.convertTextDecimal(dataProfitLoss.totalProfitLoss || 0)}&nbsp;
                                                <span style={{fontSize: 12, color: dataProfitLoss.totalProfitLossRate > 0 ? color._GREEN : color._RED_VCSC}}>({dataProfitLoss.totalProfitLossRate || 0}%)</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="p-top20" style={{paddingBottom: 10}}>
                            <Table
                                className="tableOrder"
                                columns={columns} 
                                dataSource={arrData}
                                size={'small'}
                                scroll={{x: 2800, y: '60vh'}}
                                pagination={{pageSize: 20}}
                            />
                        </div>
                        <div style={{height: '1em', display: 'block'}}></div>
                    </div>
                    
                </div>
            </Loading>
        )
    }
}

const mapStateToProps = state =>{
    return{
        bankAccount: state.portFolio['BANK_ACCOUNT.LIST'],
        dataProfitLoss: state.portFolio['EQUITY_ACCOUNT.PROFIT_LOSS'],
        dataAssetInfo: state.portFolio['EQUITY_ACCOUNT.ASSET_INFO'],
        lstEquityAccountStockDetail: state.portFolio['EQUITY_ACCOUNT.STOCK_DETAIL'],
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        equityAccountProfitLoss: (data)=> dispatch(equityAccountProfitLoss(data)),
        equityAccountAssetInfo: (data)=> dispatch(equityAccountAssetInfo(data)),
        getBankAccount: (data)=> dispatch(getBankAccount(data)),
        equityAccountStockDetail: (data)=> dispatch(equityAccountStockDetail(data)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AccountBalanceDetailNew);