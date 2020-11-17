import React, {Component} from 'react';
import {Col, Row, Button, Pagination} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import * as common from '../../../components/Common/Common';

import { withRouter } from "react-router";
import {connect} from 'react-redux';
import {
    equityAccountProfitLoss, 
    // equityAccountAssetInfo
} from '../../../stores/actions/core/equityAccountAction';
import {getBankAccount} from '../../../stores/actions/core/bankAccountAction';
import {getListIndex} from '../../../stores/actions/investor/indexAction';

import {CardFortfolio} from './Card';
import Loading from '../../../components/Loading/Loading';

import {css} from 'emotion';

let color = window['colors'];

const mainTrading = css`
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
                        font-size: 22px
                    }
                    .contentWarning{
                        font-weight: 500;
                        color: ${color._RED_VCSC};
                        font-size: 22px
                    }
                }
                .borderRight{
                    border-right: 1px solid ${color._GREY_LIGHT_2};
                }
            }
        }
        
    }
    .actionRoot{
        .left{
            float: left;
            .title{
                color: ${color._BLACK};
                font-weight: 500;
                font-size: 24px;
                @media only screen and (max-width: 992px) {
                    font-size: 18px;
                }
            }
        }
        .right{
            float: right;
            .btnCustom{
                border-radius: 4px;
                font-size: 13px;
                font-weight: 500;
                background-color: ${color._BLUE_VCSC};
                border: 1px solid ${color._BLUE_VCSC};
                padding: 0.7em;
                height: auto;
                &:hover{
                    background-color: ${color._BLUE_VCSC_HOVER};
                    border: 1px solid ${color._BLUE_VCSC_HOVER};
                }
            }
        }
    }

    .pagination{
        display: flex;
        justify-content: center;
        align-items: center;
        .ant-pagination-item-active a{
            color: ${color._BLUE_VCSC};
        }
        .ant-pagination-item-active{
            border-color: ${color._BLUE_VCSC};
        }
        .ant-pagination-item{
            &:hover{
                border-color: ${color._BLUE_VCSC};
            }
            a{
                &:hover{
                    color: ${color._BLUE_VCSC};
                }
            }
        }
        .ant-pagination-prev, .ant-pagination-next{
            .ant-pagination-item-link{
                &:hover{
                    border-color: ${color._BLUE_VCSC};
                }
                .anticon-left, .anticon-right{
                    color: ${color._BLUE_VCSC};
                }
            }
            
        }
    }
`

class Portfolio extends Component{
    constructor(props){
        super(props);
        this.state = {
            accountInfo: JSON.parse(localStorage.getItem('accountInfoKey')),
            numberPage: 0
        }
    }

    componentDidUpdate(prev){
        if(this.props.subNumberChange && prev.subNumberChange !== this.props.subNumberChange){
            this.loadData(this.props.subNumberChange);
        }
    }

    componentWillMount(){
        this.removeStores();
        this.loadData();
    }

    removeStores = ()=>{
        let arrData = ['PORTFOLIO.INFO', 'PORTFOLIO.DATA', 'UPLOAD.ICON'];
        arrData.map(item => {
            let data = {};
            if(item === 'PORTFOLIO.DATA'){
                data = [];
            }
            return this.props.dispatch({
                type: item,
                data: data
            });
        });
    }

