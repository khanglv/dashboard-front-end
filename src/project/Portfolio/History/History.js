import React, {Component} from 'react';
import {DatePicker, Tag, Row, Col, Select} from 'antd';
import {CaretDownOutlined, PlusOutlined, CaretUpOutlined, SyncOutlined, MinusOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';
import {getHistory, getHistoryIndexTime} from '../../../stores/actions/investor/historyAction';
import {
    getEquityOrderHistory,
} from '../../../stores/actions/core/equityOrderAction';
import Loading from '../../../components/Loading/Loading';
import moment from 'moment';
import * as common from '../../../components/Common/Common';

import {css} from 'emotion';

let color = window['colors'];
const { Option } = Select;
const dateFormat = 'DD/MM/YYYY';
const newDate = new Date();

const rootMain = css`
    padding-bottom: 1em;
    height: auto;
    .rootHeader{
        .title{
            font-weight: 500;
            font-size: 1.8em;
            color: ${color._BLACK};
            @media only screen and (max-width: 992px) {
                font-size: 1.2em;
            }
        }
        .left{
            float: left;
            .datePicker{
                border: 1px solid ${color._STROKE};
                border-radius: 0.3em;
                color: ${color._BLACK};
                font-weight: 500;
                svg{
                    color: ${color._BLACK};
                }
            }
        }
        .right{
            float: right;
            .customSelectOrder{
                width: 15em;
                top: 5px;
                color: #333333;
                font-weight: 500;
                font-size: 13px;
                .ant-select-selector{
                    border: 1px solid #e3e5ec;
                    border-radius: 4px!important;
                }
                &.HeaderOrder{
                    width: 25rem;
                    top: 0;
                }
            }
        }
        .clearBoth{
            clear: both;
        }
    }
    overflow-x: auto;
    .rootBody{
        @media only screen and (max-width: 992px) {
            width: 200%;
        }
        .itemHistory{
            .iconDown{
                font-size: 1.4em;
                .isRefresh{
                    color: ${color._ORANGE};
                    &:hover{
                        color: #ff841b;
                    }
                }
            }
            .left{
                float: left;
                width: 70%;
                .titleHeader{
                    color: ${color._GREY_999};
                    font-size: 12px;
                    font-weight: 600;
                }
                .main{
                    display: flex;
                    align-items: center;
                    .label{
                        color: ${color._GREY_999};
                        font-size: 12px;
                        font-weight: 600;
                    }
                    .title{
                        color: ${color._BLACK};
                        font-size: 1.3em;
                        font-weight: 600;
                    }
                    .isActive{
                        color: ${color._BLUE_VCSC};
                    }
                }
            }
            .right{
                float: right;
                width: 30%;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                .titleHeader{
                    color: ${color._GREY_999};
                    font-size: 12px;
                    font-weight: 600;
                }
                .label{
                    color: ${color._BLACK};
                    font-size: 1.3em;
                    font-weight: 600;
                }
            }
            .clearBoth{
                clear: both;
            }
            &:hover{
                cursor: pointer;
            }
        }
        .isActive{
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
    }
`

const collapseFirst = css`
    .header{
        width: 100%;
        background-color: ${color._GREY_LIGHT_1};
        padding: 1em;
        padding-left: 1.9em;
        font-weight: 600;
        color: ${color._GREY_666};
        .reload{
            color: ${color._BLUE_VCSC};
            font-size: 1.2em;
            cursor: pointer;
        }
    }
    .bodyRoot{
        width: 100%;
        background-color: ${color._WHITE};
        border-bottom-left-radius: 0.6em;
        border-bottom-right-radius: 0.6em;
        .itemCom{
            padding: 0.8em 1em;
            padding-left: 1.9em;
            font-weight: 500;
            color: ${color._BLACK};
            cursor: pointer;
            &:hover{
                background-color: ${color._HOVER}
            }
        }
        .isActive{
            background-color: ${color._HOVER};
            color: ${color._BLUE_VCSC};
            font-weight: 600;
        }
        .footerTotal{
            border-bottom: 1px solid ${color._GREY_LIGHT_2};
            padding: 0.8em;
            .label{
                font-size: 12px;
                font-weight: 500;
                color: ${color._BLUE_VCSC};
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
            .total{
                font-weight: 600;
                color: ${color._BLUE_VCSC};
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
            .btnReOrder{
                background-color: ${color._RED_VCSC};
                color: ${color._WHITE};
                padding: 0.3em 1.5em;
                height: auto;
                border-radius: 0.3em;
                border: 1px solid ${color._RED_VCSC};
                outline: none;
                cursor: pointer;
                &:hover{
                    background-color: ${color._RED_VCSC_MY_HOVER};
                    border: 1px solid ${color._RED_VCSC_MY_HOVER};
                    color: ${color._WHITE};
                }
            }
        }
    }
    .borderBottom{
        border-bottom: 1px solid ${color._GREY_LIGHT_2}
    }
`

class CollapseFirst extends Component{
    constructor(props){
        super(props);
        this.state = {
            isChooses: [],
            isLoading: false
        }
    }

    componentDidMount(){
        if(this.props._isOpenInput !== null){
            this.setState({isChooses: [{key: this.props._isOpenInput, dataIndexTime: this.props._dataIndexInput || []}]});
        }
    }

    expandCollapseTime = async(idx, item)=>{
        try {
            const {
                isChooses
            } = this.state;

            let keyTmp = isChooses.map(o => o.key).indexOf(idx);
    
            if(keyTmp > -1){
                let dataNew = isChooses.filter(item => item.key !== idx)
                this.setState({isChooses: dataNew});
            }else{
                this.setState({isChooses: [...isChooses, {key: idx, dataIndexTime: item.data || []}] });
            }
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    render(){
        const {
            isChooses,
            isLoading
        } = this.state;

        const data = this.props.data;

        return(
            <Loading isLoading={isLoading}>
                <div className={collapseFirst}>
                    <Row className="header">
                        <Col span={9}>
                            <span style={{ width: '2em', display: 'inline-block'}} />Danh mục
                        </Col>
                        <Col span={5}>
                            Loại danh mục
                        </Col>
                        <Col span={10} style={{textAlign: 'right'}}>
                            Giá trị đặt lệnh
                        </Col>
                    </Row>
                    <div className="bodyRoot">
                        {data.length > 0 ? data.map((item, idx)=>{
                            let isCheck = false;
                            let dataTmp = [];
                            let indexTmp = isChooses.map(o => o.key).indexOf(idx);
                            if( indexTmp > -1){
                                isCheck = true;
                                dataTmp = isChooses[indexTmp].dataIndexTime;
                            }
                            return(
                                <div key={idx}>
                                    <Row className={`itemCom ${isCheck ? 'isActive' : ''}`} onClick={()=> this.expandCollapseTime(idx, item)}>                                       
                                        <Col span={9}>
                                            <span style={{ width: '2em', display: 'inline-block'}}>
                                                {isCheck ?
                                                    <MinusOutlined className="iconExpand"/>
                                                    : <PlusOutlined className="iconExpand"/>
                                                }
                                            </span>
                                            <span style={{fontWeight: 500}}>{item.indexsName}</span>
                                        </Col>
                                        <Col span={5}>
                                            <span style={{fontWeight: 500}}>{item.type}</span>
                                        </Col>
                                        <Col span={10} style={{textAlign: 'right'}}>
                                            {common.convertTextDecimal(item.value)}
                                        </Col>
                                    </Row>
                                    <div className="borderBottom"/>
                                    {isCheck ? 
                                        <CollapseTime 
                                            data={dataTmp}
                                            itemMaster={item}
                                            lstIndexTime={this.props.lstIndexTime}
                                            indexsId={this.props.indexsId || null}
                                            dispatch={this.props.dispatch}
                                        /> 
                                    : null}
                                </div>
                            )
                        }) : null}
                    </div>
                </div>
            </Loading>
        )
    }
}

class CollapseTime extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: false
        }
    }

    componentWillMount(){
        // const dataIndexTime = this.props.data;
        // this.setState({data: dataIndexTime});
    }

    onReOrder = (dataRe)=>{
        try {
            let dataReOrder = [];
            let dataMaster = this.props.itemMaster;
            if(dataRe.length > 0){
                dataReOrder = dataRe.filter(item => item.orderQuantity - item.matchedQuantity > 0).map(item => {
                    return{
                        ...item,
                        quantity: item.orderQuantity - item.matchedQuantity,
                        id: item.detailId
                    }
                });
                let dataUse = {
                    dataReOrder: dataReOrder,
                    typeName: dataMaster.typeName,
                    indexsId: dataMaster.indexsId,
                    commandId: dataMaster.id
                }
                this.props.dispatch({
                    type: 'NUMBER.HISTORY_EXCHANGE.PAGE',
                    data: 2
                });
                this.props.dispatch({
                    type: 'DATA.REORDER.HISTORY',
                    data: dataUse
                });
            }
        } catch (error) {
            
        }
    }

    render(){
        const {
            isLoading
        } = this.state;

        // let totalMatched = 0;
        // if(data.length > 0){
        //     totalMatched = data.reduce(function(accumulator, currentValue) {
        //         return accumulator + currentValue.matchedQuantity * currentValue.matchedPrice;
        //     }, 0);
        // }

        let dataMaster = this.props.itemMaster;
        let data = dataMaster.data;

        return(
            <Loading isLoading={isLoading}>
                <div className={collapseFirst}>
                    {/* <div className="p-top10"></div> */}
                    <Row className="header">
                        <Col span={4}>
                            Thời gian
                        </Col>
                        <Col span={3}>
                            Số hiệu lệnh
                        </Col>
                        <Col span={2}>
                            Mã CP
                        </Col>
                        <Col span={2}>
                            Mua/bán
                        </Col>
                        <Col span={2} style={{textAlign: 'right'}}>
                            SL Đặt
                        </Col>
                        <Col span={3} style={{textAlign: 'right'}}>
                            Giá Đặt
                        </Col>
                        <Col span={2} style={{textAlign: 'right'}}>
                            SL Khớp
                        </Col>
                        <Col span={3} style={{textAlign: 'right'}}>
                            Giá Khớp
                        </Col>
                        <Col span={1} />
                        <Col span={2}>
                            Trạng thái
                        </Col>
                    </Row>
                    <div className="bodyRoot">
                        {data.length > 0 ? data.map((item, idx)=>{
                            return(
                                <div key={idx}>
                                    <Row className="itemCom">
                                        <Col span={4}>
                                            {common.convertDDMMYYYY(item.createDate)}&nbsp;{common.convertTime(item.createDate)}
                                        </Col>
                                        <Col span={3}>
                                            {item.code}
                                        </Col>
                                        <Col span={2}>
                                            {item.stockCode}
                                        </Col>
                                        <Col span={2}>
                                            <Tag color={item.type === 'BUY' ? color._BLUE_VCSC_LIGHT : color._RED_VCSC_LIGHT}>
                                                <span style={{color: item.type === 'BUY' ? color._BLUE_VCSC : color._RED_VCSC, fontWeight: 600}}>{item.type === 'BUY' ? 'Mua' : 'Bán'}</span>
                                            </Tag>
                                        </Col>
                                        <Col span={2} style={{textAlign: 'right'}}>
                                            {common.convertTextDecimal(item.orderQuantity)}
                                        </Col>
                                        <Col span={3} style={{textAlign: 'right'}}>
                                            {common.convertTextDecimal(item.orderPrice)}
                                        </Col>
                                        <Col span={2} style={{textAlign: 'right'}}>
                                            {common.convertTextDecimal(item.matchedQuantity)}
                                        </Col>
                                        <Col span={3} style={{textAlign: 'right'}}>
                                            {common.convertTextDecimal(item.matchedPrice)}
                                        </Col>
                                        <Col span={1} />
                                        <Col span={2} style={{fontWeight: 600}}>
                                            {
                                                item.code === 0 ?
                                                    <span style={{color: color._PURPLE}}>Chuyển SD</span>
                                                : 
                                                <span style={{color: common.statusOrderHistory({
                                                        ...item,
                                                        orderStatus: item.status
                                                    }).color}}>{common.statusOrderHistory({
                                                        ...item,
                                                        orderStatus: item.status
                                                    }).status}
                                                </span>
                                            }
                                            
                                        </Col>
                                    </Row>
                                    <div className="borderBottom"/>
                                </div>
                            )
                        }) : null}
                        <div className="footerTotal">
                            <Row className="p-top10">
                                <Col span={18} className="label" style={{textAlign: 'right', fontWeight: 600}}>
                                    SL khớp
                                </Col>
                                <Col span={3} className="total" style={{textAlign: 'right'}}>
                                    {common.convertTextDecimal(dataMaster.totalMatchedQuantity)}
                                </Col>
                                <Col span={3}/>
                            </Row>
                            <Row className="p-top10">
                                <Col span={18} className="label" style={{textAlign: 'right', fontWeight: 600}}>
                                    GT khớp lệnh
                                </Col>
                                <Col span={3} className="total" style={{textAlign: 'right'}}>
                                    {common.convertTextDecimal(dataMaster.totalMatchedValue)}
                                </Col>
                                <Col span={3}/>
                            </Row>
                            <Row className="p-top5">
                                <Col span={18} className="label" style={{textAlign: 'right', fontWeight: 600, color: color._RED_VCSC}}>
                                    SL chưa khớp
                                </Col>
                                <Col span={3} className="total" style={{textAlign: 'right', color: color._RED_VCSC}}>
                                    {common.convertTextDecimal(dataMaster.totalUnmatchedQuantity)}
                                </Col>
                                {
                                    dataMaster.totalUnmatchedQuantity > 0 && dataMaster.setAgain === 0 ? 
                                    <Col span={3} style={{textAlign: 'center'}}>
                                        <button className="btnReOrder" onClick={()=> this.onReOrder(data)}>ĐẶT LẠI</button>
                                    </Col>
                                    : null
                                }
                            </Row>
                        </div>
                    </div>
                </div>
            </Loading>
        )
    }
}

