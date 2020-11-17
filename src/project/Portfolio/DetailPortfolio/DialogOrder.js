import React, {Component} from 'react';
import {Modal, Row, Col, List, Tag, Spin} from 'antd';
import * as common from '../../../components/Common/Common';

import { withRouter } from "react-router";
import {connect} from 'react-redux';
import {equityOrder} from '../../../stores/actions/core/equityOrderAction';
import {getBankAccount} from '../../../stores/actions/core/bankAccountAction';
import {onOrderPortfolio} from '../../../stores/actions/investor/orderAction';

import Loading from '../../../components/Loading/Loading';
import {css} from 'emotion';

let color = window['colors'];

const rootModalDialog = css`
    .ant-modal-content{
        border-radius: 1.1em;
    }
    .ant-modal-content > .ant-modal-header{
        border-top-left-radius: 1.1em;
        border-top-right-radius: 1.1em;
        padding: 1.5em 0;
    }

    .main{
        height: auto;
        width: 100%;
        @media only screen and (max-width: 992px) {
            overflow-y: scroll;
        }
        .header{
            background-color: ${color._GREY_LIGHT_2};
            height: 3em;
            display: flex;
            padding: 0 1em;
            align-items: center;
            font-weight: 600;
            font-size: 13px;
            color: ${color._BLACK};
            @media only screen and (max-width: 992px) {
                width: 170%;
            }
        }
        .bodyRoot{
            background-color: ${color._WHITE};
            height: auto;
            border: 1px solid ${color._STROKE};
            border-top: 0;
            overflow: auto;
            @media only screen and (max-width: 992px) {
                width: 170%;
            }
            .styleListStock{
                border: 0;
                padding: 1rem;
                .ant-checkbox-inner{
                    border-color: ${color._STROKE};
                    border-radius: 0.2em
                }
                .ant-checkbox-checked .ant-checkbox-inner{
                    background-color: ${color._BLUE_VCSC};
                    border-color: ${color._STROKE};
                    border-radius: 0.2em;
                }
                .item{
                    padding: 1em;
                    &:hover{
                        background-color: ${color._HOVER};
                        color: ${color._BLACK}
                    }
                    .ant-spin-dot-spin{
                        .ant-spin-dot-item{
                            background-color: ${color._ORANGE}!important;
                        }
                    }
                }
            }
            .ant-list{
                padding: 0
            }
        }
    }
    .footerRoot{
        .isBtnGeneral{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 3.5em;
            font-size: 1.2em;
            font-weight: 600;
            cursor: pointer;
        }
        .left{
            color: ${color._RED_VCSC};
            border-right: 1px solid ${color._GREY_LIGHT_2};
            &:hover{
                background-color: ${color._RED_LIGHT_2};
                border-bottom-left-radius: 1.1em;
            }
        }
        .right{
            color: ${color._BLUE_VCSC};
            cursor: pointer;
            &:hover{
                background-color: ${color._BLUE_VCSC_LIGHT};
                border-bottom-right-radius: 1.1em;
            }
        }
        .close{
            color: ${color._BLACK};
            cursor: pointer;
            &:hover{
                background-color: ${color._GREY_LIGHT_1};
                border-bottom-right-radius: 1.1em;
                border-bottom-left-radius: 1.1em;
            }
        }
    }
`

