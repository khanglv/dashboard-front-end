import React, {Component} from 'react';
import {Row, Col} from 'antd';

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
            height: auto;
            overflow: hidden;
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
        .rootStatislic{
            .leftData{
                background-color: ${color._WHITE};
                border: 1px solid ${color._STROKE};
                border-right: 0;
                font-size: 13px;
                border-radius: 0.4em;
                .headerTable{
                    td, th {
                        background-color: ${color._GREY_LIGHT_2};
                        border-bottom: 1px solid ${color._STROKE};
                        text-align: right;
                        padding: 0.8em 1em;
                        font-weight: 600;
                    }
                }
                td, th {
                    font-weight: 500;
                    border-top: 1px solid ${color._GREY_LIGHT_2};
                    text-align: right;
                    padding: 0.8em 1em;
                }
            }
            .left{
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                border-right: 1px solid ${color._STROKE};
                overflow: hidden;
            }
            .mainData{
                background-color: ${color._WHITE};
                color: ${color._BLACK};
                border-bottom: 1px solid ${color._STROKE};
                border-right: 1px solid ${color._STROKE};
                border: 1px solid ${color._STROKE};
                border-radius: 0.4em;
                font-size: 13px;
                .headerTable{
                    td, th {
                        background-color: ${color._GREY_LIGHT_2};
                        border-bottom: 1px solid ${color._STROKE};
                        text-align: right;
                        padding: 0.8em 1em;
                        font-weight: 600;
                    }
                }
                td, th {
                    font-weight: 500;
                    border-top: 1px solid ${color._GREY_LIGHT_2};
                    text-align: right;
                    padding: 0.8em 1em;
                }
            }
            .right{
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                border-left: 0;
                overflow: hidden;
            }
        }
    }
`

const scrollCustom = css`
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    ::-webkit-scrollbar-track {
        /* box-shadow: inset 0 0 5px #b6b5b5; 
        border-radius: 8px; */
    }
    
    ::-webkit-scrollbar-thumb {
        background: #cdcdcd; 
        border-radius: 8px;
        width: 100px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: #c3c3c3;
    }
`

class AccountBalanceDetail extends Component{
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
                const accountBank = this.props.bankAccount.length > 0 ? this.props.bankAccount[0] : [];
                await this.props.equityAccountProfitLoss({
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
            isLoading
        } = this.state;

        const dataProfitLoss = this.props.dataProfitLoss;
        const dataAssetInfo = this.props.dataAssetInfo;
        const arrData = this.props.lstEquityAccountStockDetail;

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
                        
                        <div className="rootStatislic p-top20">
                            <Row>
                                <Col span={8} className="leftData left">
                                    <table style={{width: '100%'}}>
                                        <thead>
                                            <tr className="headerTable">
                                                <th style={{textAlign: 'center'}}>STT</th>
                                                <th style={{textAlign: 'left'}}>Mã CP</th>
                                                <th>Tổng số dư CP</th>
                                                <th>KL CP được GD</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                            {arrData.length > 0 ? arrData.map((item, idx)=>{
                                                return(
                                                    <tr key={idx}>
                                                        <td style={{textAlign: 'center'}}>{idx+1}</td>
                                                        <td style={{textAlign: 'left', fontWeight: 600}}>{item.stockCode}</td>
                                                        <td>{common.convertTextDecimal(item.totalBalance)}</td>
                                                        <td>{common.convertTextDecimal(item.availableQuantity)}</td>
                                                    </tr>
                                                )
                                            })
                                            : null}
                                        </tbody>
                                    </table>
                                </Col>
                                <Col span={16} className={`${scrollCustom} mainData right`} style={{overflowX: 'scroll'}}>
                                    <table style={{width: '250%'}}>
                                        <thead>
                                            <tr className="headerTable">
                                                <th>CP Thưởng</th>
                                                <th>Quyền mua dự kiến</th>
                                                <th>Quyền mua đã ĐK</th>
                                                <th>Phong tỏa khác</th>
                                                <th>Mua T0</th>
                                                <th>Bán T0</th>
                                                <th>Mua T1</th>
                                                <th>Bán T1</th>
                                                <th>Mua T2</th>
                                                <th>Bán T2</th>
                                                <th>KL bán chưa khớp</th>
                                                <th>Giá mua TB</th>
                                                <th>Giá hiện tại</th>
                                                <th>Tổng GT mua</th>
                                                <th>Tổng GT hiện tại</th>
                                                <th>Cổ tức tiền mặt</th>
                                                <th>Lãi/Lỗ</th>
                                                <th style={{paddingRight: '1em'}}>
                                                    %Margin
                                                </th>
                                            </tr>
                                        </thead>  
                                        <tbody>
                                            {arrData.length > 0 ? arrData.map((item, idx)=>{
                                                return(
                                                    <tr key={idx}>
                                                        <td>{common.convertTextDecimal(item.bonusShares)}</td>
                                                        <td>{common.convertTextDecimal(item.subscriptionsQuantity)}</td>
                                                        <td>{common.convertTextDecimal(item.registeredSubscriptionsQuantity)}</td>
                                                        <td>{common.convertTextDecimal(item.blockadeQuantity)}</td>
                                                        <td>{common.convertTextDecimal(item.tBuyQuantity)}</td>
                                                        <td>{common.convertTextDecimal(item.tSellQuantity)}</td>
                                                        <td>{common.convertTextDecimal(item.t1BuyQuantity)}</td>
                                                        <td>{common.convertTextDecimal(item.t1SellQuantity)}</td>
                                                        <td>{common.convertTextDecimal(item.t2BuyQuantity)}</td>
                                                        <td>{common.convertTextDecimal(item.t2SellQuantity)}</td>
                                                        <td>{common.convertTextDecimal(item.unmatchedSellT)}</td>
                                                        <td>{common.convertTextDecimal(item.avgBuyingPrice)}</td>
                                                        <td>{common.convertTextDecimal(item.marketPrice)}</td>
                                                        <td>{common.convertTextDecimal(item.totalBuyingAmount)}</td>
                                                        <td>{common.convertTextDecimal(item.totalMarketValue)}</td>
                                                        <td>{common.convertTextDecimal(item.cashDividends)}</td>
                                                        <td>{common.convertTextDecimal(item.profitOnLoss)}</td>
                                                        <td style={{paddingRight: '1em', color: item.marginRatio > 0 ? color._GREEN : color._RED_VCSC}}>
                                                            {item.marginRatio}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            : null}
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>
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

export default connect(mapStateToProps, mapDispatchToProps) (AccountBalanceDetail);