    loadData = async(sub = null)=>{
        try {
            const{
                accountInfo,
            } = this.state;
    
            if(accountInfo){
                this.setState({isLoading: true});
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
                await this.getBankAccountInv(accountInfo);
                const accountBank = this.props.bankAccount.length > 0 ? this.props.bankAccount[0] : [];
                // this.props.equityAccountAssetInfo({
                //     accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                //     subNumber: subNumber,
                //     bankCode: accountBank.bankCode || '',
                //     bankAccount: accountBank.bankAccount || '',
                // });
                this.props.equityAccountProfitLoss({
                    accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                    subNumber: subNumber,
                    bankCode: accountBank.bankCode || '',
                    bankAccount: accountBank.bankAccount || '',
                });
                await this.loadListIndexPage(0);
                this.setState({isLoading: false});
            }
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    loadListIndexPage = async(numberPage)=> {
        try {
            let subNumber = '00';
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            if (obj) {
                if(obj.SUB_NUMBER){
                    subNumber = obj.SUB_NUMBER;
                }
            }
            this.setState({isLoading: true});
            await this.props.getListIndex({numberPage: numberPage, subNumber: subNumber});
            this.setState({isLoading: false});
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    onCreatePortfolio = ()=>{
        this.props.createPortfolio();
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

    onChangePagination = async(page, pageSize)=>{
        let numberPage = (page - 1)*pageSize;
        if(page === 1){
            numberPage = 0;
        }
        await this.setState({numberPage: numberPage});
        this.loadListIndexPage(parseInt(numberPage));
    }

    onDetailPortfolio = (info)=>{
        if(info){
            this.props.history.push(`/detail-portfolio/${info.id}`);
        }
    }

    render(){
        const {
            isLoading
        } = this.state;

        const dataProfitLoss = this.props.dataProfitLoss;
        //const dataAssetInfo = this.props.dataAssetInfo;
        const lstIndex = this.props.lstIndex;
        const lstDataOnlyIndex = Object.keys(lstIndex).length > 0 ? lstIndex.data : [];
        const totalPage = Object.keys(lstIndex).length > 0 ? lstIndex.length : 0;

        return(
            <div className={mainTrading}>
                <Loading isLoading={isLoading}>
                    <div className="comHeaderRoot">
                        <Row className="scroll">
                            <Col span={16}>
                                <Row className="headerTotalStatistical">
                                    <Col span={12} className="itemComp borderRight">
                                        <div className="title">TÀI SẢN RÒNG</div>
                                        <div className="content">{common.convertTextDecimal(dataProfitLoss.netAsset || 0)}</div>
                                    </Col>
                                    {/* <Col span={6} className="itemComp borderRight">
                                        <div className="title">TỔNG TÀI SẢN</div>
                                        <div className="content">{common.convertTextDecimal(dataAssetInfo.totalAsset)}</div>
                                    </Col> */}
                                    <Col span={12} className="itemComp borderRight">
                                        <div className="title">GTCK HIỆN TẠI</div>
                                        <div className="content">{common.convertTextDecimal(dataProfitLoss.totalEvaluationAmount || 0)}</div>
                                    </Col>
                                    {/* <Col span={6} className="itemComp">
                                        <div className="title">TIỀN CÓ THỂ RÚT</div>
                                        <div className="content">{common.convertTextDecimal(dataAssetInfo.withdrawableAmount)}</div>
                                    </Col> */}
                                </Row>
                            </Col>
                            <Col span={8} style={{paddingLeft: 10}}>
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
                    <div className="actionRoot p-top20">
                        <div className="left">
                            <span className="title">
                                Danh mục đầu tư
                            </span>
                        </div>
                        <div className="right">
                            <Button 
                                type="primary" 
                                className="btnCustom" 
                                icon={<PlusOutlined />}
                                onClick={this.onCreatePortfolio}
                            >
                                TẠO DANH MỤC MỚI
                            </Button>
                        </div>
                        <div style={{clear: 'both'}}></div>
                    </div>
                    <div className="p-top20 rootBody">
                        <Row gutter={[25, 25]}>
                            {lstDataOnlyIndex.length > 0 ? 
                                lstDataOnlyIndex.map((item, idx)=>{
                                    return(
                                        <Col key={idx} xxl={6} xl={8} md={12} xs={24}>
                                            <CardFortfolio infoIndex={item} _onDetailPortfolio={()=> this.onDetailPortfolio(item)}/>
                                        </Col>
                                    )
                                })
                            : null}
                        </Row>
                        <div className="pagination">
                            <Pagination 
                                pageSize={12} 
                                total={totalPage} 
                                onChange={this.onChangePagination}
                                hideOnSinglePage={true}
                            />
                        </div>
                    </div>
                </Loading>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstStock: state.portFolio['STOCKS.LIST'],
        bankAccount: state.portFolio['BANK_ACCOUNT.LIST'],
        dataProfitLoss: state.portFolio['EQUITY_ACCOUNT.PROFIT_LOSS'],
        //dataAssetInfo: state.portFolio['EQUITY_ACCOUNT.ASSET_INFO'],
        lstIndex: state.portFolio['INDEX.GET'],
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        equityAccountProfitLoss: (data)=> dispatch(equityAccountProfitLoss(data)),
        //equityAccountAssetInfo: (data)=> dispatch(equityAccountAssetInfo(data)),
        getListIndex: (data)=> dispatch(getListIndex(data)),
        createPortfolio: ()=> dispatch({
            type: 'NUMBER.PORTFOLIO.PAGE',
            data: 2
        }),
        getBankAccount: (data)=> dispatch(getBankAccount(data)),
        dispatch
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (Portfolio));