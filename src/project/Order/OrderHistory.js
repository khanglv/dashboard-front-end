import React, {Component} from 'react';
import {Select, Col, Row, Table, Tabs, Tag, Button, Popover } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

import DialogEditHistory from './DialogEditHistory';
import Confirm from '../../components/Dialog/Confirm';
import OrderHistoryStop from './OrderHistoryStop';
import OrderHistoryAdvance from './OrderHistoryAdvance';
import AccountBalance from './AccountBalance';
import HistoryOrderTime from './HistoryOrderTime';

import {connect} from 'react-redux';
import {
    getEquityOrderHistory, 
    equityOrderCancel, 
    equityOrderModify, 
    equityOrder
} from '../../stores/actions/core/equityOrderAction';
import {indexLogs} from '../../stores/actions/investor/indexLogs';
import {indexUpdateBackground} from '../../api/api';

import {css} from 'emotion';
import * as common from '../../components/Common/Common';

const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
// const windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

const { Option } = Select;
const { TabPane } = Tabs;

let color = window['colors'];

const rootMain = css`
    position: relative;
    .refreshIcon{
        position: absolute;
        right: 20px;
        top: 1em;
        cursor: pointer;
        z-index: 100;
        &:hover{
            color: #00377b;
        }
        @media only screen and (max-width: 768px) {
            top: 5em;
        }
    }
    .datePicker{
        .ant-picker-input{
            input{
                font-size: 12px;
            }
        }
        top: 5px;
        border: 1px solid ${color._STROKE};
        border-radius: 0.3em;
        color: ${color._BLACK};
        font-weight: 500;
        svg{
            color: ${color._BLACK};
        }
    }
    .btnCancel{
        top: 5px;
        background-color: ${color._RED_VCSC}!important;
        color: ${color._WHITE}!important;
        padding: 0 1.5em;
        height: auto;
        border-radius: 0.4em;
        border: 1px solid ${color._RED_VCSC}!important;
        &:hover{
            background-color: ${color._RED_VCSC_MY_HOVER}!important;
            border: 1px solid ${color._RED_VCSC_MY_HOVER}!important;
            color: ${color._WHITE};
        }
    }
`

const customSelectOrder = css`
    width: 100%;
	top: 5px;
	color: #333333;
	font-weight: 500;
	font-size: 13px;
    .ant-select-selector{
        border: 1px solid ${color._STROKE}!important;
        border-radius: 4px!important;
    }
    &.HeaderOrder{
        width: 25rem;
        top: 0;
    }
    .ant-select-selection-item, .ant-select-selection-placeholder{
        font-size: 13px;
    }
`

const headerTabTrading = css`
    .ant-tabs-nav-wrap{
        padding: 0 20px;
    }
    .ant-tabs-nav-animated{
        font-size: 14px;
        color: #666;
        font-weight: 600;
        padding-top: 5px;
        height: 40px;
    }
    .ant-tabs-tab-active{
        color: #00377b!important;
        font-weight: 600!important;
    }
    .ant-tabs-tab{
        &:hover{
            color: #00377b!important;
        }
    }
    .ant-tabs-ink-bar{
        background-color: #00377b;
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
                /* background: red;  */
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
                    background-color: #f2f2f2;
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
        .ant-checkbox-checked .ant-checkbox-inner{
            background-color: #00377b;
            border-color: #00377b;
        }

        .ant-checkbox-inner::after{
            background-color: #00377b;
        }
        @media only screen and (max-width: 992px) {
            .ant-table{
                font-size: 12px;
            }
        }
        .hide {
            display: none;
        }
        .available{
            display: inline-block!important;
            position: absolute;
            top: 0.5em
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
        .actionOrder{
            width: 5em;
            @media only screen and (max-width: 992px) {
                width: 4em;
            }
        }
    }
`

