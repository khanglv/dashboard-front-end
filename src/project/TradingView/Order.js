import React, {Component} from 'react';
import {Col, Row, List, Progress} from 'antd';
import OrderBuy from './OrderBuy';
import * as common from '../../components/Common/Common';
import * as socket from '../Socket/Socket';
import {getMarketStock, getMarketFutures} from '../../stores/actions/core/marketStockAction';
import {connect} from 'react-redux';
import {css} from 'emotion';
let color = window['colors'];

const rootDetailOrder = css`
    margin-top: 10px;
    padding: 10px 0;
    margin-left: 5px;
    border-radius: 0.6em;
    background-color: ${color._WHITE};

    .isBackground{
        position: absolute;
        height: 1.6em;
        opacity: 0.2;
    }
    .leftB{
        right: 0;
    }
    .rightB{
        left: 0;
    }
    .textAlignRight{
        text-align: right;
        span{
            font-weight: 500
        }
    }
    .textAlignLeft{
        text-align: left;
    }
    .rightOrderSaleBuy{
        .ant-list-item{
            padding-left: 5px;
            padding-right: 5px;
        }
    }
`

function checkRatioBidVolume(value, arrData){
    try {
        if(arrData.length > 0){
            let total = arrData.reduce((accumulator, currentValue)=>{
                return accumulator + currentValue.bidVolume;
            }, 0);
            return (value*100/total).toFixed(0);
        }
        return 0;
    } catch (error) {
        
    }
}

function checkRatioOfferVolume(value, arrData){
    try {
        if(arrData.length > 0){
            let total = arrData.reduce((accumulator, currentValue)=>{
                return accumulator + currentValue.offerVolume;
            }, 0);
            return (value*100/total).toFixed(0);
        }
        return 0;
    } catch (error) {
        
    }
}

class OrderTrading extends Component{
    constructor(props){
        super(props);
        this.state = {
            key: 0,
            codeStock: '',
            lstStockIndex: [],
            dataStockCodeSocket: {},
            dataStockBidoffer: [],
        }

        this.props_master = props;
    }
    
    componentDidMount(){
        this.loadData();
    }

    componentDidUpdate(prev){
        if(prev.lstStock !== this.props.lstStock){
            this.loadData();
        }
    }

    componentWillUnmount(){
        socket.disconectChanel(this.state.codeStock);
        this.setState({
            dataStockCodeSocket: {},
            dataStockBidoffer: [],
            lstStockIndex: []
        });
    }

    loadData = async ()=>{
        try {
            const data = this.props.lstStock;
            if(data.length > 0){
                let lstStockTmp = data.filter(item => item.t === 'STOCK');
                let codeStockTmp = lstStockTmp[0].s;
                let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
                if (obj) {
                    if(obj.CODE_STOCK){
                        codeStockTmp = obj.CODE_STOCK;
                    }
                    if(obj.SUB_NUMBER && obj.SUB_NUMBER === '80'){
                        lstStockTmp = data.filter(item => item.t === 'FUTURES');
                    }
                }
                if(lstStockTmp.length > 0){
                    this.setState({lstStockIndex: lstStockTmp});
                    await this.onChangeCodeStockLoad(codeStockTmp);
                }
            }
        } catch (error) {
            
        }
    }

