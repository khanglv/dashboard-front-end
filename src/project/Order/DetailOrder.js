import React, {Component} from 'react';
import {List, Select, Badge, Col, Row, Progress } from 'antd';
import {RightOutlined} from '@ant-design/icons';
import OrderHistory from './OrderHistory';

import * as socket from '../Socket/Socket';
import {connect} from 'react-redux';
import {getMarketStock, getMarketFutures} from '../../stores/actions/core/marketStockAction';
import Loading from '../../components/Loading/Loading';

import {css} from 'emotion';
import * as common from '../../components/Common/Common';
import * as storage from '../../api/storage';

const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
// const windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

const { Option } = Select;
let color = window['colors'];

const customSelectOrder = css`
    width: 100%;
	top: 5px;
	color: ${color._BLACK};
	font-weight: 500;
	font-size: 13px;
    .ant-select-selector{
        border: 1px solid ${color._STROKE};
        border-radius: 4px!important;
    }
    &.HeaderOrder{
        width: 20rem;
        top: 0;
    }
`

const reponsiveOrderDetail = css`
	position: absolute;
    bottom: 10px;
    top: 0;
	padding-right: 1rem;
	height: 100%;
    @media only screen and (max-width: 992px) {
        padding: 0;
    }
    .openTrading{
        &:hover{
            color: ${color._BLUE_LINK}!important
        }
    }
    .main_2{
        width: 100%;
        background-color: ${color._WHITE};
        border-radius: 8px;
        height: auto;
        margin-top: 20px;
        padding-bottom: 2px;
        @media only screen and (max-width: 768px) {
            padding: 10px;
        }
    }
`

