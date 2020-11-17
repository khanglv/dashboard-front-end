import React, {Component} from 'react';
import {Select, Col, Row, List, Spin, Button, Tag, Popover, DatePicker } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';

import {connect} from 'react-redux';
import {
    getEquityOrderHistory,
    equityOrder
} from '../../stores/actions/core/equityOrderAction';

import {css} from 'emotion';
import * as common from '../../components/Common/Common';
import Loading from '../../components/Loading/Loading';

const { Option } = Select;
const dateFormat = 'DD/MM/YYYY';

let color = window['colors'];

const rootMain = css`
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
    .headerList{
        background-color: ${color._GREY_LIGHT_2};
        color: ${color._GREY_999};
        font-weight: 600;
        font-size: 12px;
        padding: 0.6em 1em;
        .right{
            text-align: right;
        }
    }
    .demo-infinite-container {
        overflow: auto;
        height: 34em;
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
        .styleListStock{
            border: 0;
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
                padding: 0.7em 12px;
                font-size: 13px;
                font-weight: 500;
                &:hover{
                    background-color: ${color._HOVER};
                    color: ${color._BLACK}
                }
                .right{
                    text-align: right;
                }
            }
        }
        .demo-loading-container {
            position: absolute;
            bottom: 2em;
            width: 100%;
            text-align: center;
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

class HistoryOrderTime extends Component{
    constructor(props){
        super(props);
        this.state = {
            accountInfo: JSON.parse(localStorage.getItem('accountInfoKey')),
            openDiaLog: false,
            stockCode: null,
            dataOrderHistory: [],
            isLoading: false,
            isLoadingFirst: false,
            isLoadMore: true,
            dataCancelMaster: [],
            lstHistory: [],
            fromDate: moment(new Date(), dateFormat),
            toDate: moment(new Date(), dateFormat),
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
        if(this.props.isReloadOrderTime){
            this.loadDataOrderHistory();
            this.props.stopReloadOrderTimeComponent();
        }
    }


    loadDataOrderHistory = async()=>{
        const {
            accountInfo,
            stockCode,
            sellBuyType,
            fromDate,
            toDate,
            orderSatus
        } = this.state;
        try {
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            // '2020-05-22T10:00:00.000Z'
            // let fromDate = common.dateToYYYYMMDD(new Date());
            this.setState({isLoading: true, isLoadMore: true, isLoadingFirst: true});
            const res = await this.props.getEquityOrderHistory({
                accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                subNumber: obj ? obj.SUB_NUMBER : '00',
                stockCode: stockCode === 'Tất cả' ? null : stockCode,
                sellBuyType: sellBuyType === 'Tất cả' ? null : sellBuyType,
                matchType: orderSatus === 'Tất cả' ? null : orderSatus,
                lastOrderDate: null,
                lastBranchCode: null,
                lastOrderNumber: null,
                lastMatchPrice: null,
                fetchCount: 100,
                fromDate: common.dateToYYYYMMDD(new Date(fromDate)),
                toDate: common.dateToYYYYMMDD(new Date(toDate))
            });
            if(res.type === 'EQUITY_ORDER.HISTORY'){
                let lstHis = [];
                if(res.data){
                    if(res.data.length < 20){
                        this.setState({isLoadMore: false});
                    }
                    lstHis = this.handleArrayGroup(res.data);
                }
                this.setState({lstHistory: lstHis});
            }
            this.setState({isLoading: false, openDiaLog: false, isLoadingFirst: false});
        } catch (error) {
            this.setState({isLoading: false, isLoadingFirst: false});
        }
    }

    loadDataOrderHistoryMore = async()=>{
        const {
            accountInfo,
            stockCode,
            sellBuyType,
            fromDate,
            toDate,
            lstHistory,
            orderSatus
        } = this.state;
        try {
            if(lstHistory.length > 0){
                let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
                let lastOrder = lstHistory[lstHistory.length-1];
                if(lastOrder){
                    this.setState({isLoading: true});
                    const res = await this.props.getEquityOrderHistory({
                        accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                        subNumber: obj ? obj.SUB_NUMBER : '00',
                        stockCode: stockCode === 'Tất cả' ? null : stockCode,
                        sellBuyType: sellBuyType === 'Tất cả' ? null : sellBuyType,
                        matchType: orderSatus === 'Tất cả' ? null : orderSatus,
                        lastOrderDate: lastOrder.orderDate,
                        lastBranchCode: lastOrder.branchCode,
                        lastOrderNumber: lastOrder.orderNumber,
                        lastMatchPrice: lastOrder.matchedPrice,
                        fetchCount: 100,
                        fromDate: common.dateToYYYYMMDD(new Date(fromDate)),
                        toDate: common.dateToYYYYMMDD(new Date(toDate))
                    });
                    if(res.type === 'EQUITY_ORDER.HISTORY'){
                        let lstHis = [];
                        if(res.data){
                            if(res.data.length < 20){
                                this.setState({isLoadMore: false});
                            }
                            lstHis = this.handleArrayGroup(res.data);
                        }
                        this.setState({lstHistory: [...lstHistory, ...lstHis]});
                    }
                    this.setState({isLoading: false, openDiaLog: false});
                }
            }
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

    changeStockCodeShortcut = (value)=>{
        this.props._changeStockCodeShortcut(value);
    }

    updateSelectValue = name => async(event)=>{
        await this.setState({[name]: event});
        this.loadDataOrderHistory();
    }

    updateInputDate = name => async(value)=>{
        const {
            fromDate
        } = this.state;
        
        if(name === 'toDate'){
            if(common.compareTwoDate(fromDate, value) === 2){
                await this.setState({fromDate: value});
            }
        }
        await this.setState({[name]: value});
        this.loadDataOrderHistory();
    }

    disabledDate = (current)=> {
        let d = moment(new Date());
        // let dStart = moment(new Date(this.state.fromDate)).add(-1, 'day');
        return current && (current > d.endOf('day'));
        // || current < dStart.endOf('day')
    }

    render(){
        const {
            dataCancelMaster,
            lstHistory,
            fromDate,
            toDate,
            isLoading,
            isLoadMore,
            isLoadingFirst
        } = this.state;

        const dataTable = lstHistory.length > 0 ?
            lstHistory.map((item, idx)=>{
                return{
                    ...item,
                    key: idx
                }
            })
        : [];

        const lstStock = [...this.props.lstStock]

        return(
            <div className={rootMain}>
                <div>
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
                        
                        <Col xl={4} md={8} xs={8}>
                            <Select
                                className={customSelectOrder}
                                showSearch
                                allowClear
                                placeholder="Tất cả"
                                onChange={this.updateSelectValue('orderSatus')}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value="Tất cả">Tất cả</Option>
                                <Option value="MATCHED">Khớp</Option>
                                <Option value="UNMATCHED">Không khớp</Option>
                            </Select>
                        </Col>
                        <Col xl={4} md={8} xs={8}>
                            <DatePicker 
                                className="datePicker" 
                                onChange={this.updateInputDate('fromDate')} 
                                format={dateFormat} 
                                value={fromDate}
                            />
                        </Col>
                        <Col xl={4} md={8} xs={8}>
                            <DatePicker 
                                className="datePicker" 
                                onChange={this.updateInputDate('toDate')} 
                                format={dateFormat} 
                                value={toDate}
                                disabledDate={this.disabledDate}
                            />
                        </Col>
                        <Col xl={4} md={6} xs={6} style={{display: 'flex', justifyContent: 'flex-end'}}>
                        {
                            dataCancelMaster.length > 0 ? 
                                <Button className="btnCancel" onClick={this.confirmCancelOrder}>Hủy ({dataCancelMaster.length})</Button>
                            : null
                        }
                        </Col>
                    </Row>
                </div>
                <Loading isLoading={isLoadingFirst}>
                    <div className="p-top20">
                        <div className="headerList">
                            <Row>
                                <Col span={5}>
                                    Thời gian
                                </Col>
                                <Col span={2}>
                                    Mã CP
                                </Col>
                                <Col span={2}>
                                    Mua/Bán
                                </Col>
                                <Col span={2} className="right">
                                    SL đặt
                                </Col>
                                <Col span={3} className="right">
                                    Giá đặt
                                </Col>
                                <Col span={3} className="right">
                                    SL Khớp
                                </Col>
                                <Col span={3} className="right">
                                    Giá Khớp
                                </Col>
                                <Col span={4} style={{paddingLeft: 18}}>
                                    Trạng thái
                                </Col>
                            </Row>
                        </div>
                        <div className="demo-infinite-container">
                            {
                                dataTable.length > 0 ? 
                                <InfiniteScroll
                                    initialLoad={false}
                                    pageStart={0}
                                    loadMore={this.loadDataOrderHistoryMore}
                                    hasMore={!isLoading && isLoadMore}
                                    useWindow={false}
                                >
                                    <List
                                        size="small"
                                        bordered
                                        dataSource={dataTable}
                                        className="styleListStock"
                                        renderItem={(item, idx) => 
                                        <List.Item className="item">
                                            <Col span={5}>
                                                {common.convertDDMMYYYY(common.splitStringDate(item.orderDate))}&nbsp;{common.stringToTimeHHMMSS(item.orderTime)}
                                            </Col>
                                            <Col span={2} style={{fontWeight: 600}}>
                                                <div style={{cursor: 'pointer'}} onClick={()=>this.changeStockCodeShortcut(item.stockCode)}>{item.stockCode}</div>
                                            </Col>
                                            <Col span={2}>
                                            <Tag color={(item.unmatchedQuantity === 0 && item.orderStatus !== 'FULL_FILLED') ? '#e1e3ea' : (item.sellBuyType === 'BUY' ? '#c6dfff' : '#ffd7d8')}>
                                                <span 
                                                    style={{color: (item.unmatchedQuantity === 0 && item.orderStatus !== 'FULL_FILLED') ? '#999999' : (item.sellBuyType === 'BUY' ? '#00377b' : '#c42127'), fontWeight: 600}}
                                                >
                                                    {item.sellBuyType === 'BUY' ? ' Mua' : 'Bán'}
                                                </span>
                                            </Tag>
                                            </Col>
                                            <Col span={2} className="right">
                                                {common.convertTextDecimal(item.orderQuantity)}
                                            </Col>
                                            <Col span={3} className="right">
                                                {item.orderPrice > 0 ? common.convertTextDecimal(item.orderPrice || 0) : item.orderType}
                                            </Col>
                                            <Col span={3} className="right">
                                                {
                                                    item.lstChild.length > 1 ? <Popover 
                                                        placement="topRight"
                                                        overlayClassName={cssPopupHover}
                                                        content={<HoverUnmatched lstChild={item.lstChild}/>} 
                                                        title={titleUnmatched}
                                                    >
                                                        <div>{common.convertTextDecimal(item.matchedQuantity)}</div>
                                                    </Popover> 
                                                    : <div>{common.convertTextDecimal(item.matchedQuantity)}</div>
                                                    }
                                                </Col>
                                            <Col span={3} className="right">
                                                {
                                                    item.lstChild.length > 1 ? <Popover 
                                                        placement="topRight"
                                                        overlayClassName={cssPopupHover}
                                                        content={<HoverUnmatched lstChild={item.lstChild}/>} 
                                                        title={titleUnmatched}
                                                    >
                                                        <div>{common.convertTextDecimal(item.matchedPrice)}</div>
                                                    </Popover>
                                                    : <div>{common.convertTextDecimal(item.matchedPrice)}</div>
                                                }
                                            </Col>
                                            <Col span={4} style={{paddingLeft: 24}}>
                                                {
                                                    (()=>{
                                                        let returnStatus = common.statusOrderHistory({orderStatus: item.orderStatus, unmatchedQuantity: item.unmatchedQuantity});
                                                        return <div style={{color: returnStatus.color, fontWeight: 500}}>{returnStatus.status}</div>
                                                    })()
                                                }
                                            </Col>
                                        </List.Item>}
                                    >
                                        {isLoading && isLoadMore && (
                                            <div className="demo-loading-container">
                                                <Spin />
                                            </div>
                                            )}
                                    </List>
                                </InfiniteScroll>
                                
                            : null
                            }
                        </div>
                    </div>
                </Loading>
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
        equityOrder: (data)=> dispatch(equityOrder(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (HistoryOrderTime);
