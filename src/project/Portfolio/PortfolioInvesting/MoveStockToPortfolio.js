import React, {Component} from 'react';
import {Row, Col, List, Button, Checkbox, InputNumber } from 'antd';
import{SwapLeftOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';
import {listIndexMove, actionIndexMove} from '../../../stores/actions/investor/indexAction';

import {debounce} from 'lodash';

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

const customInputNumber = css`
    position: relative;
    width: 100%;
	top: 6px;
	color: #333333;
	font-weight: 500;
    font-size: 13px;
    .ant-input-number{
        width: 100%;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border: 1px solid #e3e5ec;
    }
    .isWarning{
        border: 1px solid ${color._RED_VCSC}!important;
    }
`

class MoveStockToPortfolio extends Component{
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
    
    loadData = async()=>{
        try {
            let data = this.props.lstIndexsInvest;
            if(Object.keys(data).length > 0){
                let subNumber = '00';
                let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
                if (obj) {
                    if(obj.SUB_NUMBER){
                        subNumber = obj.SUB_NUMBER;
                    }
                }
                this.setState({isLoadingList: true});
                const res = await this.props.listIndexMove({
                    indexsId: data.indexsId,
                    subNumber: subNumber,
                    arrIndexsDetail: JSON.stringify(data.indexsDetail)
                });
                this.setState({isLoadingList: false});
                if(res.type === 'LIST.INDEX.MOVE_ACTION'){
                    let arrData = [];
                    if(res.data.arrIndexsDetail.length > 0){
                        let lstTmp = res.data.arrIndexsDetail.map(item => {
                            return true
                        });
                        this.setState({lstChoose: lstTmp, isChosseMaster: true});
                        arrData = res.data.arrIndexsDetail.map((item)=>{
                            return {
                                ...item,
                                quantityMoveMax: item.quantityMove
                            }
                        });
                    }
                    this.setState({
                        lstIndexs: arrData || [], 
                        lstIndexsReal: arrData || []
                    });
                }
            }
        } catch (error) {
            this.setState({isLoadingList: false});
        }
    }

    componentWillUnmount(){
        try {
            this.props.dispatch({
                type: 'LIST.INDEXS.MOVE',
                data: {}
            });
        } catch (error) {
            
        }
    }

    onBackPortfolio = ()=>{
        this.props.dispatch({
            type: 'NUMBER.PORTFOLIO_INVESTING.PAGE',
            data: 1
        });
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

    updateNumberQuantity = (idx) => async(event)=>{
        const data = this.state.lstIndexs;
        let dataNew = [];
        if(data.length > 0){
            dataNew = data.map((item, index)=>{
                if(index === idx){
                    return{
                        ...item,
                        quantityMove: typeof event === "number" ? event : 0
                    }
                }
                return {
                    ...item
                }
            });
        }
        this.setState({lstIndexs : dataNew});
        this.isLoadAgain();
    }

    updateNumberPricetValue = (idx) => async(event)=>{
        const data = this.state.lstIndexs;
        let dataNew = [];
        if(data.length > 0){
            dataNew = data.map((item, index)=>{
                if(index === idx){
                    return{
                        ...item,
                        avgBuyingPrice: typeof event === "number" ? event : 0
                    }
                }
                return {
                    ...item
                }
            });
        }
        this.setState({lstIndexs : dataNew});
        this.isLoadAgain();
    }

    isLoadAgain = debounce(async()=> {
        const {
            isChosseMaster,
            lstChoose
        } = this.state;
        this.totalExpect(isChosseMaster, lstChoose);
    }, 300);

    onActionMove = async()=>{
        try {
            const {
                lstIndexsReal
            } = this.state;
            let data = this.props.lstIndexsInvest;
            if(lstIndexsReal.length === 0){
                common.notify("warning", "Quí khách cần chọn ít nhất một cổ phiếu để tiếp tục thao tác!!!");
            }else{
                let arr = lstIndexsReal.map(item => {
                    return{
                        ...item,
                        type: 'BUY'
                    }
                });
                let subNumber = '00';
                let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
                if (obj) {
                    if(obj.SUB_NUMBER){
                        subNumber = obj.SUB_NUMBER;
                    }
                }
                let toltal = lstIndexsReal.reduce(function(accumulator, currentValue) {
                    return accumulator + (currentValue.quantityMove * currentValue.avgBuyingPrice  || 0);
                }, 0);
                
                const res = await this.props.actionIndexMove({
                    indexsId: data.indexsId,
                    arrIndexsDetail: JSON.stringify(arr),
                    subNumber: subNumber,
                    value: toltal
                });
                if(res.type === 'INDEX.ACTION.MOVE_ACTION'){
                    common.notify("success", "Chuyển cổ phiếu ngoài vào danh mục thành công!!!");
                    this.setState({
                        lstIndexs: [],
                        lstIndexsReal: [],
                        isChosseMaster: false,
                        lstChoose: [],
                    })
                    this.props.dispatch({
                        type: 'NUMBER.PORTFOLIO_INVESTING.PAGE',
                        data: 1
                    });
                }
            }
        } catch (error) {
            
        }
    }

    render(){
        const {
            isLoadingList,
            lstIndexs,
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
            <Loading isLoading={isLoadingList}>
                <div className={rootMain}>
                    <div className="rootHeader">
                        <div className="left">
                            <div className="title p-top20">
                                Chuyển CP ngoài vào danh mục {this.props.lstIndexsInvest.indexsName || ''}
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
                            <Col span={2}>
                                Mã CP
                            </Col>
                            <Col span={6}>
                                Tên cổ phiếu
                            </Col>
                            <Col span={4} style={{textAlign: 'right'}}>
                                Số lượng
                            </Col>
                            <Col span={3} style={{textAlign: 'right'}}>
                                Đã có trong DM
                            </Col>
                            <Col span={1}/>
                            <Col span={3}>
                                SL chuyển vào DM
                            </Col>
                            <Col span={1}/>
                            <Col span={3}>
                                Giá gốc
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
                                        <Col span={6}>
                                            <span style={{fontWeight: 500}}>{item.companyName}</span>
                                        </Col>
                                        <Col span={4} style={{textAlign: 'right'}}>
                                            <span>{common.convertTextDecimal(item.totalBalance)}</span>
                                        </Col>
                                        <Col span={3} style={{textAlign: 'right'}}>
                                            <span>{common.convertTextDecimal(item.totalQuantity)}</span>
                                        </Col>
                                        <Col span={1}/>
                                        <Col span={3} className={customInputNumber}>
                                            <InputNumber 
                                                defaultValue={item.quantityMove}
                                                formatter={value => common.formatterNumber(value)}
                                                parser={value => common.parserNumber(value)}
                                                step={10}
                                                disabled={!lstChoose[idx]}
                                                max={item.quantityMoveMax}
                                                min={0}
                                                onChange={this.updateNumberQuantity(idx)}
                                            />
                                        </Col>
                                        <Col span={1}/>
                                        <Col span={3} className={customInputNumber}>
                                            <InputNumber 
                                                defaultValue={item.avgBuyingPrice}
                                                onChange={this.updateNumberPricetValue(idx)}
                                                formatter={value => common.formatterNumber(value)}
                                                parser={value => common.parserNumber(value)}
                                                step={10}
                                                disabled={!lstChoose[idx]}
                                                min={0}
                                            />
                                        </Col>
                                    </List.Item>}
                                />
                            : null}
                        </div>
                    </div>
                    <div className="footer p-top20">
                        <div className="left">
                            <div style={{ cursor: 'pointer' }} onClick={this.onBackPortfolio}>
                                <SwapLeftOutlined style={{ fontSize: '1.5em' }} /> QUAY LẠI
                            </div>
                        </div>
                        <div className="right">
                            <Button key="submit" className="btnOrder" onClick={this.onActionMove}>
                                CHUYỂN
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
        lstIndexsInvest: state.portFolio['LIST.INDEXS.MOVE'],
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        listIndexMove: (data)=> dispatch(listIndexMove(data)),
        actionIndexMove: (data)=> dispatch(actionIndexMove(data)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MoveStockToPortfolio);