const rootDetailOrder = css`
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
            if(total === 0){
                return 0;
            }
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
            if(total === 0){
                return 0;
            }
            return (value*100/total).toFixed(0);
        }
        return 0;
    } catch (error) {
        
    }
}

class DetailOrder extends Component{
    constructor(props){
        super(props);
        this.state = {
            value: 0,
            key: 0,
            codeStock: '',
            lstStock: [],
            dataStockCodeSocket: {},
            dataStockBidoffer: [],
            isLoading: false,
            objStock: {}
        }

        this.props_master = this.props;
    }

    componentDidMount(){
        this.setState({dataStockBidoffer: [], dataStockCodeSocket: []});
    }

    getDataInitStock = async(stockCode)=>{
        try {
            let rememberSectionOrder = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            let subNumber = rememberSectionOrder ? rememberSectionOrder.SUB_NUMBER : '00';
            this.setState({isLoading: true});
            if(subNumber === '80'){
                const res = await this.props.getMarketFutures(stockCode);
                if(res.type === 'MARKET_FUTURES.OBJ'){
                    // this.props.dispatch({
                    //     type: 'EXCHANGE_ONLINE'
                    // });
                    this.props_master.componentEvent.fire("changeStockCode", true, 
                    {
                        lastReal: res.data.last, 
                        last: res.data.last, 
                        ceilingPrice: res.data.ceilingPrice, 
                        floorPrice: res.data.floorPrice,
                        market: res.data.market
                    });
                    this.props_master.componentEvent.fire("changeLastStockCode", true, {last: res.data.last});
                    this.props_master.componentEvent.fire("estimatedData", true, 
                    {
                        ceilingPriceE: res.data.estimatedData.ceilingPrice, 
                        floorPriceE: res.data.estimatedData.floorPrice
                    });
                }
            }else{
                const res = await this.props.getMarketStock(stockCode);
                if(res.type === 'MARKET_STOCK.OBJ'){
                    this.props_master.componentEvent.fire("changeStockCode", true, 
                    {
                        lastReal: res.data.last, 
                        last: res.data.last, 
                        ceilingPrice: res.data.ceilingPrice, 
                        floorPrice: res.data.floorPrice,
                        market: res.data.market
                    });
                    this.props_master.componentEvent.fire("changeLastStockCode", true, {last: res.data.last});
                    this.props_master.componentEvent.fire("estimatedData", true, {ceilingPriceE: res.data.estimatedData.ceilingPrice, floorPriceE: res.data.estimatedData.floorPrice});
                }
            }
            this.setState({isLoading: false});
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    async componentDidUpdate(prev){
        if(prev.codeStock !== this.props.codeStock){
            await this.setState({codeStock: this.props.codeStock, lstStock: this.props.lstStockIndex, dataStockBidoffer: [], dataStockCodeSocket: []});         
            await this.getDataInitStock(this.props.codeStock);
            await this.onCheckObjStock();
            // this.connectSocket();
        }
    }

    componentWillUnmount(){
        // socket.disconectChanel(this.props.codeStock);
        this.props_master.componentEvent.stop();
        this.setState({dataStockCodeSocket: [], dataStockBidoffer: []});
    }

    connectSocket = ()=>{
        socket.connectStockQuote(this.props.codeStock, data => {
            if(data && data.code === this.props.codeStock){
                this.setState({dataStockCodeSocket: data});
            }
        });
        socket.connectStockBidoffer(this.props.codeStock, data => {
            if(data && data.code === this.props.codeStock){
                this.setState({dataStockBidoffer: data});
            }
        });
    }

    onCheckObjStock = ()=>{
        const lstStock = [...this.props.lstStockIndex];
        const idx = lstStock.findIndex(x => x.s === this.props.codeStock);
        if(idx > -1){
            this.setState({objStock: lstStock[idx]});
        }
    }

    handleChange = (event, newValue) => {
        this.setState({value: newValue});
    };

    updateSelectValue = name => async(event)=>{
        const {
            codeStock
        } = this.state;
        
        if(name === 'codeStock'){
            let rememberSectionOrder = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            let subNumber = rememberSectionOrder ? rememberSectionOrder.SUB_NUMBER : '00';
            storage.rememberSectionOrder(JSON.stringify({CODE_STOCK: event, SUB_NUMBER: subNumber}));
            socket.disconectChanel(codeStock);
            this.props._onChangeCodeStock(event);
        }
        this.setState({[name]: event});
    }

    _changeStockCodeShortcut = (value)=>{
        let rememberSectionOrder = JSON.parse(localStorage.getItem('rememberSectionOrder'));
        let subNumber = rememberSectionOrder ? rememberSectionOrder.SUB_NUMBER : '00';
        storage.rememberSectionOrder(JSON.stringify({CODE_STOCK: value, SUB_NUMBER: subNumber}));
        this.props._onChangeCodeStock(value);
    }

    setPriceShortcut = (value)=>{
        this.props_master.componentEvent.fire("changeLastStockCode", true, {last: value});
    }

    goToPageTrading = ()=>{
        window.location.href = '/web-trading';
    }

    render(){
        const {
            codeStock,
            lstStock,
            objStock,
            dataStockCodeSocket,
            dataStockBidoffer,
            isLoading
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
            <div style={{position: 'relative', height: '100%'}}>
                <Col className={reponsiveOrderDetail}>
                    <Loading isLoading={isLoading}>
                        <div style={styles.main_1}>
                            <div style={styles.main_1_header}>
                                <span style={{...styles.labelHeader, ...{paddingRight: 20}}}>Mã Cổ phiếu</span>
                                <Select
                                    className={`${customSelectOrder} HeaderOrder`}
                                    showSearch
                                    value={codeStock}
                                    onChange={this.updateSelectValue('codeStock')}
                                    placeholder="Chọn mã cổ phiếu"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {lstStock.length > 0 ? lstStock.map((item, idx)=>{
                                        return(
                                            <Option key={idx} value={item.s}>
                                                {`${item.s} - ${item.n1}`}
                                            </Option>
                                        )
                                    }) 
                                    : null}
                                </Select>
                            </div>
                            <div style={styles.main_1_body}>
                                <div>
                                    <span style={styles.title_body}>{objStock.n1}</span>&nbsp;&nbsp;<Badge color={color._GREEN} text={objStock.m} /><br/>
                                    <span 
                                        onClick={this.goToPageTrading}
                                        style={{fontSize: 13, color: '#00377b', lineHeight: 1.23, fontWeight: 500, cursor: 'pointer'}}
                                        className="openTrading"
                                    >
                                        Xem Biểu đồ <RightOutlined style={{fontSize: 10}}/>
                                    </span>
                                </div>
                                <Row className={rootDetailOrder} gutter={50}>
                                    <Col xl={12} lg={12} md={24} sm={24} xs={24} className="p-top20">
                                        <Row gutter={30}>
                                            <Col span={12}>
                                                <Row gutter={5}>
                                                    <Col span={14}>
                                                        Giá dự kiến
                                                    </Col>
                                                    <Col span={10} className="textAlignRight">
                                                        <span style={{color: common.setColor({
                                                            current: lstBidOffer.expectedPrice,
                                                            floor: dataStockCode.floorPrice,
                                                            ref: dataStockCode.referencePrice,
                                                            ceiling: dataStockCode.ceilingPrice,
                                                        }), cursor: 'pointer'}} onClick={()=>lstBidOffer.expectedPrice ? this.setPriceShortcut(lstBidOffer.expectedPrice) : null}>{lstBidOffer.expectedPrice ? common.convertTextDecimal(lstBidOffer.expectedPrice) : '-' }</span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={12}>
                                                <Row gutter={5}>
                                                    <Col span={12}>
                                                        T.Chiếu
                                                    </Col>
                                                    <Col span={12} className="textAlignRight">
                                                        <span style={{color: color._BLACK, cursor: 'pointer'}} onClick={()=>this.setPriceShortcut(dataStockCode.referencePrice)}>{common.convertTextDecimal(dataStockCode.referencePrice)}</span>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col span={12} className="p-top10">
                                                <Row gutter={5}>
                                                    <Col span={14}>
                                                        Thị giá
                                                    </Col>
                                                    <Col span={10} className="textAlignRight">
                                                        <span style={{color: common.setColor({
                                                            current: dataStockCode.last,
                                                            floor: dataStockCode.floorPrice,
                                                            ref: dataStockCode.referencePrice,
                                                            ceiling: dataStockCode.ceilingPrice,
                                                        }), cursor: 'pointer'}} onClick={()=>this.setPriceShortcut(dataStockCode.last)}>{common.convertTextDecimal(dataStockCode.last)}</span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={12} className="p-top10">
                                                <Row gutter={5}>
                                                    <Col span={12}>
                                                        Trần
                                                    </Col>
                                                    <Col span={12} className="textAlignRight">
                                                        <span style={{color: color._PURPLE, cursor: 'pointer'}} onClick={()=>this.setPriceShortcut(dataStockCode.ceilingPrice)}>{common.convertTextDecimal(dataStockCode.ceilingPrice)}</span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            
                                            {/* <Col span={12} className="p-top10">
                                                <Row gutter={5}>
                                                    <Col span={14}>
                                                        % Thay đổi
                                                    </Col>
                                                    <Col span={10} className="textAlignRight">
                                                        <span style={{color: common.setColorRatio(dataStockCode.rate)}}>{dataStockCode.rate}%</span>
                                                    </Col>
                                                </Row>
                                            </Col> */}
                                            <Col span={12} className="p-top10">
                                                <Row gutter={5}>
                                                    <Col span={10}>
                                                        Thay đổi
                                                    </Col>
                                                    <Col span={14} className="textAlignRight">
                                                        <span style={{color: common.setColorRatio(dataStockCode.change)}}>
                                                            {common.convertTextDecimal(dataStockCode.change)} ({dataStockCode.rate}%)
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={12} className="p-top10">
                                                <Row gutter={5}>
                                                    <Col span={12}>
                                                        Sàn
                                                    </Col>
                                                    <Col span={12} className="textAlignRight">
                                                        <span style={{color: color._BLUE, cursor: 'pointer'}} onClick={()=>this.setPriceShortcut(dataStockCode.floorPrice)}>{common.convertTextDecimal(dataStockCode.floorPrice)}</span>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col span={12} className="p-top10">
                                                <Row gutter={5}>
                                                    <Col span={14}>
                                                        Cao nhất
                                                    </Col>
                                                    <Col span={10} className="textAlignRight">
                                                        <span style={{color: color._GREEN, cursor: 'pointer'}} onClick={()=>this.setPriceShortcut(dataStockCode.high)}>{common.convertTextDecimal(dataStockCode.high)}</span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={12} className="p-top10">
                                                <Row gutter={5}>
                                                    <Col span={12}>
                                                        Tổng KL
                                                    </Col>
                                                    <Col span={12} className="textAlignRight" style={{wordWrap: 'break-word'}}>
                                                        <span style={{color: color._BLACK}}>{common.convertTextDecimal(dataStockCode.tradingVolume)}</span>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col span={12} className="p-top10">
                                                <Row gutter={5}>
                                                    <Col span={14}>
                                                        Thấp nhất
                                                    </Col>
                                                    <Col span={10} className="textAlignRight">
                                                        <span style={{color: color._RED_VCSC, cursor: 'pointer'}} onClick={()=>this.setPriceShortcut(dataStockCode.low)}>{common.convertTextDecimal(dataStockCode.low)}</span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={12} className="p-top10">
                                                <Row gutter={5}>
                                                    <Col span={12}>
                                                        NN Mua
                                                    </Col>
                                                    <Col span={12} className="textAlignRight">
                                                        <span style={{color: color._BLACK}}>{common.convertTextDecimal(dataStockCode.foreignerBuyVolume || 0)}</span>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col span={12} className="p-top10">
                                                <Row gutter={5}>
                                                    <Col span={14}>
                                                        Bình quân
                                                    </Col>
                                                    <Col span={10} className="textAlignRight">
                                                        <span style={{color: color._BLACK}}>{common.convertTextDecimal(dataStockCode.averagePrice)}</span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={12} className="p-top10">
                                                <Row gutter={5}>
                                                    <Col span={12}>
                                                        NN Bán
                                                    </Col>
                                                    <Col span={12} className="textAlignRight">
                                                        <span style={{color: color._BLACK}}>{common.convertTextDecimal(dataStockCode.foreignerSellVolume || 0)}</span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
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
                                                                            type: common.compareTimeTradeType(item.bidPrice, item.bidVolume)
                                                                        }), fontWeight: 600, cursor: 'pointer'}} 
                                                                        onClick={()=>this.setPriceShortcut(item.bidPrice)}
                                                                        >{common.compareTimeTradeType(item.bidPrice, item.bidVolume)}</span>
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
                                                                            type: common.compareTimeTradeType(item.offerPrice, item.offerVolume)
                                                                        }), fontWeight: 600, cursor: 'pointer'}} onClick={()=>this.setPriceShortcut(item.offerPrice)}
                                                                        >{common.compareTimeTradeType(item.offerPrice, item.offerVolume)}</span>
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
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Loading>
                    <div className="main_2">
                        <OrderHistory 
                            lstStock={lstStock} 
                            isReloadOrderHistory={this.props._isReloadOrderHistory}
                            reloadedComponent={this.props._reloadedComponent}
                            componentEvent={this.props.componentEvent}
                            changeStockCodeShortcut={this._changeStockCodeShortcut}
                        />
                    </div>
                </Col>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstStock: state.indexCore['STOCKS.LIST'],
        marketStockInit: state.indexCore['MARKET_STOCK.OBJ'],
        marketFuturesInit: state.indexCore['MARKET_FUTURES.OBJ']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getMarketStock: (stockCode)=> dispatch(getMarketStock(stockCode)),
        getMarketFutures: (futureCode)=> dispatch(getMarketFutures(futureCode)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (DetailOrder);

const styles = {
    main_1: {
        width: '100%',
        backgroundColor: color._WHITE,
        borderRadius: 8,
        height: 'auto'
    },
    main_1_header: {
        backgroundColor: '#e9ecf2',
        display: 'flex',
        alignItems: 'center',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        padding: windowWidth > 768 ? '15px 20px' : 10
    },
    main_1_body: {
        padding:  windowWidth > 768 ? 20 : 10,
        color: color._GREY_666,
    },
    title_body: {
        fontSize: windowWidth > 768 ? 18 : 14,
        color: color._BLACK,
        fontWeight: 500
    },
    labelHeader: {
        fontWeight: 600,
        color: color._GREY_666,
        lineHeight: 1
    },
    customInputMain_2: {
        borderRadius: 4,
        border: '1px solid #e3e5ec',
        top: 5,
    }
}