const cssPopupHover = css`
    border-radius: 0.6em;
    font-size: 13px;
    .ant-popover-inner-content{
        padding: 0 1em 5px 1em;
    }
    .classChildren{
        .left{
            float: left;
            width: 40%;
            .label{
                font-weight: 500;
                color: ${color._BLACK};
                text-align: right;
                font-size: 13px;
            }
        }
        .right{
            float: right;
            width: 60%;
            .label{
                font-weight: 500;
                color: ${color._BLACK};
                text-align: right;
                font-size: 13px;
            }
        }
        .clearBoth{
            clear: both;
        }
    }
    .lastItem{
        top: -3em;
        right: 0;
    }
    &:hover{
        .classChildren{
            display: block;
            z-index: 1000;
        }
    }
`

function HoverUnmatched(props){
    let lstChild = props.lstChild || [];
    return(
        <div className="classChildren">
            {lstChild.length > 0 ? lstChild.map((item, idx)=>{
                return(
                    <div key={idx} style={{paddingTop: 5}}>
                        <div className="left">
                            <div className="label">
                                {common.convertTextDecimal(item.matchedQuantity)}
                            </div>
                        </div>
                        <div className="right">
                            <div className="label">
                                {common.convertTextDecimal(item.matchedPrice)}  
                            </div>
                        </div>
                        <div className="clearBoth" />
                    </div>
                )
            }) : null}
        </div>
    )
}

const titleUnmatched = (
    <div>
        <div style={{float: 'left', width: '40%', fontSize: 13}}>
            <div style={{fontWeight: 600, color: color._GREY_999, textAlign: 'right'}}>
                SL Khớp
            </div>
        </div>
        <div style={{float: 'right', width: '60%', fontSize: 13}}>
            <div className="label" style={{fontWeight: 600, color: color._GREY_999, textAlign: 'right'}}>
                SL Khớp
            </div>
        </div>
        <div style={{clear: 'both'}}></div>
    </div>
)

class OrderHistory extends Component{
    constructor(props){
        super(props);
        this.state = {
            accountInfo: JSON.parse(localStorage.getItem('accountInfoKey')),
            currentKey: null,
            intervalValue: null,
            openDiaLog: false,
            stockCode: null,
            sellBuyType: 'Tất cả',
            dataOrderHistory: [],
            isLoading: false,
            selectedRowKeys: [],
            dataCancelMaster: [],
            isOpenConfirm: false,
            isTabSelect: 1,
            isReloadHistoryStop: false,
            isReloadAccountBalance: false,
            lstHistory: []
        }

        props.componentEvent.on("changeSubNumber", (subNumber)=>{
            this.loadDataOrderHistory();
        });

        this.props_master = this.props;
    }

    componentDidMount(){
        this.loadDataOrderHistory();
        // this.setIntervalDataHistory();
    }

    async componentDidUpdate(prev){
        if(this.props.isReloadOrderHistory){
            this.loadDataOrderHistory();
            this.props.reloadedComponent();
        }
    }

