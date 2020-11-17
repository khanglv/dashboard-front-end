import React, {Component} from 'react';
import {Row, Col, Tabs} from 'antd';
import {connect} from 'react-redux';
import {
    equityAccountProfitLoss, 
    equityAccountAssetInfo
} from '../../../stores/actions/core/equityAccountAction';
import {getBankAccount} from '../../../stores/actions/core/bankAccountAction';

import Loading from '../../../components/Loading/Loading';
import * as common from '../../../components/Common/Common';
import FollowPortfolio from './FollowPortfolio';
import FollowStock from './FollowStock';

import {css} from 'emotion';

const color = window['colors'];
const { TabPane } = Tabs;

const rootMain = css`
    height: auto;
    padding-bottom: 1em;
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
    .rootBody{
        .ant-tabs-ink-bar{
            background-color: ${color._BLUE_VCSC};
        }
        .ant-tabs-tab{
            color: ${color._GREY_999};
            font-weight: 500;
            font-size: 1.3em;
            &:hover{
                color: ${color._BLUE_VCSC};
            }
        }
        .ant-tabs-tab-active{
            font-weight: 600;
            color: ${color._BLUE_VCSC};
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
                const accountBank = this.props.bankAccount.length > 0 ? this.props.bankAccount[0] : [];
                await this.props.equityAccountProfitLoss({
                    accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                    subNumber: subNumber,
                    bankCode: accountBank.bankCode || '',
                    bankAccount: accountBank.bankAccount || '',
                    fetchCount: 100
                });
                this.props.equityAccountAssetInfo({
                    accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                    subNumber: subNumber,
                    bankCode: accountBank.bankCode || '',
                    bankAccount: accountBank.bankAccount || '',
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

        return(
            <Loading isLoading={isLoading}>
                <div className={rootMain}>
                    <div className="comHeaderRoot">
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
                    <div className="rootBody p-top20">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={'Theo Danh mục'} key="1">
                                <FollowPortfolio subNumberChange={this.props.subNumberChange}/>
                            </TabPane>
                            <TabPane tab={'Theo Cổ phiếu'} key="2">
                                <FollowStock data={this.props.dataProfitLoss}/>
                            </TabPane>
                        </Tabs>
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
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        equityAccountProfitLoss: (data)=> dispatch(equityAccountProfitLoss(data)),
        equityAccountAssetInfo: (data)=> dispatch(equityAccountAssetInfo(data)),
        getBankAccount: (data)=> dispatch(getBankAccount(data)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AccountBalance);