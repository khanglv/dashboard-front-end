import React, { useEffect, useState } from 'react';
// useImperativeHandle
import {css} from 'emotion';
import {Row, Col, Select, DatePicker} from 'antd';
import Highcharts from 'highcharts/highstock';
import HighChartMaster from 'highcharts/modules/map';
import {connect} from 'react-redux';
import {
    getEquityOrderHistory
} from '../../stores/actions/core/equityOrderAction';
import {loadTradingHistory} from '../../stores/actions/core/tradingViewAction';
import {equityAccountStockDetail} from '../../stores/actions/core/equityAccountAction';
import moment from 'moment';
import * as common from '../../components/Common/Common';
import Loading from '../../components/Loading/Loading';

Highcharts.setOptions({
    lang: {
        months: [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
            'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
            'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ],
        shortMonths: [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
            'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
            'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ],
        weekdays: [
            'CN', 'T2', 'T3', 'T4',
            'T5', 'T6', 'T7'
        ]
    }
})

HighChartMaster(Highcharts);

let color = window['colors'];
const { Option } = Select;
const dateFormat = 'DD/MM/YYYY';
const newDate = new Date();

const rootChart = css`
    .componentItem{
        background-color: ${color._WHITE};
        padding: 1em;
        padding-bottom: 0;
        border-radius: 4px;
        .title{
            color: ${color._BLACK};
            font-weight: 600;
            .btnChartOption{
                font-size: 12px;
                font-weight: 600;
                color: ${color._GREY_666};
                cursor: pointer;
                padding: 0.4em 1em;
                background-color: ${color._GREY_LIGHT_2};
                outline: none;
                border: none;
                &:hover{
                    background-color: ${color._LIGHT_dce7f3};
                    color: ${color._BLUE_VCSC};
                }
            }
            .left{
                border-bottom-left-radius: 4px;
                border-top-left-radius: 4px;
            }
            .right{
                border-bottom-right-radius: 4px;
                border-top-right-radius: 4px;
            }
            .active{
                background-color: ${color._BLUE_VCSC};
                color: ${color._WHITE};
                &:hover{
                    background-color: ${color._BLUE_VCSC_HOVER};
                    color: ${color._WHITE};
                }
            }
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

function ChartHistory (props){
    let codeStockTmp = 'VCI';
    let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
    if (obj) {
        if(obj.CODE_STOCK){
            codeStockTmp = obj.CODE_STOCK;
        }
    }
    const [date, setDate] = useState({
        fromDate: moment(new Date(new Date(newDate).setMonth(newDate.getMonth()-5)), dateFormat), 
        toDate: moment(new Date(), dateFormat)
    });
    const [accountInfo] = useState(JSON.parse(localStorage.getItem('accountInfoKey')));
    const [stockCode, setStockCode] = useState(codeStockTmp);
    const [lstOrder, setListOrder] = useState({sell: [], buy: [], priceSell: [], priceBuy: []});
    const [isLoadingPrice, setLoadingPrice] = useState(false);
    const [dataHistory, setDataHistory] = useState([]);
    const [dataKeep, setDataKeep] = useState([]);
    const [isOption, setOption] = useState(1);

    const myRef = React.useRef(null);

    const loadChart = () => {
        try {
            const myChartRef = myRef.current;
            let dataChart = [];
            if(isOption === 1){
                dataChart = [
                    {
                        data: lstOrder.buy || [],
                        name: `${stockCode} - Mua`,
                        type: 'column',
                        yAxis: 1,
                        color: color._GREEN
                    },
                    {
                        data: lstOrder.sell || [],
                        name: `${stockCode} - Bán`,
                        type: 'column',
                        color: color._RED_VCSC,
                        yAxis: 1
                    },
                    {
                        name: 'Giá bán',
                        type: 'spline',
                        data: lstOrder.priceSell || [],
                        color: color._RED_VCSC,
                        lineWidth: 0,
                        marker: {
                            radius: 6,
                            symbol: 'diamond',
                        },
                        states: {
                            hover: {
                            lineWidthPlus: 0
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>'
                        }
                    },
                    {
                        type: 'spline',
                        name: 'Giá mua',
                        color: color._GREEN,
                        data: lstOrder.priceBuy || [],
                        lineWidth: 0,
                        marker: {
                            radius: 5,
                            symbol: 'triangle',
                        },
                        states: {
                            hover: {
                            lineWidthPlus: 0
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>'
                        }
                    },
                    {
                        name: `${stockCode} - Giá`,
                        data: dataHistory,
                        type: 'line',
                        marker: {
                            symbol: 'circle'
                        }
                    }
                ]
            }
            if(isOption === 2){
                dataChart = [
                    {
                        data: dataKeep || [],
                        name: `${stockCode} - KL`,
                        type: 'column',
                        color: color._YELLOW,
                        yAxis: 1
                    },
                    {
                        name: 'Giá bán',
                        type: 'spline',
                        data: lstOrder.priceSell || [],
                        color: color._RED_VCSC,
                        lineWidth: 0,
                        marker: {
                            radius: 6,
                            symbol: 'diamond',
                        },
                        states: {
                            hover: {
                            lineWidthPlus: 0
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>'
                        }
                    },
                    {
                        type: 'spline',
                        name: 'Giá mua',
                        color: color._GREEN,
                        data: lstOrder.priceBuy || [],
                        lineWidth: 0,
                        marker: {
                            radius: 5,
                            symbol: 'triangle',
                        },
                        states: {
                            hover: {
                            lineWidthPlus: 0
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>'
                        }
                    },
                    {
                        name: `${stockCode} - Giá`,
                        data: dataHistory || [],
                        type: 'line',
                        marker: {
                            symbol: 'circle'
                        }
                        // color: color._GREY_CCC
                    }
                ]
            }

            Highcharts.chart(myChartRef, {
                chart: {
                    style: {
                        fontFamily: 'Montserrat'
                    },
                },
                navigator: {
                    series: {
                        type: 'line'
                    }
                },
                mapNavigation: {
                    enableMouseWheelZoom: true
                },
                credits: { //hide logo highchart.com
                    enabled: false
                },
                plotOptions: {
                    line: {
                        marker: {
                            enabled: false
                        }
                    },
                    // column: {
                    //     stacking: "normal",
                    //     pointWidth: 10
                    // }
                },
                tooltip: {
                    shared: true,
                    borderColor: 'rgb(124, 181, 236)'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                    ordinal: true,
                },
                yAxis: [{
                    className: 'highcharts-color-0',
                    title: {
                        text: 'Giá'
                    },
                    gridLineColor: color._GREY_LIGHT_2
                }, {
                    className: 'highcharts-color-1',
                    opposite: true,
                    title: {
                        text: 'Khối lượng'
                    },
                    gridLineColor: color._GREY_LIGHT_2,
                    height: '50%',
                    top: '50%'
                }],
                series: dataChart
            })
        } catch (error) {
            
        }
    }

    const loadOneHundredRecord = (arrData)=>{
        try {
            let lastOrder = {lastOrderDate: null, lastBranchCode: null, lastOrderNumber: null, lastMatchPrice: null};
            if(arrData.length > 0){
                lastOrder = arrData[arrData.length-1];
            }
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            return props.getEquityOrderHistory({
                accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                subNumber: obj ? obj.SUB_NUMBER : '00',
                stockCode: stockCode || 'ACB',
                lastOrderDate: lastOrder.orderDate,
                lastBranchCode: lastOrder.branchCode,
                lastOrderNumber: lastOrder.orderNumber,
                lastMatchPrice: lastOrder.matchedPrice,
                matchType: 'MATCHED',
                fetchCount: 100,
                fromDate: common.dateToYYYYMMDD(new Date(date.fromDate)),
                toDate: common.dateToYYYYMMDD(new Date(date.toDate))
            });
        } catch (error) {
            
        }
    }

    const loadDataAll = async(arrData = [])=>{
        try {
            setLoadingPrice(true);
            const res = await loadOneHundredRecord(arrData);

            if(res.type === 'EQUITY_ORDER.HISTORY'){
                let lstOrderHis = [];
                let lstOrderChartHisSell = [];
                let lstOrderChartHisBuy = [];
                let lstOrderChartHisPriceSell = [];
                let lstOrderChartHisPriceBuy = [];
                if(res.data){
                    if(res.data.length >= 100){
                        arrData = [...arrData, ...res.data];
                        loadDataAll(res.data);
                    }else{
                        lstOrderHis = [
                            ...arrData, ...res.data
                        ]
                        //Group array the same orderNumber
                        lstOrderHis = Array.from(lstOrderHis.reduce((m, item) => 
                            m.set(item.orderDate, [...(m.get(item.orderDate) || []), item]), new Map()
                        ), ([orderDate, lstChild]) => ({orderDate, lstChild})
                        );
                        if(lstOrderHis.length > 0){
                            lstOrderHis = lstOrderHis.map((item)=>{
                                let obj = item.lstChild;
                                let totalOrderQuantitySell = 0;
                                let totalOrderQuantityBuy = 0;
                                let averagePriceSell = 0;
                                let averagePriceBuy = 0;
                                if(obj.length > 0){
                                    let objSell = obj.filter(item => item.sellBuyType === 'SELL');
                                    if(objSell.length > 0){
                                        totalOrderQuantitySell = objSell.reduce(function(accumulator, currentValue) {
                                            return accumulator + currentValue.matchedQuantity;
                                        }, 0);
                                        let totalUnmatchedPriceSell = objSell.reduce(function(accumulator, currentValue) {
                                            return accumulator + currentValue.matchedQuantity*currentValue.matchedPrice;
                                        }, 0);
                                        averagePriceSell = totalOrderQuantitySell === 0 ? 0 : totalUnmatchedPriceSell/totalOrderQuantitySell;
                                    }
                                    let objBuy = obj.filter(item => item.sellBuyType === 'BUY');
                                    if(objBuy.length > 0){
                                        totalOrderQuantityBuy = objBuy.reduce(function(accumulator, currentValue) {
                                            return accumulator + currentValue.matchedQuantity;
                                        }, 0);
                                        let totalUnmatchedPriceBuy = objBuy.reduce(function(accumulator, currentValue) {
                                            return accumulator + currentValue.matchedQuantity*currentValue.matchedPrice;
                                        }, 0);
                                        averagePriceBuy = totalOrderQuantityBuy === 0 ? 0 : totalUnmatchedPriceBuy/totalOrderQuantityBuy;
                                    }
                                }
                                let objMaster = {
                                    ...obj[0],
                                    orderQuantitySell: totalOrderQuantitySell,
                                    orderQuantityBuy: totalOrderQuantityBuy,
                                    averagePriceSell: parseInt(averagePriceSell) || 0,
                                    averagePriceBuy: parseInt(averagePriceBuy) || 0
                                }
                                return{
                                    ...item,
                                    ...objMaster || {}
                                }
                            });
                        }

                        if(lstOrderHis.length > 0){
                            lstOrderHis = lstOrderHis.reverse();
                            lstOrderChartHisSell = lstOrderHis.filter(item => item.orderQuantitySell > 0).map((item)=>{
                                return [
                                    new Date(common.splitStringDate(item.orderDate)).setHours(8,0,0,0),
                                    item.orderQuantitySell
                                ]
                            });
                            lstOrderChartHisBuy = lstOrderHis.filter(item => item.orderQuantityBuy > 0).map((item)=>{
                                return [
                                    new Date(common.splitStringDate(item.orderDate)).setHours(8,0,0,0),
                                    item.orderQuantityBuy
                                ]
                            });
                            lstOrderChartHisPriceSell = lstOrderHis.filter(item => item.averagePriceSell > 0).map((item)=>{
                                return [
                                    new Date(common.splitStringDate(item.orderDate)).setHours(8,0,0,0),
                                    item.averagePriceSell
                                ]
                            });
                            lstOrderChartHisPriceBuy = lstOrderHis.filter(item => item.averagePriceBuy > 0).map((item)=>{
                                return [
                                    new Date(common.splitStringDate(item.orderDate)).setHours(8,0,0,0),
                                    item.averagePriceBuy
                                ]
                            });
                        }
                        setLoadingPrice(false);
                    }
                    return ({
                        ...lstOrder, 
                        sell: lstOrderChartHisSell, 
                        buy: lstOrderChartHisBuy, 
                        priceSell: lstOrderChartHisPriceSell,
                        priceBuy: lstOrderChartHisPriceBuy
                    });
                }
            }else{
                setLoadingPrice(false);
            }
        } catch (error) {
            setLoadingPrice(false);
        }
    }

    const loadTradingHistory = async()=>{
        try {
            const res = await props.loadTradingHistory({
                symbol: stockCode,
                resolution: 'D',
                from: Math.round(new Date(date.fromDate).getTime()/1000),
                to: Math.round(new Date(date.toDate).getTime()/1000)
            });
            let result = {lstData: [], lstTime: []}
            if(res.type === 'TRADING.HISTORY'){
                let dataNew = [];
                let lstTimeTmp = [];
                if(Object.keys(res.data).length > 0){
                    let length = res.data.c.length;
                    let xArr = res.data.t;
                    // let hArr = res.data.h;
                    // let oArr = res.data.o;
                    // let lArr = res.data.l;
                    let cArr = res.data.c;
                    for(let i = 0; i < length; i++){
                        dataNew = [
                            ...dataNew,
                            [
                                new Date(xArr[i]*1000).setHours(8,0,0,0),
                                cArr[i]
                            ]
                        ];
                        lstTimeTmp = [
                            ...lstTimeTmp,
                            new Date(xArr[i]*1000).setHours(8,0,0,0),
                        ]
                    }
                }
                result = {lstData: dataNew, lstTime: lstTimeTmp};
            }
            return result
        } catch (error) {
            return {lstData: [], lstTime: []}
        }
    }

    const loadAccountBalance = async()=>{
        try {
            let accountInfo = JSON.parse(localStorage.getItem('accountInfoKey'));
            let subNumber = '00';
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            if (obj){
                if(obj.SUB_NUMBER){
                    subNumber = obj.SUB_NUMBER;
                }
            }
            const res = await props.equityAccountStockDetail({
                accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                subNumber: subNumber,
                date: common.dateToYYYYMMDD(new Date()),
                fetchCount: 100,
                stockCode: stockCode
            });
            if(res.type === 'EQUITY_ACCOUNT.STOCK_DETAIL'){
                return res.data;
            }
            return [];
        } catch (error) {
            
        }
    }

    async function loadChart_2(lstTimeHis, lstOrder){
        try {
            let data = [];
            const accountBalance = await loadAccountBalance();
            if(lstTimeHis.length > 0 && accountBalance.length > 0){
                let tmp = lstTimeHis.reverse();
                let openBalance = accountBalance[0].availableQuantity;
                for(let i = 0; i < tmp.length; i++){
                    let sell = 0;
                    let buy = 0;
                    if(lstOrder.sell && lstOrder.sell.length > 0){
                        let idxSell = lstOrder.sell.findIndex(item => item[0] === tmp[i]);
                        if(idxSell > -1){
                            sell = lstOrder.sell[idxSell][1];
                        }
                    }
                    if(lstOrder.buy && lstOrder.buy.length > 0){
                        let idxBuy = lstOrder.buy.findIndex(item => item[0] === tmp[i]);
                        if(idxBuy > -1){
                            buy = lstOrder.buy[idxBuy][1];
                        }
                    }
                    openBalance = openBalance + sell - buy;
                    data = [
                        ...data,
                        [
                            tmp[i],
                            openBalance
                        ]
                    ];
                }
            }
            setDataKeep(data.reverse());
        } catch (error) {
            
        }
    }

    function loadData() {
        let d1 = loadTradingHistory();
        let d2 = loadDataAll();
        Promise.all([d1, d2]).then(async result => {
            await loadChart_2(result[0].lstTime, result[1])
            setDataHistory(result[0].lstData)
            setListOrder(result[1])
        })
    }

    useEffect(loadData, [stockCode, date, props.subNumberChange]);

    useEffect(loadChart, [dataHistory, lstOrder, isOption]);

    const updateInputDate = name => (value)=>{
        if(name === 'toDate'){
            if(common.compareTwoDate(date.fromDate, value) === 2){
                setDate({
                    toDate: value,
                    fromDate: value
                });
            }else{
                setDate({
                    ...date,
                    [name]: value
                });
            }
        }else{
            setDate({
                ...date,
                [name]: value
            });
        }
    }

    const setOptionChart = (value)=>{
        setOption(value);
    }

    const updateSelectValue = (event)=>{
        setStockCode(event);
    }

    const disabledDate = (current)=> {
        let d = moment(new Date());
        // let dStart = moment(new Date(this.state.fromDate)).add(-1, 'day');
        return current && (current > d.endOf('day'));
        // || current < dStart.endOf('day')
    }
    const lstStock = [...props.lstStock]
    return(
        <div className={rootChart}>
            <Row gutter={10}>
                <Col xl={4} md={8} xs={8}>
                    <Select
                        className={customSelectOrder}
                        showSearch
                        allowClear
                        placeholder="Nhập mã CP"
                        onChange={updateSelectValue}
                        optionFilterProp="children"
                        value={stockCode}
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
                <Col xl={8} md={16} xs={16}>
                    <DatePicker 
                        className="datePicker" 
                        onChange={updateInputDate('fromDate')} 
                        format={dateFormat} 
                        value={date.fromDate}
                    />&nbsp;&nbsp;

                    <DatePicker 
                        className="datePicker" 
                        onChange={updateInputDate('toDate')} 
                        format={dateFormat} 
                        value={date.toDate}
                        disabledDate={disabledDate}
                    />
                </Col>
            </Row>
            <div className="p-top20">
                <Loading isLoading={isLoadingPrice}>
                    <div className="componentItem">
                        <div className="title">
                            BIẾN ĐỘNG GIÁ
                            &nbsp;&nbsp;
                            <button 
                                className={`btnChartOption left ${isOption === 1 ? 'active' : ''}`}
                                onClick={() => setOptionChart(1)}
                            >
                                KL Mua Bán
                            </button>
                            <button 
                                className={`btnChartOption right ${isOption === 2 ? 'active' : ''}`}
                                onClick={() => setOptionChart(2)}
                            >
                                KL nắm giữ
                            </button>
                        </div>
                        <div className="p-top10">
                            <div style={{ width: '100%', maxHeight: 400 }} ref={myRef} />
                        </div>
                    </div>
                </Loading>
            </div>
        </div>
    )
}

const mapStateToProps = state =>{
    return{
        lstStock: state.indexCore['STOCKS.LIST'],
        lstHistory: state.indexCore['TRADING.HISTORY'],
        lstEquityAccountStock: state.indexCore['EQUITY_ACCOUNT.STOCK_DETAIL'],
        subNumberChange: state.rootMain['SUB_NUMBER']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getEquityOrderHistory: (data)=> dispatch(getEquityOrderHistory(data, false)),
        loadTradingHistory: (data)=> dispatch(loadTradingHistory(data, false)),
        equityAccountStockDetail: (data)=> dispatch(equityAccountStockDetail(data, false)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (ChartHistory);