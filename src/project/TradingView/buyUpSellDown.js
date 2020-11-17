import React, {Component} from 'react';
import {Col, Row, List, Spin, Tabs} from 'antd';
import {getStockList, getStockCodeQuote} from '../../stores/actions/core/stockListAction';
import {connect} from 'react-redux';
import {css} from 'emotion';
import InfiniteScroll from 'react-infinite-scroller';
import * as common from '../../components/Common/Common';
import Loading from '../../components/Loading/Loading';

const { TabPane } = Tabs;
let color = window['colors'];

const rootMain = css`
    height: calc(100vh - 95px);
    width: 100%;
    background-color: ${color._WHITE};
    .ant-tabs-nav-wrap{
        padding: 0 20px;
    }
    .ant-tabs-bar{
        margin-bottom: 0;
    }
    .ant-tabs-ink-bar{
        background-color: ${color._BLUE_VCSC};
        width: 3.5em!important;
    }
    .ant-tabs-tab{
        color: ${color._GREY_999};
        font-weight: 500;
        font-size: 16px;
        &:hover{
            color: ${color._BLUE_VCSC}!important;
        }
    }
    .ant-tabs-tab-active{
        font-weight: 600;
        color: ${color._BLUE_VCSC}!important;
    }
    .ant-tabs-content{
        height: 100%;
        .content{
            .header{
                background-color: ${color._GREY_LIGHT_2};
                color: ${color._GREY_999};
                font-weight: 600;
                padding: 0.8em;
                padding-right: 1.5em;
                font-size: 12px;
                .right{
                    text-align: right;
                }
            }
            .demo-infinite-container {
                overflow: auto;
                height: 53.7em;
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
                        .offer{
                            color: ${color._RED_VCSC};
                        }
                        .bid{
                            color: ${color._GREEN};
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
        }
        .bodySecond{
            height: 100%;
            color: ${color._WHITE};
            .header{
                background-color: ${color._GREY_LIGHT_2};
                color: ${color._GREY_999};
                font-weight: 600;
                padding: 0.8em;
                font-size: 12px;
                .right{
                    text-align: right;
                }
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
                    font-size: 14px;
                    font-weight: 500;
                    &:hover{
                        background-color: ${color._HOVER};
                        color: ${color._BLACK}
                    }
                    .right{
                        text-align: right;
                    }
                    .offer{
                        color: ${color._RED_VCSC};
                    }
                    .bid{
                        color: ${color._GREEN};
                    }
                    .nature{
                        color: ${color._BLUE};
                    }
                    .crossBar{
                        height: 10px;
                        display: inline-block;
                        background-color: ${color._RED_VCSC};
                    }
                }
            }
        }
    }
`