    getDataInitStock = async(stockCode)=>{
        try {
            let rememberSectionOrder = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            let subNumber = rememberSectionOrder ? rememberSectionOrder.SUB_NUMBER : '00';
            this.setState({isLoading: true});
            if(subNumber === '80'){
                const res = await this.props.getMarketFutures(stockCode);
                if(res.type === 'MARKET_FUTURES.OBJ'){
                    this.props.dispatch({
                        type: 'EXCHANGE_ONLINE',
                        data: {
                            "changeStockCode": {
                                stockCode: res.data.code,
                                lastReal: res.data.last, 
                                last: res.data.last, 
                                ceilingPrice: res.data.ceilingPrice, 
                                floorPrice: res.data.floorPrice,
                                market: res.data.market
                            },
                            "changeLastStockCode": {
                                last: res.data.last
                            },
                            "estimatedData": {
                                ceilingPriceE: res.data.estimatedData.ceilingPrice, 
                                floorPriceE: res.data.estimatedData.floorPrice
                            }
                        }
                    });
                }
            }else{
                const res = await this.props.getMarketStock(stockCode);
                if(res.type === 'MARKET_STOCK.OBJ'){
                    this.props.dispatch({
                        type: 'EXCHANGE_ONLINE',
                        data: {
                            "changeStockCode": {
                                stockCode: res.data.code,
                                lastReal: res.data.last, 
                                last: res.data.last, 
                                ceilingPrice: res.data.ceilingPrice, 
                                floorPrice: res.data.floorPrice,
                                market: res.data.market
                            },
                            "changeLastStockCode": {
                                last: res.data.last
                            },
                            "estimatedData": {
                                ceilingPriceE: res.data.estimatedData.ceilingPrice, 
                                floorPriceE: res.data.estimatedData.floorPrice
                            }
                        }
                    });
                }
            }
            this.setState({isLoading: false});
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    setPriceShortcut = (value)=>{
        this.props.dispatch({
            type: 'EXCHANGE_ONLINE',
            data: {
                "changeStockCode": {},
                "changeLastStockCode": {
                    last: value
                },
                "estimatedData": {}
            }
        });
    }

    connectSocket = ()=>{
        // socket.connectStockQuote(this.state.codeStock, data => {
        //     if(data && data.code === this.state.codeStock){
        //         this.setState({dataStockCodeSocket: data});
        //     }
        // });
        socket.connectStockBidoffer(this.state.codeStock, data => {
            if(data && data.code === this.state.codeStock){
                this.setState({dataStockBidoffer: data});
            }
        });
    }

    onChangeListStock = (lstStock)=>{
        this.setState({lstStockIndex: lstStock});
    }

    onChangeCodeStockLoad = (codeStock)=>{
        this.setState({codeStock: codeStock});
        this.getDataInitStock(codeStock);
        this.connectSocket();
    }

    onChangeCodeStock = (codeStock)=>{
        this.setState({codeStock: codeStock});
        this.getDataInitStock(codeStock);
        this.connectSocket();
        this.props.dispatch({
            type: 'STOCK_CODE_TRADING',
            data: codeStock
        });
    }

    onReloadOrderHistory = ()=>{
        //nothing
    }

    render(){
        const {
            codeStock,
            lstStockIndex,
            dataStockCodeSocket,
            dataStockBidoffer
        } = this.state;

        let rememberSectionOrder = JSON.parse(localStorage.getItem('rememberSectionOrder'));
        let subNumber = rememberSectionOrder ? rememberSectionOrder.SUB_NUMBER : '00';
        let dataStockCode = {};
        let lstBidOffer = [];
        if(subNumber === '80'){
            dataStockCode = Object.keys(dataStockCodeSocket).length === 0 ? this.props.marketFuturesInit : dataStockCodeSocket;
            lstBidOffer = Object.keys(dataStockBidoffer).length === 0 ? this.props.marketFuturesInit : dataStockBidoffer;
        }else{
            dataStockCode = Object.keys(dataStockCodeSocket).length === 0 ? this.props.marketStockInit : dataStockCodeSocket;
            lstBidOffer = Object.keys(dataStockBidoffer).length === 0 ? this.props.marketStockInit : dataStockBidoffer;
        }
        
        let totalBidVolume = 0;
        let totalOfferVolume = 0;
        if(lstBidOffer.bidOfferList && lstBidOffer.bidOfferList.length > 0){
            totalBidVolume = lstBidOffer.bidOfferList.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue.bidVolume ? currentValue.bidVolume : 0);
            }, 0);
            totalOfferVolume = lstBidOffer.bidOfferList.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue.offerVolume ? currentValue.offerVolume : 0);
            }, 0);
        }
        return(
            <div>
                <OrderBuy 
                    codeStock={codeStock} 
                    lstStockIndex={lstStockIndex} 
                    _onChangeCodeStock={this.onChangeCodeStock} 
                    _onChangeListStock={this.onChangeListStock}
                    componentEvent={this.props.componentEvent}
                    _onReloadOrderHistory={this.onReloadOrderHistory}
                />
                
                <div className={rootDetailOrder}>
                    <Row style={{color: color._BLACK, fontWeight: 600}}>
                        <Col span={3}/>
                        <Col span={18}>
                            <span style={{color: color._BLACK, fontWeight: 600}}>Dư mua</span>
                            <span style={{float: 'right'}}> <span style={{color: color._BLACK, fontWeight: 600}}>Dư bán</span></span>
                        </Col>
                        <Col span={3}/>
                    </Row>
                    <Row style={{display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 600}} gutter={10}>
                        <Col span={3} style={{color: color._BLUE_VCSC, textAlign: 'right'}}>
                            {((totalBidVolume*100/(totalBidVolume + totalOfferVolume)) || 0).toFixed(0)}%
                        </Col>
                        <Col span={18}>
                            <Progress className="customProgressOrder" percent={(totalBidVolume*100/(totalBidVolume + totalOfferVolume)).toFixed(0)} strokeLinecap="square" strokeColor={color._BLUE_VCSC} showInfo={false}/>
                        </Col>
                        <Col span={3} style={{color: color._RED_VCSC}}>
                            {100 - ((totalBidVolume*100/(totalBidVolume + totalOfferVolume)) || 0).toFixed(0)}%
                        </Col>
                    </Row>
                    <List size="large" className="rightOrderSaleBuy" style={{fontWeight: 500}}>
                        {lstBidOffer.bidOfferList && lstBidOffer.bidOfferList.length > 0 ? lstBidOffer.bidOfferList.map((item, idx)=>{
                            return(
                                <List.Item key={idx}>
                                    <Row gutter={30} style={{width: '100%', marginLeft: 0, marginRight: 0}}>
                                        <Col span={12} gutter={10}>
                                            <Row>
                                                <Col span={14} className="textAlignRight" style={{position: 'relative'}}>
                                                    <div className="isBackground leftB" style={{backgroundColor: common.setColor({
                                                            current: item.bidPrice,
                                                            floor: dataStockCode.floorPrice,
                                                            ref: dataStockCode.referencePrice,
                                                            ceiling: dataStockCode.ceilingPrice,
                                                        }), width: `${checkRatioBidVolume(item.bidVolume, lstBidOffer.bidOfferList)}%`
                                                    }}/>
                                                    <span style={{color: color._BLACK}}>{common.convertTextDecimal(item.bidVolume)}</span>
                                                </Col>
                                                <Col span={10} className="textAlignRight">
                                                    <span style={{color: common.setColor({
                                                        current: item.bidPrice,
                                                        floor: dataStockCode.floorPrice,
                                                        ref: dataStockCode.referencePrice,
                                                        ceiling: dataStockCode.ceilingPrice,
                                                    }), fontWeight: 600, cursor: 'pointer'}} 
                                                    onClick={()=>this.setPriceShortcut(item.bidPrice)}
                                                    >{common.convertTextDecimal(item.bidPrice)}</span>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={12} gutter={10}>
                                            <Row>
                                                <Col span={10}>
                                                    <span style={{color: common.setColor({
                                                        current: item.offerPrice,
                                                        floor: dataStockCode.floorPrice,
                                                        ref: dataStockCode.referencePrice,
                                                        ceiling: dataStockCode.ceilingPrice,
                                                    }), fontWeight: 600, cursor: 'pointer'}}
                                                    onClick={()=>this.setPriceShortcut(item.offerPrice)}
                                                    >{common.convertTextDecimal(item.offerPrice)}</span>
                                                </Col>
                                                <Col span={14} style={{position: 'relative'}}>
                                                    <div className="isBackground rightB" style={{backgroundColor: common.setColor({
                                                            current: item.offerPrice,
                                                            floor: dataStockCode.floorPrice,
                                                            ref: dataStockCode.referencePrice,
                                                            ceiling: dataStockCode.ceilingPrice,
                                                        }), width: `${checkRatioOfferVolume(item.offerVolume, lstBidOffer.bidOfferList)}%`
                                                    }}/>
                                                    <span style={{color: color._BLACK}}>{common.convertTextDecimal(item.offerVolume)}</span>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </List.Item>
                            )
                        })
                        : null}
                    </List>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        marketStockInit: state.indexCore['MARKET_STOCK.OBJ'],
        marketFuturesInit: state.indexCore['MARKET_FUTURES.OBJ'],
        lstStock: state.indexCore['STOCKS.LIST']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getMarketStock: (stockCode)=> dispatch(getMarketStock(stockCode)),
        getMarketFutures: (futureCode)=> dispatch(getMarketFutures(futureCode)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (OrderTrading);