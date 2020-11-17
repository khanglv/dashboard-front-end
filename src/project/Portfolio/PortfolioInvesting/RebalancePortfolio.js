import React, {Component} from 'react';
import {Row, Col, List, Tag, Button, Tooltip, Checkbox} from 'antd';
import{SwapLeftOutlined, SyncOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';
import {indexReblance} from '../../../stores/actions/investor/indexAction';

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
            .ant-checkbox-checked{
                .ant-checkbox-inner{
                    background-color: ${color._BLUE_VCSC};
                    border-color: ${color._BLUE_VCSC};
                }
            }
            .ant-checkbox-indeterminate{
                .ant-checkbox-inner::after{
                    background-color: ${color._BLUE_VCSC};
                    border-color: ${color._BLUE_VCSC};
                }
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
            lstIndexsReal: [],
            dataMaster: {},
            isLoadingList: false,
            totalExpected: 0,
            isOpenModalInvest: false,
            isLoading: false,
            isChosseMaster: false,
            lstChoose: [],
            indeterminate: false
        };
    }

    componentDidMount(){
        this.loadData(true);
    }

    componentDidUpdate(prev){
        if(this.props.subNumberChange && prev.subNumberChange !== this.props.subNumberChange){
            window.location.href = '/list-portfolio';
        }
    }

    loadData = async(setChosseMaster, isReload = false)=>{
        try {
            const {
                lstChoose,
                isChosseMaster
            } = this.state;
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            let subNumber = '00';
            if(obj){
                if(obj.SUB_NUMBER){
                    subNumber = obj.SUB_NUMBER;
                }
            }
            this.setState({isLoading: true});
            const res = await this.props.indexReblance({
                subNumber: subNumber,
                arrIndexsDetail: JSON.stringify(this.props.lstIndexOfItem.lstIndexs),
                totalValueCurrent: JSON.stringify(this.props.lstIndexOfItem.totalValueCurrent),
            });
            this.setState({isLoading: false});
            if(res.type === 'INDEX.BALANCE'){
                let lstTmp = res.data.arrIndexsDetail.map(item => {
                    return true
                });
                
                this.totalExpect(setChosseMaster, isReload ? lstChoose : lstTmp);
                this.setState({
                    lstIndexs: res.data.arrIndexsDetail, 
                    dataMaster: res.data,
                    isChosseMaster: setChosseMaster
                });
                if(!isReload){
                    this.setState({lstChoose: lstTmp, lstIndexsReal: res.data.arrIndexsDetail});
                }else{
                    this.totalExpect(isChosseMaster, lstChoose);
                }
            }
        } catch (error) {
            this.setState({isLoading: false});
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
                lstIndexs,
                isChosseMaster,
                lstChoose
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
                
                await this.setState({lstIndexs: newArr});
                this.totalExpect(isChosseMaster, lstChoose);
            }
        } catch (error) {
            
        }
    }

    onRefreshPriceApi = (data, type)=>{
        try {
            return this.props.onRefreshPrice({
                indexsDetail: JSON.stringify(data),
                type: type
            })
        } catch (error) {
            
        }
    }

    onUpdateLastPrice = async()=>{
        const {
            isChosseMaster
        } = this.state;

        this.loadData(isChosseMaster, true);
    }

    onBackPortfolio = ()=>{
        this.props.dispatch({
            type: 'NUMBER.PORTFOLIO_INVESTING.PAGE',
            data: 1
        });
    }

    onActionInvest = ()=>{
        const {
            lstIndexsReal
        } = this.state;
        if(lstIndexsReal.length <= 0){
            common.notify("warning", "Quí khách cần chọn ít nhất một cổ phiếu để tiếp tục thao tác!!!");
        }else{
            this.setState({isOpenModalInvest: true});
        }
    }

    onRejectActionInvest = ()=>{
        this.setState({isOpenModalInvest: false});
    }

    totalExpect = (isMaster, lstChoose)=>{
        try {
            const {
                lstIndexs
            } = this.state;
            if(lstIndexs.length > 0){
                let toltal = 0;
                let arrExclude = [];
                if(isMaster === true){
                    arrExclude = lstIndexs;
                    toltal = lstIndexs.reduce(function(accumulator, currentValue) {
                        return accumulator + (currentValue.quantity * currentValue.last  || 0);
                    }, 0);
                }else{
                    for(let i = 0; i < lstIndexs.length; i++){
                        if(lstChoose[i] === true){
                            arrExclude.push(lstIndexs[i]);
                        }
                    }
                    toltal = arrExclude.reduce(function(accumulator, currentValue) {
                        return accumulator + (currentValue.quantity * currentValue.last  || 0);
                    }, 0);
                }
                this.setState({totalExpected: toltal, lstIndexsReal: arrExclude});
            }
        } catch (error) {
            
        }
    }

    onChangeMaster = (e)=>{
        const {
            isChosseMaster,
            lstChoose
        } = this.state;
        let lstTmp = [];
        if(lstChoose.length > 0){
            if(isChosseMaster === true){
                lstTmp = lstChoose.map(item => {
                    return false;
                });
                this.setState({lstChoose: lstTmp});
            }else{
                lstTmp = lstChoose.map(item => {
                    return true;
                });
            }
        }
        this.setState({isChosseMaster: e.target.checked, lstChoose: lstTmp, indeterminate: false});
        this.totalExpect(e.target.checked, lstTmp);
    }

    onChangeItem = (idx) => e => {
        const {
            lstChoose
        } = this.state;
        if(lstChoose.length > 0){
            let lstTmp = lstChoose.map((item, i)=>{
                return i === idx ? e.target.checked : item;
            });
            let lstFindTrue = lstTmp.filter(item => item === true);
            if(lstFindTrue.length === lstChoose.length){
                this.setState({isChosseMaster: true, indeterminate: false});
            }else if(lstFindTrue.length === 0){
                this.setState({isChosseMaster: false, indeterminate: false});
            }else{
                this.setState({isChosseMaster: false, indeterminate: true});
            }
            this.totalExpect(false, lstTmp);
            this.setState({lstChoose: lstTmp});
        }
    }

    render(){
        const {
            isLoading,
            lstIndexs,
            lstIndexsReal,
            dataMaster,
            isOpenModalInvest,
            lstChoose,
            isChosseMaster,
            indeterminate
        } = this.state;

        let totalExpectedSale = 0;
        let totalExpectedBuy = 0;
        if(lstIndexsReal.length > 0){
            totalExpectedSale = lstIndexsReal.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue.type === 'SELL' ? currentValue.quantity * currentValue.last : 0);
            }, 0);
            totalExpectedBuy = lstIndexsReal.reduce((accumulator, currentValue) => {
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

        let data = this.props.objIndexInvesting;

        return(
            <Loading isLoading={isLoading}>
                <div className={rootMain}>
                    <DialogAction
                        isOpen={isOpenModalInvest} 
                        lstIndexs={lstIndexsReal} 
                        onRejectActionInvest={this.onRejectActionInvest}
                        indexsId={this.props.lstIndexOfItem.indexId}
                        totalExpected={totalExpectedSale + totalExpectedBuy}
                        actionType="TAICANBANGDANHMUC"
                    />
                    <div className="rootHeader p-top20">
                        <div className="left">
                            <div className="title">
                                Tái cân bằng danh mục - {data.indexsName}
                            </div>
                        </div>    
                        <div className="right">
                            <div onClick={this.onUpdateLastPrice}>
                                <SyncOutlined /> Cập nhật giá
                            </div>
                        </div>
                        <div className="clearBoth"></div>
                    </div>

                    <div className="comHeaderRoot p-top10">
                        <div className="scroll">
                            <Row className="headerTotalStatistical">
                                <Col span={8} className="itemComp borderRight">
                                    <div className="title">TỔNG ĐẦU TƯ</div>
                                    <div className="content">{common.convertTextDecimal(data.totalValue || 0)}</div>
                                </Col>
                                <Col span={8} className="itemComp borderRight">
                                    <div className="title">GIÁ TRỊ HIỆN TẠI</div>
                                    <div className="content">{common.convertTextDecimal(data.totalValueCurrent || 0)}</div>
                                </Col>
                                <Col span={8} className="itemComp borderRight">
                                    <div className="title">GIÁ TRỊ LÃI/LỖ</div>
                                    <div className="content"style={{color: data.rateLossValue > 0 ? color._GREEN : color._RED_VCSC}}>{common.convertTextDecimal(data.rateLossValue)}&nbsp;({data.percentRateLoss}%)</div>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    <div className="main p-top20">
                        <div className="p-top20">
                            <Row className="header">
                                <Col span={1}>
                                    <Checkbox 
                                        onClick={this.onChangeMaster} 
                                        checked={isChosseMaster} 
                                        indeterminate={indeterminate}
                                    />
                                </Col>
                                <Col span={2}>
                                    Mã CP
                                </Col>
                                <Col span={3} className="alignRight">
                                    Tỉ trọng mục tiêu
                                </Col>
                                <Col span={3} className="alignRight">
                                    Tỉ trọng hiện tại
                                </Col>
                                <Col span={3} className="alignRight">
                                    % Chênh lệch
                                </Col>
                                <Col span={3} style={{textAlign: 'center'}}>
                                    Giao dịch
                                </Col>
                                <Col span={3} className="headerStep">
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
                                <Col span={3} className="alignRight">
                                    KL giao dịch
                                </Col>
                                <Col span={3} className="alignRight">
                                    Giá trị dự kiến
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
                                        <List.Item className="item" style={{opacity: lstChoose[idx] === false ? 0.7 : ''}}>
                                            <Col span={1}>
                                                <Checkbox onClick={this.onChangeItem(idx)} checked={lstChoose[idx]}/>
                                            </Col>
                                            <Col span={2}>
                                                <span style={{fontWeight: 600}}>{item.stockCode}</span>
                                            </Col>
                                            <Col span={3} className="alignRight">
                                                <span style={{fontWeight: 500}}>{item.proportionTarget}</span>
                                            </Col>
                                            <Col span={3} className="alignRight">
                                                <span style={{fontWeight: 500}}>{item.proportionReal}</span>
                                            </Col>
                                            <Col span={3} className="alignRight">
                                                <span style={{fontWeight: 500}}>{item.percentDifference}%</span>
                                            </Col>
                                            <Col span={3} style={{textAlign: 'center'}}>
                                                <Tag color={item.type === 'BUY' ? color._BLUE_VCSC_LIGHT : color._RED_VCSC_LIGHT}>
                                                    <span style={{color: item.type === 'BUY' ? color._BLUE_VCSC : color._RED_VCSC, fontWeight: 600, fontSize: 14}}>{item.type === 'BUY' ? 'Mua' : 'Bán'}</span>
                                                </Tag>
                                            </Col>
                                            <Col span={3} style={{textAlign: 'center'}}>
                                                <span style={{fontWeight: 500}}>{common.convertTextDecimal(item.last)}</span>
                                                &nbsp;{
                                                    checkPriceChange(item)
                                                }
                                                
                                                {/* {item.last === item.ceilingPrice ? <span style={{color: color._GREEN}}>- Trần</span> : (item.last === item.floorPrice ? <span style={{color: color._RED_VCSC}}>- Sàn</span> : null)} */}
                                            </Col>
                                            <Col span={3} className="alignRight">
                                                <span style={{fontWeight: 500}}>{common.convertTextDecimal(item.quantity)}</span>
                                            </Col>
                                            <Col span={3} className="alignRight">
                                                <span style={{fontWeight: 500}}>{common.convertTextDecimal(item.quantity*item.last)}</span>
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
                        </div>
                    </div>
                    <div className="p-top20">
                        <Row>
                            <Col span={21} style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontWeight: 500, fontSize: 13}}>
                                <div className="title">Số mua tối thiểu <Tooltip
                                    title={<span style={{fontSize: '0.8em', lineHeight: 0.8}}>
                                        Sức mua tối thiếu được tính trên cổ phiếu không được giao dịch ký quỹ (margin) tại tiểu khoản 01 - Margin
                                        Tuy nhiên, không áp dụng cho trường hợp: <br />
                                        • Hết hạn mức cho vay cổ phiếu đang có trong danh mục. <br />
                                        • Hết hạn mức margin của 1 tài khoản.
                                    </span>}
                                >
                                        <img alt="" width="16px" src="/icon/ic_information.svg"/>
                                    </Tooltip>
                                </div>
                            </Col>
                            <Col span={3} className="total" style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontWeight: 600, fontSize: '1.2em', color: color._BLACK}}>
                                {common.convertTextDecimal(dataMaster.buyingPowerMin)}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={21} style={{textAlign: 'right', fontWeight: 500, fontSize: 13}}>
                                <div className="title">Margin tối đa <Tooltip
                                    title={<span style={{fontSize: '0.8em', lineHeight: 0.8}}>
                                        Sức mua tối đa được tính trên các cổ phiếu có tỷ lệ ký quỹ 50% tại tiểu khoản 01 - Margin
                                        Tuy nhiên, không áp dụng cho trường hợp: <br />
                                        • Hết hạn mức cho vay cổ phiếu đang có trong danh mục. <br />
                                        • Hết hạn mức margin của 1 tài khoản.
                                    </span>}
                                >
                                        <img alt="" width="16px" src="/icon/ic_information.svg"/>
                                    </Tooltip>
                                </div>
                            </Col>
                            <Col span={3} className="total" style={{textAlign: 'right', fontWeight: 600, fontSize: '1.2em', color: color._BLACK}}>
                                {common.convertTextDecimal(dataMaster.marginMax)}
                            </Col>
                        </Row>
                    </div>
                    <div className="footer p-top20">
                        <div className="left">
                            <div style={{ cursor: 'pointer' }} onClick={this.onBackPortfolio}>
                                <SwapLeftOutlined style={{ fontSize: '1.5em' }} /> QUAY LẠI
                            </div>
                        </div>
                        <div className="right">
                            <Button key="submit" className="btnOrder" onClick={this.onActionInvest}>
                                THỰC HIỆN TÁI CÂN BẰNG
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
        lstIndexsInvest: state.portFolio['LIST.INDEXS.INVEST'],
        lstIndexOfItem: state.portFolio['LIST.INDEXS.INVESTING'],
        objIndexInvesting: state.portFolio['INDEX.INVESTING']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        indexReblance: (data)=> dispatch(indexReblance(data)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (RebalancePortfolio);