class History extends Component{
    constructor(props){
        super(props);
        this.state = {
            isChooses: [0],
            fromDate: moment(new Date(new Date(newDate).setMonth(newDate.getMonth()-1)), dateFormat),
            toDate: moment(new Date(), dateFormat),
            accountInfo: JSON.parse(localStorage.getItem('accountInfoKey')),
            isLoading: false,
            isOpenInput: null,
            dataIndexInput: {},
            lstHistory: [],
            sellBuyType: null,
            typeTrade: null,
            indexPortfolio: null,
            isReloadAll: true
        }
    }

    componentDidUpdate(prev){
        if(this.props.subNumberChange && prev.subNumberChange !== this.props.subNumberChange){
            this.loadData();
        }
    }

    componentDidMount(){
        this.loadData();
    }

    componentWillUnmount(){
        this.props.dispatch({
            type: 'INDEX_ID_IN_UPDATE',
            data: null
        });
        this.setState({isReloadAll: true});
    }

    loadData = async()=>{
        try {
            const {
                fromDate,
                toDate,
                // sellBuyType,
                typeTrade,
                indexPortfolio,
                isReloadAll
            } = this.state;
            this.setState({isLoading: true});
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            await this.props.getHistory({
                fromDate: fromDate || new Date().toISOString(),
                toDate: toDate || new Date().toISOString(),
                subNumber: obj ? obj.SUB_NUMBER : '00',
                indexsId: indexPortfolio === 'Tất cả' ? null : indexPortfolio,
                // typeCommand: sellBuyType === 'Tất cả' ? null : sellBuyType,
                typeTrade: typeTrade === 'Tất cả' ? null : typeTrade, 
            });
            if(isReloadAll){
                this.checkIndexInUpdate();
            }
            this.setState({isLoading: false});

        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    loadDataOrderHistory = async(date)=>{
        const {
            accountInfo
        } = this.state;
        try {
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            // '2020-05-22T10:00:00.000Z'
            let fromDate = common.dateToYYYYMMDD(new Date(date));
            this.setState({isLoading: true});
            const res = await this.props.getEquityOrderHistory({
                accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                subNumber: obj ? obj.SUB_NUMBER : '00',
                fetchCount: 100,
                fromDate: fromDate
            });
            let lstHis = [];
            if(res.type === 'EQUITY_ORDER.HISTORY'){
                if(res.data){
                    lstHis = this.handleArrayGroup(res.data);
                }
            }
            this.setState({isLoading: false});
            return lstHis;
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    handleArrayGroup = (data)=>{
        try {
            let lstTmp = data;
            //Group array the same orderNumber
            lstTmp = Array.from(lstTmp.reduce((m, item) => 
                m.set(item.orderNumber, [...(m.get(item.orderNumber) || []), item]), new Map()
            ), ([orderNumber, lstChild]) => ({orderNumber, lstChild})
            );
            let lstHis = [];
            if(lstTmp.length > 0){
                lstHis = lstTmp.map((item)=>{
                    let obj = item.lstChild;
                    let totalUnmatchedQuantity = 0;
                    let totalUnmatchedPrice = 0;
                    if(obj.length > 0){
                        totalUnmatchedQuantity  = obj.reduce(function(accumulator, currentValue) {
                            return accumulator + currentValue.matchedQuantity || 0;
                        }, 0);
                        totalUnmatchedPrice = obj.reduce(function(accumulator, currentValue) {
                            return accumulator + currentValue.matchedPrice*currentValue.matchedQuantity;
                        }, 0);
                    }
                    let objMaster = {
                        ...obj[0],
                        matchedQuantity: totalUnmatchedQuantity,
                        matchedPrice: totalUnmatchedPrice/totalUnmatchedQuantity || 0
                    }
                    return{
                        ...item,
                        ...objMaster || {}
                    }
                });
            }
            return lstHis;
        } catch (error) {
            
        }
    }

    onCheckPortfolioInHistory = (item, lstOrderHistory)=>{
        try {
            let dataCommand = item.command;
            let dataMaster = [];
            if(dataCommand.length > 0){
                dataMaster = dataCommand.map((itemCommand)=>{
                    let data = itemCommand.data;
                    let itemDataMaster = data;
                    if(data.length > 0){
                        itemDataMaster = data.map((itemData)=>{
                            let idx = lstOrderHistory.findIndex(item => parseInt(item.orderNumber) === itemData.code);
                            if(idx > -1){
                                return {
                                    ...itemData,
                                    matchedPrice: lstOrderHistory[idx].matchedPrice,
                                    matchedQuantity: lstOrderHistory[idx].matchedQuantity,
                                    orderStatus: lstOrderHistory[idx].orderStatus,
                                    unmatchedQuantity: lstOrderHistory[idx].unmatchedQuantity,
                                    // lstChild: lstOrderHistory[idx].lstChild,
                                }
                            }
                            return itemData;
                        });
                    }
                    return {
                        ...itemCommand,
                        data: itemDataMaster
                    }
                })
                // console.log(dataMaster);
                return dataMaster;
            }
        } catch (error) {
            
        }
    }

    _onReloadIndexs = (item) => (e)=>{
        try {
            e.stopPropagation(); //stop action
            this._onReloadIndexsAction(item);
        } catch (error) {
            
        }
    }

    _onReloadIndexsAction = async(item)=>{
        try {
            //Kiểm tra các lệnh trong lịch sử và update lại
            let dataGroup = await this.loadDataOrderHistory(common.dateDDMMYYYYtoISO(item.createDate));
            let arrData = this.onCheckPortfolioInHistory(item, dataGroup);
            let subNumber = '00';
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            if (obj) {
                if(obj.SUB_NUMBER){
                    subNumber = obj.SUB_NUMBER;
                }
            }
            this.setState({isLoading: true});
            const res = await this.props.getHistoryIndexTime({
                subNumber: subNumber,
                arrCommand: JSON.stringify(arrData),
                fromDate: common.dateDDMMYYYYtoISO(item.createDate)
            });
            if(res.type === 'HISTORY.INDEX_TIME'){
                this.loadData();
            }
            this.setState({isLoading: false});
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    checkIndexInUpdate = ()=>{
        try {
            const valueIndex = this.props.indexIdInUpdate;
            const data = Object.keys(this.props.lstHistory).length > 0 ? this.props.lstHistory.history : [];
            if(valueIndex){
                if(data.length > 0){
                    for(let i = 0; i < data.length; i++){
                        if(data[i].command.length > 0){
                            for(let j = 0; j < data[i].command.length; j++){
                                let arrData = data[i].command;
                                if(arrData.length > 0){
                                    let idx = arrData.findIndex(item => item.indexsId === valueIndex);
                                    if(idx > -1){
                                        this.setState({isChooses: [i], isOpenInput: j, dataIndexInput: data[i].command[j].data});
                                    }
                                }
                            }
                        }
                    }
                }
                //reload all time have flag
                this.onReloadAllIndexs();
            }
        } catch (error) {
            
        }
    }

    onReloadAllIndexs = async()=>{
        try {
            this.setState({isReloadAll: false});
            const lstIndexs = Object.keys(this.props.lstHistory).length > 0 ? this.props.lstHistory.history : [];
            if(lstIndexs.length > 0){
                let indexsToReload = lstIndexs.filter(item => item.isRefresh === true);
                for(let i = 0; i < indexsToReload.length; i++){
                    this._onReloadIndexsAction(indexsToReload[i]);
                }
            }
        } catch (error) {
            
        }
    }

    updateInputDate = name => async(value)=>{
        await this.setState({[name]: value});
        this.loadData();
    }

    updateSelectValue = name => async (value)=>{
        await this.setState({[name]: value});
        this.loadData();
    }

    openCollapseFirst = (idx)=>{
        const {
            isChooses
        } = this.state;

        if(isChooses.includes(idx) === true){
            let dataNew = isChooses.filter(item => item !== idx)
            this.setState({isChooses: dataNew});
        }else{
            this.setState({isChooses: [...isChooses, idx]});
        }
    }

    disabledDate = (current)=> {
        let d = moment(this.state.fromDate).add(-1, 'day');
        return current && current < d.endOf('day');
    }

    render(){
        const{
            isChooses,
            fromDate,
            toDate,
            isLoading,
            isOpenInput,
            dataIndexInput
        } = this.state;

        const data = Object.keys(this.props.lstHistory).length > 0 ? this.props.lstHistory.history : [];
        let dataListName = Object.keys(this.props.lstHistory).length > 0 ? this.props.lstHistory.indexInvestingList : [];
        if(dataListName.length > 0){
            dataListName = [{indexsId: "Tất cả", indexsName: "Tất cả"}, ...dataListName]
        };

        return(
            <Loading isLoading={isLoading}>
                <div className={rootMain}>
                    <div className="rootHeader">
                        <div className="title p-top10">
                            Lịch sử lệnh
                        </div>
                        <div className="p-top10">
                            <div className="left">
                                <DatePicker 
                                    className="datePicker" 
                                    onChange={this.updateInputDate('fromDate')} 
                                    format={dateFormat} 
                                    value={fromDate}
                                    popupStyle={{backgroundColor: 'red'}}
                                />
                                <span style={{width: '1em', display: 'inline-flex'}}></span>
                                <DatePicker 
                                    className="datePicker" 
                                    disabledDate={this.disabledDate} 
                                    onChange={this.updateInputDate('toDate')} 
                                    format={dateFormat} 
                                    value={toDate}
                                />
                            </div>
                            <div className="right">
                                <Select
                                    className="customSelectOrder"
                                    showSearch
                                    onChange={this.updateSelectValue('indexPortfolio')}
                                    optionFilterProp="children"
                                    placeholder="Tất cả danh mục"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        dataListName.length > 0 ?
                                            dataListName.map((item, idx)=>{
                                                return(
                                                    <Option value={item.indexsId} key={idx}>
                                                        {item.indexsName}
                                                    </Option>
                                                )
                                            })
                                        : null
                                    }
                                </Select>&nbsp;&nbsp;

                                {/* <Select
                                    className="customSelectOrder"
                                    showSearch
                                    onChange={this.updateSelectValue('sellBuyType')}
                                    optionFilterProp="children"
                                    placeholder="Tất cả lệnh"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Option value={"Tất cả"}>Tất cả</Option>
                                    <Option value={"BUY"}>Mua</Option>
                                    <Option value={"SELL"}>Bán</Option>
                                </Select>&nbsp;&nbsp; */}

                                <Select
                                    className="customSelectOrder"
                                    showSearch
                                    placeholder="Tất cả loại danh mục"
                                    onChange={this.updateSelectValue('typeTrade')}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Option value="Tất cả">Tất cả loại danh mục</Option>
                                    <Option value="DAUTUBANDAU">Đầu tư ban đầu</Option>
                                    <Option value="DAUTUTHEM">Đầu tư thêm</Option>
                                    <Option value="TAICANBANGDANHMUC">Tái cân bằng danh mục</Option>
                                    <Option value="BAN">Bán</Option>
                                </Select>
                            </div>
                            <div className="clearBoth"></div>
                        </div>
                    </div>
                    <div className="rootBody">
                        <div className="itemHistory p-top20">
                            <div className="left">
                                <div className="titleHeader">
                                    NGÀY GD
                                </div>
                            </div>
                            <div className="right">
                                <div className="titleHeader">
                                    GIÁ TRỊ ĐẶT LỆNH
                                </div>
                            </div>
                            <div className="clearBoth"></div>
                        </div>
                        {data.length > 0 ? data.map((item, idx)=>{
                            let isCheck = false;
                            if(isChooses.includes(idx) === true){
                                isCheck = true;
                            }
                            return(
                                <div key={idx} className={idx === 0 ? 'p-top10' : "p-top15"}>
                                    <div className="itemHistory" onClick={()=> this.openCollapseFirst(idx)}>
                                        <div className="left">
                                            <div className="main">
                                                <span className="iconDown">
                                                    {isCheck ? <CaretUpOutlined style={{color: color._BLUE_VCSC}}/> : <CaretDownOutlined />}
                                                </span>&nbsp;&nbsp;
                                                <span className={`title ${isCheck ? 'isActive' : null}`}>
                                                    {common.convertDDMMYYYY(item.createDate)}
                                                </span>&nbsp;&nbsp;&nbsp;
                                                <span className="iconDown">
                                                    {item.isRefresh ? <SyncOutlined className="isRefresh" onClick={this._onReloadIndexs(item)}/> : null}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="right">
                                            <div className="label">
                                                {common.convertTextDecimal(item.totalValue)}
                                            </div>
                                        </div>
                                        <div className="clearBoth p-top10"></div>
                                    </div>
                                    {isCheck ? 
                                        <div>
                                            <CollapseFirst 
                                                data={item.command || []}
                                                lstIndexTime={this.props.lstIndexTime}
                                                indexsId={item.id}
                                                _isOpenInput={isOpenInput}
                                                _dataIndexInput={dataIndexInput}
                                                dispatch={this.props.dispatch}
                                            /> 
                                            <div className="clearBoth p-top20"></div>
                                        </div>    
                                    : null}
                                    <div style={{borderBottom: `1px solid ${color._STROKE}`}}/>
                                </div>
                            )
                        }) : null}
                    </div>
                </div>
            </Loading>
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstEquityHistory: state.portFolio['EQUITY_ORDER.HISTORY'],
        lstHistory: state.portFolio['HISTORY.LIST'],
        lstIndexTime: state.portFolio['HISTORY.INDEX_TIME'],
        indexIdInUpdate: state.portFolio['INDEX_ID_IN_UPDATE']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getEquityOrderHistory: (data)=> dispatch(getEquityOrderHistory(data)),
        getHistory: (data)=> dispatch(getHistory(data)),
        getHistoryIndexTime: (data)=> dispatch(getHistoryIndexTime(data)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (History);