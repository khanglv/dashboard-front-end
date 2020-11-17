import React, {Component} from 'react';
import {Row, Col, List, Tag, Button, Checkbox} from 'antd';
import{SwapLeftOutlined, SyncOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';
import {onRefreshPrice} from '../../../stores/actions/investor/indexAction';

import DialogOrder from './DialogOrder';
import Loading from '../../../components/Loading/Loading';
import * as common from '../../../components/Common/Common';
import {css} from 'emotion';

let color = window['colors'];

const rootMain = css`
    .rootHeader{
        .left{
            float: left;
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
            display: flex;
            align-items: center;
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
                    .ant-checkbox-checked{
                        .ant-checkbox-inner{
                            background-color: ${color._BLUE_VCSC};
                            border-color: ${color._BLUE_VCSC};
                        }
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
                padding: 8px 10px;
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

class DetailExchange extends Component{
    constructor(props){
        super(props);
        this.state= {
            lstIndexs: [],
            lstIndexsReal: [],
            isLoadingList: false,
            totalExpected: 0,
            isOpenModalInvest: false,
            isChosseMaster: false,
            lstChoose: [],
            indeterminate: false
        }
    }

    componentDidUpdate(prev){
        if(this.props.subNumberChange && prev.subNumberChange !== this.props.subNumberChange){
            window.location.href = '/list-portfolio';
        }
    }

    componentDidMount(){
        this.loadData();
    }
    
    loadData = ()=>{
        let data = this.props.lstIndexsInvest;
        if(Object.keys(data).length > 0){
            let toltal = 0;
            if(data.indexsDetail.length > 0){
                toltal = data.indexsDetail.reduce(function(accumulator, currentValue) {
                    return accumulator + (currentValue.quantity * currentValue.last  || 0);
                }, 0);
                let lstTmp = data.indexsDetail.map(item => {
                    return true
                });
                this.setState({lstChoose: lstTmp, isChosseMaster: true});
            }
            this.setState({
                lstIndexs: data.indexsDetail,
                lstIndexsReal: data.indexsDetail,
                totalExpected: toltal
            });
        }
    }

    componentWillUnmount(){
        try {
            this.props.dispatch({
                type: 'LIST.INDEXS.INVEST',
                data: {}
            });
            this.props.dispatch({
                type: 'NUMBER.DETAIL.PAGE',
                data: 1
            });
        } catch (error) {
            
        }
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
                
                this.setState({isLoadingList: true});
                const res = await this.onRefreshPriceApi(newArr, 1);
                this.setState({isLoadingList: false});
                if(res.type === 'INDEX.REFRESH_PRICE'){
                    if(res.data){
                        await this.setState({lstIndexs: res.data.data});
                        this.totalExpect(isChosseMaster, lstChoose);
                    }
                }
            }
        } catch (error) {
            this.setState({isLoadingList: false});
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
        try {
            const {
                lstIndexs,
                lstChoose,
                isChosseMaster
            } = this.state;

            this.setState({isLoadingList: true});
            const res = await this.onRefreshPriceApi(lstIndexs, 0);
            this.setState({isLoadingList: false});
            if(res.type === 'INDEX.REFRESH_PRICE'){
                if(res.data){
                    await this.setState({lstIndexs: res.data.data});
                    this.totalExpect(isChosseMaster, lstChoose);
                }
            }
        } catch (error) {
            
        }
        
    }

    onBackPortfolio = ()=>{
        this.props.dispatch({
            type: 'NUMBER.DETAIL.PAGE',
            data: 1
        });
    }

    onActionInvest = ()=>{
        const {
            lstIndexsReal
        } = this.state;
        if(lstIndexsReal.length === 0){
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
            isLoadingList,
            lstIndexs,
            lstIndexsReal,
            totalExpected,
            isOpenModalInvest,
            lstChoose,
            isChosseMaster,
            indeterminate
        } = this.state;

        //sau này để lại lstIndexs
        // let lstIndexsTest = lstIndexs.length > 0 ? lstIndexs.map((item)=>{
        //     return {
        //         ...item,
        //         quantity: parseInt(item.quantity/100)*100
        //     }
        // }) : [];

        return(
            <div className={rootMain}>
                <DialogOrder 
                    isOpen={isOpenModalInvest} 
                    lstIndexs={lstIndexsReal} 
                    onRejectActionInvest={this.onRejectActionInvest}
                    indexsId={this.props.lstIndexsInvest.indexsId}
                    status={this.props.lstIndexsInvest.status}
                    totalExpected={totalExpected}
                />
                <div className="rootHeader">
                    <div className="left">
                        <div className="title p-top20">
                            Thông tin lệnh giao dịch
                        </div>
                    </div>
                    <div className="right" style={{paddingTop: 30}}>
                        <div onClick={this.onUpdateLastPrice}>
                            <SyncOutlined /> Cập nhật giá
                        </div>
                    </div>
                    <div className="clearBoth"></div>
                </div>

                <div className="main p-top20">
                    <Row className="header">
                        <Col span={1}>
                            <Checkbox 
                                onClick={this.onChangeMaster} 
                                checked={isChosseMaster} 
                                indeterminate={indeterminate}
                            />
                        </Col>
                        <Col span={3}>
                            Giao dịch
                        </Col>
                        <Col span={3}>
                            Mã CP
                        </Col>
                        <Col span={5} className="headerStep">
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

                    <Loading isLoading={isLoadingList}>
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
                                        <Col span={3}>
                                            <Tag color={color._BLUE_VCSC_LIGHT}>
                                                <span style={{color: color._BLUE_VCSC, fontWeight: 600, fontSize: 14}}>{'Mua'}</span>
                                            </Tag>
                                        </Col>
                                        <Col span={3}>
                                            <span style={{fontWeight: 600}}>{item.stockCode}</span>
                                        </Col>
                                        <Col span={5} style={{textAlign: 'center'}}>
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
                                    <Col span={16} className="label" style={{textAlign: 'right'}}>
                                        TỔNG
                                    </Col>
                                    <Col span={4} className="total" style={{textAlign: 'right'}}>
                                        {common.convertTextDecimal(totalExpected)}
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
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstIndexsInvest: state.portFolio['LIST.INDEXS.INVEST'],
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onRefreshPrice: (data)=> dispatch(onRefreshPrice(data)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (DetailExchange);