    loadDataOrderHistory = async()=>{
        const {
            accountInfo,
            stockCode,
            sellBuyType,
            isTabSelect
        } = this.state;
        try {
            if(parseInt(isTabSelect) === 1){
                let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
                // '2020-05-22T10:00:00.000Z'
                let fromDate = common.dateToYYYYMMDD(new Date());
                this.setState({isLoading: true});
                const res = await this.props.getEquityOrderHistory({
                    accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                    subNumber: obj ? obj.SUB_NUMBER : '00',
                    stockCode: stockCode === 'Tất cả' ? null : stockCode,
                    sellBuyType: sellBuyType === 'Tất cả' ? null : sellBuyType,
                    lastOrderDate: null,
                    lastBranchCode: null,
                    lastOrderNumber: null,
                    lastMatchPrice: null,
                    fetchCount: 40,
                    fromDate: fromDate
                });
                if(res.type === 'EQUITY_ORDER.HISTORY'){
                    let lstTmp = res.data;
                    
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
                    this.setState({lstHistory: lstHis});
                    try { //Sau khi reload thì refesh lại history
                        await indexUpdateBackground({arrData: JSON.stringify(lstHis)});
                    } catch (error) {
                        
                    }
                }
                this.setState({isLoading: false, openDiaLog: false});
            }
            if(parseInt(isTabSelect) === 2){
                this.setState({isReloadHistoryStop: true});
            }
            if(parseInt(isTabSelect) === 3){
                this.setState({isReloadHistoryAdvance: true});
            }
            if(parseInt(isTabSelect) === 4){
                this.setState({isReloadAccountBalance: true});
            }
            if(parseInt(isTabSelect) === 5){
                this.setState({isReloadOrderTime: true});
            }
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    _stopReloadOrderTimeComponent = ()=>{
        this.setState({isReloadOrderTime: false});
    }

    _onStopLoadHistoryStop = ()=>{
        this.setState({isReloadHistoryStop: false});
    }

    _onStopLoadHistoryAdvance = ()=>{
        this.setState({isReloadHistoryAdvance: false});
    }

    _onStopLoadAccountBalance = ()=>{
        this.setState({isReloadAccountBalance: false});
    }

    updateSelectValue = name => async(event)=>{
        await this.setState({[name]: event});
        this.loadDataOrderHistory();
    }

    confirmCancelOrder = async(data = {}) => {
        const {
            dataCancelMaster
        } = this.state;

        if(Object.keys(data).length > 0 && dataCancelMaster.length >= 0){
            await this.setState({dataCancelMaster: [data], selectedRowKeys: [data.key]});
        }
        this.setState({isOpenConfirm: true});
        // try {
        //     const {
        //         dataCancelMaster
        //     } = this.state;
        //     if(dataCancelMaster.length > 0){
        //         this.setState({isOpenConfirm: true});
        //     }else{
        //         this.setState({isLoading: true});
        //         const res = await this.actionOrderCancelApi(data);
        //         this.setState({isLoading: false});
        //         if(res.type === 'EQUITY_ORDER.CANCEL'){
        //             this.setState({currentKey: ''});
        //             this.loadDataOrderHistory();
        //         }
        //     }
        // } catch (error) {
        //     this.setState({isLoading: false});
        // }
    }

    actionOrderCancelApi = async (data) => {
        return await this.props.equityOrderCancel({
            accountNumber: data.accountNumber,
            subNumber: data.subNumber,
            orderNumber: data.orderNumber,
            branchCode: data.branchCode
        });
    }

    _onActionOk = async()=>{
        const {
            dataCancelMaster
        } = this.state;

        try {
            if(dataCancelMaster.length > 0){
                this.setState({isLoadingBtn: true});
                let count = 0;
                for(let i = 0; i < dataCancelMaster.length; i ++){
                    let res = await this.actionOrderCancelApi(dataCancelMaster[i]);
                    if(res.type === 'EQUITY_ORDER.CANCEL'){
                        count = count + 1;
                        try {
                            this.props.indexLogs({...dataCancelMaster[i], type: 'normal'});
                        } catch (error) {
                            
                        }
                    }
                }
                if(count > 0){
                    common.notify("success", `Hủy ${count}/${dataCancelMaster.length} lệnh thành công!!!`);
                    this.setState({selectedRowKeys: []});
                }
                this.setState({currentKey: '', isLoadingBtn: false, dataCancelMaster: [], isOpenConfirm: false});
                this.loadDataOrderHistory();
            }
        } catch (error) {
            this.setState({isLoadingBtn: false});
        }
    }

    onOrderModify = async(data)=>{
        try {
            const accountBank = this.props.bankAccount.length > 0 ? this.props.bankAccount[0] : [];
            this.setState({isLoading: true});
            const objData = {
                accountNumber: data.accountNumber,
                subNumber: data.subNumber,
                orderQuantity: data.unmatchedQuantity,
                orderNumber: data.orderNumber,
                branchCode: data.branchCode,
                orderPrice: data.priceEdit,
                bankCode: accountBank.bankCode || '',
                bankName: accountBank.bankName || '',
                bankAccount: accountBank.bankAccount || '',
                sellBuyType: data.sellBuyType,
                orderType: data.orderType,
                marketType: data.exchange
            }

            const res = await this.props.equityOrderModify(objData);
            if(res.type === 'EQUITY_ORDER.MODIFY'){
                common.notify("success", "Sửa lệnh thành công!!!");
                this.loadDataOrderHistory();
                this._onCloseDialog();
                try {
                    this.props.indexLogs({...objData, type: 'normal'});
                } catch (error) {
                    
                }
            }else{
                this.loadDataOrderHistory();
            }
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    actionOrderApi = async(data) => {
        const {
            accountInfo
        } = this.state;

        try {
            const accountBank = this.props.bankAccount.length > 0 ? this.props.bankAccount[0] : [];
            const objData = {
                "accountNumber": accountInfo.userInfo.accounts[0].accountNumber,
                "subNumber": data.subNumber,
                "orderQuantity": data.unmatchedQuantity,
                "orderPrice": data.priceEdit,
                "stockCode": data.stockCode,
                "bankCode": accountBank.bankCode || '',
                "bankName": accountBank.bankName || '',
                "bankAccount": accountBank.bankAccount || '',
                "sellBuyType": data.sellBuyType,
                "orderType": data.orderType,
                "securitiesType": "STOCK"
            }
            const res = await this.props.equityOrder(objData);
            if(res.type === 'EQUITY_ORDER.LIST'){
                common.notify("success", `Đặt ${data.sellBuyType === "BUY" ? 'mua' : 'bán'} thành công, vui lòng chờ khớp lệnh!!!`);
                this.loadDataOrderHistory();
                try {
                    this.props.indexLogs({...objData, type: 'normal'});
                } catch (error) {
                    
                }
            }else{
                this.setState({isLoading: false});
            }
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    _onActionOrderModify = async(data)=>{
        try {
            this.setState({isLoading: true});
            if(data.exchange === 'HOSE'){ //Sàn HOSE thì khi edit lệnh default hủy lênh sau đó thực hiện đặt 1 lệnh mới
                const res = await this.actionOrderCancelApi(data);
                if(res.type === 'EQUITY_ORDER.CANCEL'){
                    this.setState({isOpenConfirm: false});
                    try {
                        this.props.indexLogs({...data, type: 'normal'});
                    } catch (error) {
                        
                    }
                    common.notify("success", "Hủy lệnh thành công!!!");
                    await this.actionOrderApi(data);
                }
            }else{
                this.onOrderModify(data);
            }
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    // setIntervalDataHistory = ()=>{
    //     const value = setInterval(() => {
    //         this.loadDataOrderHistory();
    //     }, 15000);
    //     this.setState({intervalValue: value});
    // }

    cancelConfirm = ()=>{
        this.setState({currentKey: ''});
    }

    setAvailable = (key)=>{
        this.setState({currentKey: key});
    }

    _onCloseDialog = ()=>{
        this.setState({openDiaLog: false});
    }

    setEditOrderHistory = (data)=>{
        this.changeStockCodeShortcut(data.stockCode);
        let checkExchange = this._isCheckExchange(data.stockCode, this.props.lstStock);
        this.setState({openDiaLog: true, selectedRowKeys: [], dataCancelMaster: [], dataOrderHistory: {...data, exchange: checkExchange}});
    }

    _isCheckExchange = (stockCode, lstStock)=>{
        const idx = lstStock.findIndex(item => item.s === stockCode);
        if(idx > -1){
            return lstStock[idx].m;
        }
        return null;
    }

    _onCloseConfirm = ()=>{
        this.setState({isOpenConfirm: false});
    }

    changeStockCodeShortcut = (value)=>{
        this.props.changeStockCodeShortcut(value);
    }

    changeQuantitySell = (value)=>{
        // this.props.changeQuantitySell(value);
        this.props_master.componentEvent.fire("changeQuantitySell", true, {quantity: value});
    }

    onChangeTab = async(key)=>{
        await this.setState({isTabSelect: key});
        if(parseInt(key) === 1){
            this.loadDataOrderHistory();
        }
    }

    render(){
        const {
            currentKey,
            openDiaLog,
            isLoading,
            dataOrderHistory,
            selectedRowKeys,
            dataCancelMaster,
            isOpenConfirm,
            isReloadHistoryStop,
            isReloadHistoryAdvance,
            isReloadAccountBalance,
            isReloadOrderTime,
            isLoadingBtn,
            lstHistory
        } = this.state;

        const columns = [
            {
                title: 'Thời gian',
                dataIndex: 'orderTime',
                render: (id, record) => {
                    let isTimeValid = common.compareTimeTradeValid();
                    return(
                        <div>
                            <div>{common.stringToTimeHHMMSS(record.orderTime)}</div>
                            {(record.unmatchedQuantity > 0 && isTimeValid && record.orderPrice > 0) ? 
                            <span className={`hide ${currentKey === record.key ? 'available' : ''}`}>
                                <img 
                                    style={{width: '1.5em', cursor: 'pointer'}} 
                                    alt="" src="icon/ic_edit.svg"
                                    onClick={()=> this.setEditOrderHistory(record)}
                                />&nbsp;&nbsp;
                                <span onClick={()=> this.confirmCancelOrder(record)}>
                                    <img style={{width: '1.5em', cursor: 'pointer'}} alt="" src="icon/ic_delete.svg"/>
                                </span>
                                {/* <Popconfirm 
                                    title="Xác nhận hủy lệnh này ?" 
                                    icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                                    okText="Đồng ý" 
                                    cancelText="Hủy bỏ"
                                    onConfirm={()=> this.confirmCancelOrder(record)}
                                    onCancel={this.cancelConfirm}
                                    visible={currentKey === record.key}
                                >
                                    <span onClick={()=> this.setAvailable(record.key)}>
                                        <img style={{width: '1.5em', cursor: 'pointer'}} alt="" src="icon/ic_delete.svg"/>
                                    </span>
                                </Popconfirm> */}
                            </span> : null}
                        </div>
                        
                    )
                }
            },
            {
                title: 'Mã CP',
                dataIndex: 'stockCode',
                render: stockCode =>{
                    return(
                        <div style={{fontWeight: 600, cursor: 'pointer'}} onClick={()=>this.changeStockCodeShortcut(stockCode)}>{stockCode}</div>
                    )
                }
            },
            {
                title: 'Mua, Bán',
                dataIndex: 'sellBuyType',
                width: 80,
                render: (i, record) => {
                    return(
                        <Tag color={(record.unmatchedQuantity === 0 && record.orderStatus !== 'FULL_FILLED') ? '#e1e3ea' : (record.sellBuyType === 'BUY' ? '#c6dfff' : '#ffd7d8')}>
                            <span 
                                style={{color: (record.unmatchedQuantity === 0 && record.orderStatus !== 'FULL_FILLED') ? '#999999' : (record.sellBuyType === 'BUY' ? '#00377b' : '#c42127'), fontWeight: 600}}
                            >
                                {record.sellBuyType === 'BUY' ? ' Mua' : 'Bán'}
                            </span>
                        </Tag>
                    )
                }
            },
            {
                title: 'SL Đặt',
                dataIndex: 'orderQuantity',
                align: 'right',
                render: orderQuantity => {
                    return(
                        <div>{common.convertTextDecimal(orderQuantity)}</div>
                    )
                }
            },
            {
                title: 'Giá Đặt',
                dataIndex: 'orderPrice',
                align: 'right',
                render: (i, record) => {
                    return(
                        <div>{record.orderPrice > 0 ? common.convertTextDecimal(record.orderPrice || 0) : record.orderType}</div>
                    )
                }
            },
            {
                title: 'SL Khớp',
                dataIndex: 'matchedQuantity',
                align: 'right',
                render: (i, record) => {
                    return(
                        record.lstChild.length > 1 ? <Popover 
                            placement="topRight"
                            overlayClassName={cssPopupHover}
                            content={<HoverUnmatched lstChild={record.lstChild}/>} 
                            title={titleUnmatched}
                        >
                            <div>{common.convertTextDecimal(record.matchedQuantity)}</div>
                        </Popover> 
                        : <div>{common.convertTextDecimal(record.matchedQuantity)}</div>
                        // <div className="isMaster">
                        //     {record.lstChild.length > 1 ? <HoverUnmatched lstChild={record.lstChild}/> : null}
                        //     <div>{common.convertTextDecimal(record.matchedQuantity)}</div>
                        // </div>
                    )
                }
            },
            {
                title: 'Giá Khớp',
                dataIndex: 'matchedPrice',
                align: 'right',
                render: (i, record) => {
                    return(
                        record.lstChild.length > 1 ? <Popover 
                            placement="topRight"
                            overlayClassName={cssPopupHover}
                            content={<HoverUnmatched lstChild={record.lstChild}/>} 
                            title={titleUnmatched}
                        >
                            <div>{common.convertTextDecimal(record.matchedPrice)}</div>
                        </Popover>
                        : <div>{common.convertTextDecimal(record.matchedPrice)}</div>
                        // <div className="isMaster">
                        //     {record.lstChild.length > 1 ? <HoverUnmatched lstChild={record.lstChild}/> : null}
                        //     <div>{common.convertTextDecimal(record.matchedPrice)}</div>
                        // </div>
                    )
                }
            },
            {
                title: 'Chờ khớp',
                dataIndex: 'unmatchedQuantity',
                align: 'right',
                render: unmatchedQuantity => {
                    return(
                        <div>{common.convertTextDecimal(unmatchedQuantity)}</div>
                    )
                }
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                render: (tmp, record)=>{
                    let returnStatus = common.statusOrderHistory({orderStatus: record.orderStatus, unmatchedQuantity: record.unmatchedQuantity});
                    return(
                        <div style={{color: returnStatus.color, fontWeight: 500}}>{returnStatus.status}</div>
                    )
                }
            },
        ];

        const dataTable = lstHistory.length > 0 ?
            lstHistory.map((item, idx)=>{
                return{
                    ...item,
                    key: idx
                }
            })
        : [];

        // const dataTable = this.props.lstEquityHistory.length > 0 ?
        //     this.props.lstEquityHistory.map((item, idx)=>{
        //         return{
        //             ...item,
        //             key: idx
        //         }
        //     })
        // : [];

        const lstStock = [{key: 'Tất cả', s: 'Tất cả'}, ...this.props.lstStock]

        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({dataCancelMaster: selectedRows, selectedRowKeys: selectedRowKeys});
            },
            getCheckboxProps: record => ({
                disabled: record.unmatchedQuantity === 0 || record.orderPrice === 0,
                key: record.key,
            }),
            columnWidth: 40
        };

        return(
            <div className={rootMain}>
                <Confirm 
                    configs={
                        {
                            isOpen: isOpenConfirm,
                            title: 'Xác nhận',
                            message: <span>Quý khách có muốn hủy <b>{dataCancelMaster.length} lệnh</b> này không?</span>,
                            isLoading: isLoadingBtn
                        }} 
                    onClose={this._onCloseConfirm}
                    onActionOk={this._onActionOk}
                />
                <DialogEditHistory 
                    data={dataOrderHistory}
                    config={{
                        isOpen: openDiaLog
                    }}
                    onClose={this._onCloseDialog}
                    onActionOrderModify={this._onActionOrderModify}
                    componentEvent={this.props.componentEvent}
                />
                <ReloadOutlined className="refreshIcon" onClick={this.loadDataOrderHistory}/>
                <Tabs 
                    defaultActiveKey="1" 
                    size="small" 
                    animated={false}
                    className={headerTabTrading}
                    onChange={this.onChangeTab}
                >
                    <TabPane tab="Số lệnh trong ngày" key="1">
                        <Row gutter={10} style={{padding: '0 20px'}}>
                            <Col xl={4} md={8} xs={8}>
                                <Select
                                    className={customSelectOrder}
                                    showSearch
                                    allowClear
                                    placeholder="Nhập mã CP"
                                    onChange={this.updateSelectValue('stockCode')}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {lstStock.length > 0 ? lstStock.map((item, idx)=>{
                                        return(
                                            <Option key={idx} value={item.s}>
                                                {item.s}
                                            </Option>
                                        )
                                    }) 
                                    : null}
                                </Select>
                            </Col>
                            <Col xl={4} md={8} xs={8}>
                                <Select
                                    className={customSelectOrder}
                                    showSearch
                                    allowClear
                                    placeholder="Tất cả lệnh"
                                    onChange={this.updateSelectValue('sellBuyType')}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Option value="Tất cả">Tất cả</Option>
                                    <Option value="BUY">Mua</Option>
                                    <Option value="SELL">Bán</Option>
                                </Select>
                            </Col>
                            
                            <Col xl={16} md={6} xs={6} style={{display: 'flex', justifyContent: 'flex-end'}}>
                            {
                                dataCancelMaster.length > 0 ? 
                                    <Button className="btnCancel" onClick={()=> this.confirmCancelOrder()}>Hủy ({dataCancelMaster.length})</Button>
                                : null
                            }
                            </Col>
                        </Row>
                        <div className="p-top20">
                            <Table
                                className="tableOrder"
                                columns={columns} 
                                dataSource={dataTable}
                                size={'small'}
                                rowSelection={rowSelection}
                                scroll={{x: windowWidth < 768 ? 800 : null, y: '34em'}}
                                pagination={false}
                                loading={isLoading}
                            />
                        </div>
                    </TabPane>
                    <TabPane tab="Lịch sử lệnh dừng" key="2">
                        <OrderHistoryStop 
                            lstStock={lstStock}
                            isReloadHistoryStop={isReloadHistoryStop}
                            onStopLoadHistoryStop={this._onStopLoadHistoryStop}
                            _changeStockCodeShortcut={this.changeStockCodeShortcut}
                        />
                    </TabPane>
                    <TabPane tab="Lịch sử lệnh đặt trước" key="3">
                        <OrderHistoryAdvance 
                            lstStock={lstStock}
                            isReloadHistoryAdvance={isReloadHistoryAdvance}
                            onStopLoadHistoryAdvance={this._onStopLoadHistoryAdvance}
                            _changeStockCodeShortcut={this.changeStockCodeShortcut}
                        />
                    </TabPane>
                    <TabPane tab="Số dư CK" key="4">
                        <AccountBalance 
                            componentEvent={this.props.componentEvent}
                            _changeStockCodeShortcut={this.changeStockCodeShortcut}
                            _changeQuantitySell={this.changeQuantitySell}
                            isReloadAccountBalance={isReloadAccountBalance}
                            onStopLoadAccountBalance={this._onStopLoadAccountBalance}
                        />
                    </TabPane>
                    <TabPane tab="Lịch sử lệnh" key="5">
                        <HistoryOrderTime 
                            componentEvent={this.props.componentEvent}
                            lstStock={lstStock}
                            isReloadOrderTime={isReloadOrderTime}
                            _changeStockCodeShortcut={this.changeStockCodeShortcut}
                            stopReloadOrderTimeComponent={this._stopReloadOrderTimeComponent}
                        />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstEquityHistory: state.indexCore['EQUITY_ORDER.HISTORY'],
        bankAccount: state.indexCore['BANK_ACCOUNT.LIST'],
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getEquityOrderHistory: (data)=> dispatch(getEquityOrderHistory(data)),
        equityOrderCancel: (data)=> dispatch(equityOrderCancel(data)),
        equityOrderModify: (data)=> dispatch(equityOrderModify(data)),
        equityOrder: (data)=> dispatch(equityOrder(data)),
        indexLogs: (data)=> dispatch(indexLogs(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (OrderHistory);
