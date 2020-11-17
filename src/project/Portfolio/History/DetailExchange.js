import React, {Component} from 'react';
import {Row, Col, List, Tag, Button} from 'antd';
import{SwapLeftOutlined, SyncOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';
import {refreshSetAgain} from '../../../stores/actions/investor/historyAction';

import DialogAction from './DialogAction';
import Loading from '../../../components/Loading/Loading';
import * as common from '../../../components/Common/Common';
import {css} from 'emotion';

let color = window['colors'];

const rootMain = css`
    .rootHeader{
        display: flex;
        align-items: center;
        .left{
            float: left;
            width: 70%;
            display: flex;
            align-items: center;
            .title{
                font-weight: 500;
                font-size: 1.8em;
                color: ${color._BLACK};
                @media only screen and (max-width: 992px) {
                    font-size: 1.2em;
                }
            }
        }
        .right{
            float: right;
            width: 30%;
            display: flex;
            justify-content: flex-end;
            color: ${color._BLUE_VCSC};
            cursor: pointer;
            &:hover{
                color: ${color._BLUE_LINK};
            }
        }
        .clearBoth{
            clear: both;
        }
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
                        font-size: 12px;
                        line-height: 2;
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
    
    .main{
        height: 'auto';
        @media only screen and (max-width: 992px) {
            overflow-y: scroll;
        }
        .header{
            background-color: ${color._GREY_LIGHT_2};
            height: 3.5em;
            display: flex;
            padding: 0 1em;
            align-items: center;
            font-weight: 600;
            color: ${color._BLACK};
            border: 1px solid ${color._STROKE};
            border-top-left-radius: 0.3em;
            border-top-right-radius: 0.3em;
            @media only screen and (max-width: 992px) {
                width: 170%;
            }
            .headerStep{
                display: flex;
                justify-content: center;
                align-items: center;
                .iconLeft{
                    margin-right: 1em;
                    font-size: 1.3em;
                    color: ${color._RED_VCSC};
                    cursor: pointer;
                    @media only screen and (max-width: 992px) {
                        margin-right: 0.5em;
                    }
                    &:hover{
                        background-color: #eee7e7;
                    }
                }
                .iconRight{
                    margin-left: 1em;
                    font-size: 1.3em;
                    color: ${color._GREEN};
                    cursor: pointer;
                    @media only screen and (max-width: 992px) {
                        margin-left: 0.5em;
                    }
                    &:hover{
                        background-color: #e3f2ed;
                    }
                }
            }
            .priceStep{
                font-weight: normal;
                font-size: 10px;
            }
            .alignRight{
                text-align: right;
            }
        }
        .bodyRoot{
            background-color: ${color._WHITE};
            height: auto;
            border: 1px solid ${color._STROKE};
            border-top: 0;
            border-bottom-left-radius: 0.3em;
            border-bottom-right-radius: 0.3em;
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
                    .customInput{
                        border-radius: 0.3em;
                        border: 1px solid ${color._STROKE};
                    }
                    .ant-input-number-disabled{
                        background-color: ${color._GREY_LIGHT_1};
                        color: rgba(0, 0, 0, 0.65)
                    }
                    .alignRight{
                        text-align: right;
                    }
                }
            }
            .ant-list{
                padding: 0
            }
            .footerTotal{
                border-top: 1px solid ${color._STROKE};
                padding: 0.8em;
                .label{
                    font-size: 12px;
                    font-weight: 500;
                    color: ${color._GREY_666};
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
                .total{
                    font-weight: 600;
                    color: ${color._BLACK};
                }
            }
        }
    }

    .footer{
        .left{
            float: left;
            font-weight: 600;
            color: ${color._BLUE_VCSC};
        }
        .right{
            float: right;
            .btnOrder{
                font-size: 13px;
                font-weight: 600;
                color: ${color._WHITE};
                height: auto;
                border-radius: 4px;
                padding: 10px 1.5em;
                margin-left: 1em;
                background-color: ${color._BLUE_VCSC};
                border: 1px solid ${color._BLUE_VCSC};
                &:hover{
                    background-color: ${color._BLUE_VCSC_HOVER};
                    border: 1px solid ${color._BLUE_VCSC_HOVER};
                }
            }
        }
        .clearBoth{
            clear: both;
        }
    }
`
function checkPriceChange(item){
    if (item.last === item.ceilingPrice)
        return <span style={{ color: color._GREEN, fontWeight: 500}}>(Trần)</span>;
    if (item.last > item.lastCurrent && item.last < item.ceilingPrice)
        return <span style={{ color: color._GREEN, fontWeight: 500 }}>(+{common.convertTextDecimal(item.last - item.lastCurrent)})</span>;
    if (item.last === item.floorPrice)
        return <span style={{ color: color._RED_VCSC, fontWeight: 500 }}>(Sàn)</span>;    
    if (item.last > item.floorPrice && item.last < item.lastCurrent)
        return <span style={{color: color._RED_VCSC, fontWeight: 500}}>(-{common.convertTextDecimal(item.lastCurrent - item.last)})</span>;
    return <span style={{color: color._ORANGE, fontWeight: 500}}>({0})</span>;
}

class RebalancePortfolio extends Component{
    constructor(props){
        super(props);
        this.state= {
            lstIndexs: [],
            dataMaster: {},
            isLoadingList: false,
            totalExpected: 0,
            isOpenModalInvest: false,
            isLoading: false
        };
    }

    componentDidMount(){
        this.loadData();
    }

    componentDidUpdate(prev){
        if(this.props.subNumberChange && prev.subNumberChange !== this.props.subNumberChange){
            window.location.href = '/history-portfolio';
        }
    }

    loadData = async()=>{
        try {
            const data = this.props.lstIndexsReOrder;
            if(Object.keys(data).length > 0){
                if(data.dataReOrder.length > 0){
                    this.setState({lstIndexs: data.dataReOrder});
                }
            }
        } catch (error) {
            
        }
    }

    componentWillUnmount(){
        this.props.dispatch({
            type: 'LIST.INDEXS.INVEST',
            data: {}
        });
        this.props.dispatch({
            type: 'NUMBER.PORTFOLIO_INVESTING.PAGE',
            data: 1
        });
        // this.props.componentEvent.stop();
    }

    onStepPrice = async (type)=>{
        try {
            const {
                lstIndexs
            } = this.state;
    
            let dataTmp = [...lstIndexs];
            if(dataTmp.length > 0){
                let newArr = dataTmp.map((item)=>{
                    let newLast = common.valueStepPrice({
                        ceilingPrice: item.ceilingPrice,
                        floorPrice: item.floorPrice,
                        last: item.last,
                        market: item.market
                    }, type);
                    return{
                        ...item,
                        last: newLast
                    }
                });
                
                this.setState({lstIndexs: newArr});
            }
        } catch (error) {
            
        }
    }

    onRefreshPriceApi = async(data)=>{
        try {
            this.setState({isLoadingList: true});
            const res = await this.props.refreshSetAgain({arrIndexsDetail: JSON.stringify(data)});
            this.setState({isLoadingList: false});
            if(res.type === 'INDEX.REFRESH_PRICE'){
                if(res.data){
                    this.setState({lstIndexs: res.data.data});
                }
            }
        } catch (error) {
            
        }
    }

    onUpdateLastPrice = async()=>{
        this.loadData();
    }

    onBackPortfolio = ()=>{
        this.props.dispatch({
            type: 'NUMBER.HISTORY_EXCHANGE.PAGE',
            data: 1
        });
    }

    onActionInvest = ()=>{
        this.setState({isOpenModalInvest: true});
    }

    onRejectActionInvest = ()=>{
        this.setState({isOpenModalInvest: false});
    }

    render(){
        const {
            isLoading,
            lstIndexs,
            isOpenModalInvest
        } = this.state;

        let totalExpectedSale = 0;
        let totalExpectedBuy = 0;
        if(lstIndexs.length > 0){
            totalExpectedSale = lstIndexs.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue.type === 'SELL' ? currentValue.quantity * currentValue.last : 0);
            }, 0);
            totalExpectedBuy = lstIndexs.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue.type === 'BUY' ? currentValue.quantity * currentValue.last : 0);
            }, 0);
        }

        //sau này để lại lstIndexs
        // let lstIndexsTest = lstIndexs.length > 0 ? lstIndexs.map((item)=>{
        //     return {
        //         ...item,
        //         quantity: parseInt(item.quantity/100)*100
        //     }
        // }) : [];

        return(
            <Loading isLoading={isLoading}>
                <div className={rootMain}>
                    <DialogAction
                        isOpen={isOpenModalInvest} 
                        lstIndexs={lstIndexs} 
                        onRejectActionInvest={this.onRejectActionInvest}
                        indexsId={this.props.lstIndexsReOrder.indexsId}
                        totalExpected={totalExpectedSale + totalExpectedBuy}
                        typeName={this.props.lstIndexsReOrder.typeName}
                        commandId={this.props.lstIndexsReOrder.commandId}
                    />
                    <div className="rootHeader p-top20">
                        <div className="left">
                            <div className="title">
                                Thông tin lệnh giao dịch
                            </div>
                        </div>    
                        <div className="right">
                            <div onClick={()=> this.onRefreshPriceApi(lstIndexs)}>
                                <SyncOutlined /> Cập nhật giá
                            </div>
                        </div>
                        <div className="clearBoth"></div>
                    </div>

                    <div className="main p-top20">
                        <Row className="header">
                            <Col span={3}>
                                Giao dịch
                            </Col>
                            <Col span={3}>
                                Mã CP
                            </Col>
                            <Col span={6} className="headerStep">
                                <div className="iconLeft">
                                    <img alt="" src="/icon/ic_sub.svg" onClick={()=> this.onStepPrice(0)}/>
                                    {/* <MinusCircleOutlined className="iconLeft" onClick={()=> this.onStepPrice(0)}/> */}
                                </div>
                                <div>
                                    <div style={{display: 'flex', justifyContent: 'center'}}>Giá đặt</div>
                                    <div className="priceStep">(± so với giá tt)</div>
                                </div>
                                <div className="iconRight">
                                    <img alt="" src="/icon/ic_add.svg" onClick={()=> this.onStepPrice(1)}/>
                                    {/* <PlusCircleOutlined className="iconRight" onClick={()=> this.onStepPrice(1)}/> */}
                                </div>
                            </Col>
                            <Col span={4} style={{textAlign: 'right'}}>
                                KL giao dịch
                            </Col>
                            <Col span={4} style={{textAlign: 'right'}}>
                                Giá trị dự kiến
                            </Col>
                            <Col span={4} style={{textAlign: 'right'}}>
                                Tỷ trọng dự kiến
                            </Col>
                        </Row>

                        <Loading>
                            <div className="bodyRoot">
                                {lstIndexs.length > 0 ?
                                    <List
                                        size="default"
                                        bordered
                                        dataSource={lstIndexs}
                                        className="styleListStock"
                                        renderItem={(item, idx) => 
                                        <List.Item className="item">
                                            <Col span={3}>
                                                <Tag color={color._BLUE_VCSC_LIGHT}>
                                                    <span style={{color: color._BLUE_VCSC, fontWeight: 600, fontSize: 14}}>{'Mua'}</span>
                                                </Tag>
                                            </Col>
                                            <Col span={3}>
                                                <span style={{fontWeight: 600}}>{item.stockCode}</span>
                                            </Col>
                                            <Col span={6} style={{textAlign: 'center'}}>
                                                <span style={{fontWeight: 500}}>{common.convertTextDecimal(item.last)}</span>
                                                &nbsp;{
                                                    checkPriceChange(item)
                                                }

                                                {/* <span style={{fontWeight: 500}}>{common.convertTextDecimal(item.lastCurrent)}</span> */}
                                            
                                                {/* {item.last === item.ceilingPrice ? <span style={{color: color._GREEN}}>- Trần</span> : (item.last === item.floorPrice ? <span style={{color: color._RED_VCSC}}>- Sàn</span> : null)} */}
                                            </Col>
                                            <Col span={4} style={{textAlign: 'right'}}>
                                                <span style={{fontWeight: 500}}>{common.convertTextDecimal(item.quantity)}</span>
                                            </Col>
                                            <Col span={4} style={{textAlign: 'right'}}>
                                                <span style={{fontWeight: 500}}>{common.convertTextDecimal(item.quantity*(parseFloat(item.last || 0)))}</span>
                                            </Col>
                                            <Col span={4} style={{textAlign: 'right'}}>
                                                <span style={{fontWeight: 500}}>{item.proportionReal}%</span>
                                            </Col>
                                        </List.Item>}
                                    />
                                : null}
                                <div className="footerTotal">
                                    <Row>
                                        <Col span={21} className="label" style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', color: color._RED_VCSC, fontWeight: 600}}>
                                            TỔNG BÁN
                                        </Col>
                                        <Col span={3} className="total" style={{textAlign: 'right', fontWeight: 600, fontSize: '1.2em', color: color._BLACK}}>
                                            {common.convertTextDecimal(totalExpectedSale)}
                                        </Col>
                                    </Row>
                                    <Row className="p-top10">
                                        <Col span={21} className="label" style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', color: color._BLUE_VCSC, fontWeight: 600}}>
                                            TỔNG MUA
                                        </Col>
                                        <Col span={3} className="total" style={{textAlign: 'right', fontWeight: 600, fontSize: '1.2em', color: color._BLACK}}>
                                            {common.convertTextDecimal(totalExpectedBuy)}
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Loading>
                    </div>
                    
                    <div className="footer p-top20">
                        <div className="left">
                            <div style={{ cursor: 'pointer' }} onClick={this.onBackPortfolio}>
                                <SwapLeftOutlined style={{ fontSize: '1.5em' }} /> QUAY LẠI
                            </div>
                        </div>
                        <div className="right">
                            <Button key="submit" className="btnOrder" onClick={this.onActionInvest}>
                                THỰC HIỆN ĐẦU TƯ
                            </Button>
                        </div>
                        <div className="clearBoth"></div>
                    </div>
                </div>
            </Loading>
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstIndexsReOrder: state.portFolio['DATA.REORDER.HISTORY']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        refreshSetAgain: (data)=> dispatch(refreshSetAgain(data)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (RebalancePortfolio);