class BuyUpSellDown extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            isLoadMore: true,
            dataTable: [],
            dataToltal: [],
            activeKey: '1',
            maxVolume: 0
        }
    }

    componentDidMount(){
        this.loadData();
    }

    componentDidUpdate(prev){
        if(this.props.stockCodeChange && prev.stockCodeChange !== this.props.stockCodeChange){
            if(this.state.activeKey === '1'){
                this.loadData(this.props.stockCodeChange);
            }
            if(this.state.activeKey === '2'){
                this.loadAllRecordQuote([], this.props.stockCodeChange);
            }
        }
    }

    loadData = async(code = null)=> {
        try {
            let stockCode = 'VCI';
            if(code){
                stockCode = code;
            }else{
                let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
                if (obj) {
                    if(obj.CODE_STOCK){
                        stockCode = obj.CODE_STOCK;
                    }
                }
            }
            
            this.setState({isLoading: true});
            const res = await this.props.getStockCodeQuote({
                stockCode: stockCode,
                fetchCount: 40
            });
            if(res.type === 'STOCKS.QUOTE'){
                if(res.data.length < 40){
                    this.setState({isLoadMore: false});
                }
                this.setState({dataTable: res.data});
            }
            this.setState({isLoading: false});
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    loadStockQuoteMore = async ()=>{
        try {
            const {
                dataTable
            } = this.state;
            let stockCode = 'VCI';
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            if (obj) {
                if(obj.CODE_STOCK){
                    stockCode = obj.CODE_STOCK;
                }
            }
            this.setState({isLoading: true});
            let lastOrder = dataTable[dataTable.length-1];
            const res = await this.props.getStockCodeQuote({
                stockCode: stockCode,
                fetchCount: 20,
                sequence: lastOrder.sequence
            });
            if(res.type === 'STOCKS.QUOTE'){
                if(res.data.length < 20){
                    this.setState({isLoadMore: false});
                }
                this.setState({dataTable: [
                        ...dataTable, 
                        ...res.data
                    ]
                });
            }
            this.setState({isLoading: false});
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    loadAllRecordQuote = async (arrData = [], code = null)=>{
        try {
            this.setState({isLoading: true});
            const res = await this.loadOneHundredRecord(arrData, code);
            if(res.type === 'STOCKS.QUOTE'){
                if(res.data.length >= 100){
                    arrData = [...arrData, ...res.data];
                    this.loadAllRecordQuote(arrData, code);
                }else{
                    let dataEndLoad = [
                        ...arrData,
                       ...res.data
                    ];
                    let newArr = this.handleArrayDuplicate(dataEndLoad);
                    let maxVolume = 0;
                    if(newArr.length > 0){
                        //find max volume in array obj
                        maxVolume = Math.max.apply(Math, newArr.map(function(o) { return o.tradingReal; }))
                    }
                    this.setState({dataToltal: newArr, maxVolume: maxVolume});
                }
            }
            this.setState({isLoading: false});
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    loadOneHundredRecord = async(arrData, code)=>{
        try {
            let stockCode = 'VCI';
            if(code){
                stockCode = code;
            }else{
                let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
                if (obj) {
                    if(obj.CODE_STOCK){
                        stockCode = obj.CODE_STOCK;
                    }
                }
            }
            let lastOrder = {sequence: null};
            if(arrData.length > 0){
                lastOrder = arrData[arrData.length-1];
            }
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            if (obj) {
                if(obj.CODE_STOCK){
                    stockCode = obj.CODE_STOCK;
                }
            }
            return this.props.getStockCodeQuote({
                stockCode: stockCode,
                fetchCount: 100,
                sequence: lastOrder.sequence
            }, false);
        } catch (error) {
            
        }
    }

    handleArrayDuplicate = (arrData)=>{
        try {
            let lstArrHandle = [];
            if(arrData.length > 0){
                let lstTmp = Array.from(arrData.reduce((m, item) => 
                    m.set(item.last, [...(m.get(item.last) || []), item]), new Map()
                ), ([last, lstChild]) => ({last, lstChild})
                );
                lstArrHandle = lstTmp.map((item)=>{
                    let obj = item.lstChild;
                    let totalTradingVolume = 0;
                    let totalBid = 0;
                    let totalOffer = 0;
                    let totalNature = 0;
                    if(obj.length > 0){
                        totalTradingVolume  = obj.reduce(function(accumulator, currentValue) {
                            return accumulator + currentValue.tradingVolume || 0;
                        }, 0);
                        totalBid  = obj.reduce(function(accumulator, currentValue) {
                            return accumulator + (currentValue.matchedBy === 'BID' ? currentValue.tradingVolume : 0);
                        }, 0);
                        totalOffer  = obj.reduce(function(accumulator, currentValue) {
                            return accumulator + (currentValue.matchedBy === 'OFFER' ? currentValue.tradingVolume : 0);
                        }, 0);
                        totalNature  = obj.reduce(function(accumulator, currentValue) {
                            return accumulator + (currentValue.matchedBy === 'NATURE' ? currentValue.tradingVolume : 0);
                        }, 0);
                    }
                    let objMaster = {
                        ...obj[0],
                        tradingVolume: (totalTradingVolume/1000).toFixed(1),
                        tradingReal: totalTradingVolume,
                        totalBid: totalBid,
                        totalOffer: totalOffer,
                        totalNature: totalNature
                    }
                    return{
                        ...item,
                        ...objMaster || {}
                    }
                });
            }
            return lstArrHandle;
        } catch (error) {
            
        }
    }

    changKeyTab = (key) =>{
        this.setState({activeKey: key});
        if(key === '1'){
            this.loadData();
        }
        if(key === '2'){
            this.loadAllRecordQuote();
        }
    }
    
    render(){
        const {
            isLoadMore,
            isLoading,
            dataTable,
            activeKey,
            dataToltal,
            maxVolume
        } = this.state;
        return(
            <div style={{paddingLeft: 5}}>
                <div className={rootMain}>
                    <Tabs activeKey={activeKey} onChange={this.changKeyTab} animated={false}>
                        <TabPane tab={`LS khớp lệnh`} key='1'>
                            <Loading isLoading={isLoading}>
                                <div className="content">
                                    <div className="header">
                                        <Row>
                                            <Col span={3}>
                                                T.Gian
                                            </Col>
                                            <Col span={5} className="right">
                                                Giá
                                            </Col>
                                            <Col span={6} className="right">
                                                Thay đổi
                                            </Col>
                                            <Col span={5} className="right">
                                                KLGD
                                            </Col>
                                            <Col span={5} className="right">
                                                KL Khớp
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="demo-infinite-container">
                                        <InfiniteScroll
                                            initialLoad={false}
                                            pageStart={0}
                                            loadMore={this.loadStockQuoteMore}
                                            hasMore={!isLoading && isLoadMore}
                                            useWindow={false}
                                        >
                                            <List
                                                size="small"
                                                bordered
                                                split={false}
                                                dataSource={dataTable}
                                                className="styleListStock"
                                                renderItem={(item, idx) => 
                                                    <List.Item className="item" style={{backgroundColor: idx%2 === 1 ? '#f6f6f6' : ''}}>
                                                        <Col span={3}>
                                                            {common.stringToTimeHHMMSS(item.time)}
                                                        </Col>
                                                        <Col span={5} className={`right ${item.matchedBy === 'OFFER' ? 'offer' : (item.matchedBy === 'BID' ? 'bid' : 'nature')}`}>
                                                            {common.convertTextDecimal(item.last)}
                                                        </Col>
                                                        <Col span={6} className={`right ${item.matchedBy === 'OFFER' ? 'offer' : 'bid'}`}>
                                                            {common.convertTextDecimal(item.change)}
                                                            {/* ({item.rate}%) */}
                                                        </Col>
                                                        <Col span={5} className="right">
                                                            {common.convertTextDecimal(item.tradingVolume)}
                                                        </Col>
                                                        <Col span={5} className={`right ${item.matchedBy === 'OFFER' ? 'offer' : 'bid'}`}>
                                                            {common.convertTextDecimal(item.matchingVolume)}
                                                        </Col>
                                                    </List.Item>
                                                }
                                            >
                                                {isLoading && isLoadMore && (
                                                <div className="demo-loading-container">
                                                    <Spin />
                                                </div>
                                            )}
                                            </List>
                                        </InfiniteScroll>
                                    </div>
                                </div>
                            </Loading>
                        </TabPane>
                        <TabPane tab={`KL khớp theo giá`} key='2'>
                            <Loading isLoading={isLoading}>
                                <div className="bodySecond">
                                    <div className="header">
                                        <Row>
                                            <Col span={4}>
                                                Giá
                                            </Col>
                                            <Col span={12}>
                                                Khối lượng
                                            </Col>
                                            <Col span={4} />
                                            <Col span={4} className="right">
                                                GD
                                            </Col>
                                        </Row>
                                    </div>
                                    <List
                                        size="small"
                                        bordered
                                        split={false}
                                        dataSource={dataToltal}
                                        className="styleListStock"
                                        renderItem={(item, idx) => 
                                            <List.Item className="item" style={{backgroundColor: idx%2 === 1 ? '#f6f6f6' : ''}}>
                                                <Col span={4}>
                                                    {common.convertTextDecimal(item.last)}
                                                </Col>
                                                <Col span={12} style={{paddingRight: 10}}>
                                                    <div className="crossBar" style={{width: `${(item.totalOffer*100/maxVolume).toFixed(0)}%`}}></div>
                                                    <div className="crossBar" style={{width: `${(item.totalBid*100/maxVolume).toFixed(0)}%`, backgroundColor: color._GREEN}}></div>
                                                    <div className="crossBar" style={{width: `${(item.totalNature*100/maxVolume).toFixed(0)}%`, backgroundColor: color._BLUE}}></div>
                                                </Col>
                                                <Col span={4} className="right">
                                                    {common.convertTextDecimal(parseFloat(item.tradingVolume))}k
                                                </Col>
                                                <Col span={4} className="right">
                                                    {item.lstChild.length} GD
                                                </Col>
                                            </List.Item>
                                        }
                                    />
                                </div>
                            </Loading>
                        </TabPane>
                    </Tabs>    
                </div>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstStock: state.indexCore['STOCKS.LIST'],
        lstStockQuote: state.indexCore['STOCKS.QUOTE'],
        stockCodeChange: state.rootMain['STOCK_CODE_TRADING']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getStockList: ()=> dispatch(getStockList()),
        getStockCodeQuote: (data, isProgress = true)=> dispatch(getStockCodeQuote(data, isProgress)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (BuyUpSellDown);