class DialogOrder extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            accountInfo: JSON.parse(localStorage.getItem('accountInfoKey')),
            isActive: 0,
            isIndex: 0,
            lstOrdered: [],
            lstOrderedIndex: [],
            isLoadingWait: false
        }
    }

    componentDidMount(){
        this.loadData();
    }

    loadData = async()=>{
        const{
            accountInfo
        } = this.state;

        if(accountInfo){
            await this.getBankAccountInv();
        }
    }

    getBankAccountInv = async()=> {
        const {
            accountInfo
        } = this.state;
        try {
            await this.props.getBankAccount({
                accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                subNumber: accountInfo.userInfo.accounts[0].accountSubs[0].subNumber
            });
        } catch (error) {
            
        }
    }
    
    _onRejectActionInvest = ()=>{
        this.props.onRejectActionInvest();
    }

    _onOrderActionInvest = async()=>{
        try {
            const lstIndexs = this.props.lstIndexs;
            if(lstIndexs.length > 0){
                let lstOrdered = [];
                for(let i = 0; i < lstIndexs.length; i++){
                    this.setState({isIndex: i, isLoading: true, isActive: 1});
                    try {
                        const res = await this.actionOrderApi(lstIndexs[i]);
                        this.setState({isLoading: false});
                        if(res.type === 'EQUITY_ORDER.LIST'){
                            this.setState({
                                lstOrderedIndex: [...this.state.lstOrderedIndex, i]
                            });
                            lstOrdered = [...lstOrdered, {
                                    ...lstIndexs[i],
                                    code: res.data.orderNumber,
                                    status: 0,
                                    type: "BUY"
                                }];
                        }
                    } catch (error) {
                        this.setState({isLoading: false});
                    }
                }
                this.setState({isLoadingWait: true});
                await this.actionOrderPortfolioApi(lstOrdered);
                this.setState({isActive: 2, isLoadingWait: false});
            }
        } catch (error) {
            this.setState({isLoadingWait: false});
        }
    }

    actionOrderApi = async(orderItem) => {
        const {
            accountInfo
        } = this.state;

        try {
            const accountBank = this.props.bankAccount.length > 0 ? this.props.bankAccount[0] : [];
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            let subNumber = '00';
            if(obj){
                if(obj.SUB_NUMBER){
                    subNumber = obj.SUB_NUMBER;
                }
            }
            let typeBuySell = 'BUY';
            const data = {
                "accountNumber": accountInfo.userInfo.accounts[0].accountNumber,
                "subNumber": subNumber,
                "orderQuantity": orderItem.quantity,
                "orderPrice": orderItem.last,
                // "orderPrice": orderItem.lastCurrent,
                "stockCode": orderItem.stockCode,
                "bankCode": accountBank.bankCode || '',
                "bankName": accountBank.bankName || '',
                "bankAccount": accountBank.bankAccount || '',
                "sellBuyType": typeBuySell,
                "orderType": "LO",
                "securitiesType": "STOCK"
            }
            return await this.props.equityOrder(data);
        } catch (error) {

        }
    }

    actionOrderPortfolioApi = async(data)=>{
        try {
            if(data.length > 0){
                let subNumber = '00';
                let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
                if (obj) {
                    if(obj.SUB_NUMBER){
                        subNumber = obj.SUB_NUMBER;
                    }
                }
                await this.props.onOrderPortfolio({
                    indexsId: this.props.indexsId,
                    value: this.props.totalExpected,
                    type: this.props.status === 0 ? 'DAUTUBANDAU' : 'DAUTUTHEM',
                    arrData: JSON.stringify(data),
                    subNumber: subNumber
                });
            }
        } catch (error) {
            
        }
    }

    onEndOrder = ()=>{
        this.props.dispatch({
            type: 'LIST.INDEXS.INVEST',
            data: {}
        });
        this.props.history.push("/list-portfolio");
    }

    render(){
        const{
            isIndex,
            isLoading,
            isActive,
            lstOrderedIndex,
            isLoadingWait
        } = this.state;

        const lstIndexs = this.props.lstIndexs;

        return(
            <Modal
                title={<div 
                    style={{fontSize: '1.6em', color: color._BLACK, fontWeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        Kiểm tra lệnh đặt
                    </div>}
                visible={this.props.isOpen}
                className={rootModalDialog}
                bodyStyle={styles.bodyModal}
                maskStyle={styles.modalCss}
                footer={null}
                closable={false}
                width={"60em"}
            >
                <div style={{width: '100%'}}>
                    <Loading isLoading={isLoadingWait}>
                        <div className="main">
                            <Row className="header">
                                <Col span={2}>
                                    STT
                                </Col>
                                <Col span={4}>
                                    Giao dịch
                                </Col>
                                <Col span={5}>
                                    Mã CP
                                </Col>
                                <Col span={4} style={{textAlign: 'right'}}>
                                    Giá đặt
                                </Col>
                                <Col span={4} style={{textAlign: 'right'}}>
                                    KL đặt
                                </Col>
                                <Col span={1}></Col>
                                <Col span={4}>
                                    Trạng thái
                                </Col>
                            </Row>

                            <div className="bodyRoot">
                                {lstIndexs.length > 0 ?
                                    <List
                                        size="default"
                                        bordered
                                        dataSource={lstIndexs}
                                        className="styleListStock"
                                        renderItem={(item, idx) => 
                                        <List.Item className="item">
                                            <Col span={2}>
                                                <span style={{fontWeight: 500}}>{idx + 1}</span>
                                            </Col>
                                            <Col span={4}>
                                                <Tag color={color._BLUE_VCSC_LIGHT}>
                                                    <span style={{color: color._BLUE_VCSC, fontWeight: 600, fontSize: 14}}>{'Mua'}</span>
                                                </Tag>
                                            </Col>
                                            <Col span={5}>
                                                <span style={{fontWeight: 600}}>{item.stockCode}</span>
                                            </Col>
                                            <Col span={4} style={{textAlign: 'right'}}>
                                            {/* <span style={{fontWeight: 500, color: item.lastCurrent === item.ceilingPrice ? color._GREEN : (item.lastCurrent === item.floorPrice ? color._RED_VCSC : color._BLACK)}}>{common.convertTextDecimal(item.lastCurrent)}</span> */}
                                                <span style={{fontWeight: 500, color: item.last === item.ceilingPrice ? color._GREEN : (item.last === item.floorPrice ? color._RED_VCSC : color._BLACK)}}>{common.convertTextDecimal(item.last)}</span>
                                            </Col>
                                            <Col span={4} style={{textAlign: 'right'}}>
                                                <span style={{fontWeight: 500}}>{common.convertTextDecimal(item.quantity)}</span>
                                            </Col>
                                            <Col span={1}></Col>
                                            <Col span={4}>
                                                {
                                                    (isActive >= 1 && idx <= isIndex) ? 
                                                        (isIndex === idx && isLoading) ?
                                                            <span>
                                                                <Spin size="small"/>&nbsp;&nbsp;<span style={{fontWeight: 500, color: color._ORANGE}}>{"Đang xử lý"}</span>
                                                            </span>
                                                        :
                                                            (lstOrderedIndex.includes(idx) ? 
                                                                <span style={{fontWeight: 500, color: color._GREEN}}>{"Thành công"}</span>
                                                                : 
                                                                <span style={{fontWeight: 500, color: color._RED_VCSC}}>{"Thất bại"}</span>
                                                            )
                                                            
                                                    : 
                                                    <span style={{fontWeight: 500}}>{"-"}</span>
                                                }
                                                
                                            </Col>
                                        </List.Item>}
                                    />
                                : null}
                            </div>
                        </div>
                        <div className="footerRoot">
                            {
                                isActive === 2 ? 
                                <Row className="close isBtnGeneral" onClick={this.onEndOrder}>
                                    ĐÓNG
                                </Row>
                                    : 
                                <Row>
                                    <Col span={12} className="left isBtnGeneral" onClick={this._onRejectActionInvest}>
                                        HỦY BỎ
                                    </Col>
                                    <Col span={12} className="right isBtnGeneral" onClick={this._onOrderActionInvest}>
                                        ĐẶT LỆNH
                                    </Col>
                                </Row>
                            }
                        </div>
                    </Loading>
                </div>
            </Modal>
        )
    }
}

const mapStateToProps = state =>{
    return{
        bankAccount: state.portFolio['BANK_ACCOUNT.LIST'],
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        equityOrder: (data)=> dispatch(equityOrder(data, true)),
        getBankAccount: (data)=> dispatch(getBankAccount(data)),
        onOrderPortfolio: (data)=> dispatch(onOrderPortfolio(data)),
        dispatch
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (DialogOrder));

const styles = {
    bodyModal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0
    },
    modalCss: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    }
}