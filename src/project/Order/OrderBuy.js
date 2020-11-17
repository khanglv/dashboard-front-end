import React, {Component} from 'react';
import {Row, Col, List, Select, InputNumber, Button, Switch, Tooltip, DatePicker } from 'antd';

import * as common from '../../components/Common/Common';
import * as storage from '../../api/storage';

import {debounce} from 'lodash';
import {css} from 'emotion';

import {getAccountBuyAble} from '../../stores/actions/core/accountBuyAbleAction';
import {getAccountSellAble} from '../../stores/actions/core/accountSellAbleAction';
import {equityOrder} from '../../stores/actions/core/equityOrderAction';
import {getBankAccount} from '../../stores/actions/core/bankAccountAction';
import {equityOrderStop} from '../../stores/actions/core/equityOrderStopAction';
import {equityOrderAdvance} from '../../stores/actions/core/equityOrderAdvanceAction';
import {indexLogs} from '../../stores/actions/investor/indexLogs';
import Dialog from './Dialog';
import * as socket from '../Socket/Socket';
import moment from 'moment';

import {connect} from 'react-redux';

const { Option } = Select;
let color = window['colors'];
const dateFormat = 'DD/MM/YYYY';
const newDate = new Date();

const mainOrder = css`
    width: 100%;
	padding-left: 5px;
    height: 100%;
    /* @media only screen and (max-width: 768px) {
        margin-top: 20px;
        width: 100%;
        padding: 0 5px 10px 5px;
        height: 100%;
    } */
    @media only screen and (max-width: 992px) {
        margin-top: 20px;
        width: 100%;
        padding: 0 5px 10px 5px;
        height: 100%;
    }
    .btnHeaderComponent{
        .btn-tab-order{
            background-color: ${color._LIGHT_dce7f3};
            width: 100%;
            border-radius: 0;
            font-size: 13px;
            font-weight: 600;
            font-weight: 600;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
            color: ${color._BLUE_VCSC};
            border: 1px solid ${color._BLUE_VCSC};
            &:hover {
                background-color: #cddef0;
                color: ${color._BLUE_VCSC};
                border: 1px solid ${color._BLUE_VCSC};
            }
            &.isActive {
                background-color: ${color._BLUE_VCSC};
                color: ${color._WHITE};
                border: 1px solid ${color._BLUE_VCSC};
                width: 100%;
                border-radius: 0;
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
                &:focus{
                    background-color: ${color._BLUE_VCSC};
                    color: ${color._WHITE};
                    border: 1px solid ${color._BLUE_VCSC};
                    border-top-left-radius: 5px;
                    border-bottom-left-radius: 5px;
                }
                &.sell {
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    background-color: ${color._RED_VCSC};
                    border: 1px solid ${color._RED_VCSC};
                    border-top-right-radius: 5px;
                    border-bottom-right-radius: 5px;
                }
            }
        }

        .btn-tab-sale{
            background-color: #fdf3f2;
            width: 100%;
            border-radius: 0;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            color: ${color._RED_VCSC};
            font-size: 13px;
            font-weight: 600;
            border: 1px solid ${color._RED_VCSC};
            &:hover{
                background-color: ${color._RED_VCSC_HOVER};
                border: 1px solid ${color._RED_VCSC};
                color: ${color._RED_VCSC};
            }
        }
    }
    .isWarning{
        color: ${color._RED_VCSC}!important;
    }
`;

const customSelectOrder = css`
    width: 100%;
	top: 5px;
	color: #333333;
	font-weight: 500;
	font-size: 13px;
    .ant-select-selector{
        border: 1px solid #e3e5ec!important;
        border-radius: 4px!important;
    }
`

const customSelectOrderNumber = css`
    position: relative;
    width: 100%;
	top: 6px;
	color: #333333;
	font-weight: 500;
    font-size: 13px;
    .ant-input-number{
        width: calc(100% - 16px);
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border: 1px solid #e3e5ec;
    }
    .btnMoney{
        left: 2px;
        border-radius: 0;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        font-size: 11px;
        padding: 0 3px;
        top: -2px;
        background-color: #e3e5ec;
        font-weight: 500;
        color: #333333
    }
    .formInputNumber{
        position: absolute;
        top: 30px;
        right: 0;
        background-color: #fff;
        height: 'auto';
        width: 100%;
        border-radius: 5px;
        box-shadow: 0 4px 10px 0 rgba(0, 55, 123, 0.05);
        z-index: 1000;
        &.isBlock{
            display: none
        }
        .ant-list-footer{
            padding-top: 0;
            padding-bottom: 5px;
        }
        .ant-list-header{
            padding-top: 5px;
            padding-bottom: 0;
        }
    }
    .isWarning{
        border: 1px solid ${color._RED_VCSC}!important;
    }
    
`

const customSelectOrderNumberRoot = css`
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

const dataStyle = css`
    .label{
        font-weight: 600;
        color: ${color._GREY_666};
    }
    .datePicker{
        top: 5px;
        width: 100%;
        border: 1px solid ${color._STROKE};
        border-radius: 0.3em;
        color: ${color._BLACK};
        font-weight: 500;
        svg{
            color: ${color._BLACK};
        }
    }
`

const formQuantity = css`
    position: absolute;
    top: 2.1em;
    box-shadow: 0 4px 10px 0 rgba(0, 55, 123, 0.05);
    background-color: #fff;
    width: 100%;
    height: auto;
    z-index: 100;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    font-weight: 500;
    font-size: 14px;
    .ceiling{
        color: ${color._GREEN};
        padding: 0.4em;
        text-align: center;
        cursor: pointer;
        background-color: ${color._GREY_LIGHT_1};
    }
    .floor{
        color: ${color._RED_VCSC};
        padding: 0.4em;
        text-align: center;
        cursor: pointer;
        background-color: ${color._GREY_LIGHT_1};
    }
    .isPriceSuggestion{
        max-height: 20em;
        overflow: auto;
    }
    .styleListStock{
        border: 0;
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
            cursor: pointer;
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
        }
    }
`

const lstTypeOfCommand = (exchange)=>{
    switch(exchange){
        case 'HOSE':
            return ['LO', 'ATO', 'MP', 'ATC'];
        case 'HNX':
            return ['LO', 'MTL', 'ATC', 'MAK', 'MOK', 'PLO'];
        case 'UPCOM':
            return ['LO'];
        default:
            return [];
    }
}

class OrderBuy extends Component{
    constructor(props){
        super(props);
        this.wrapperRef = React.createRef();
        this.wrapperRefPrice = React.createRef();
        this.state = {
            value: 0,
            isSelected: 1,
            accountInfo: JSON.parse(localStorage.getItem('accountInfoKey')),
            userInfo: JSON.parse(localStorage.getItem('userInfoKey')),
            isVisibleMoney: false,
            codeStock: '',
            nameStock: '',
            lstStock: [],
            subNumber: '',
            typeOfOrder: 1, //1: Lệnh thường, 2: Lệnh dừng MP, 3: Lệnh dừng giới hạn, 4: Lệnh đặt trước
            typeCommand: '',
            lstTypeOfCommand: [],
            priceOrder: 0,
            quantity: 0,
            isLoadingBuy: false,
            isWarning: 0,
            isWarningPrice: 0,
            isWarningStop: 0,
            openDiaLog: false,
            stockSellObj: {},
            isOrderQuick: true,
            ceilingPrice: 0,
            floorPrice: 0,
            ceilingPriceE: 0,
            floorPriceE: 0,
            lastPrice: 0,
            priceOrderLimit: 0,
            fromDate: moment(new Date(), dateFormat),
            toDate: moment(new Date(new Date(newDate).setDate(newDate.getDate()+7)), dateFormat),
            isShowSuggestionQuantity: false,
            market: 'HOSE'
        }

        // props.componentEvent.on("changeSubNumber", (subNumber)=>{
        //     this.actionUpdateSubNumber(subNumber);
        //     this.checkAccountBuySellAble();
        // });

        props.componentEvent.on("changeLastStockCode", (obj)=>{
            if(obj){
                this.setState({
                    priceOrder: obj.last,
                    isWarningPrice: 0
                });
                this.checkAccountBuySellAble();
                this.checkPriceOrder(obj.last);
            }
        });
        props.componentEvent.on("changeStockCode", (obj)=>{
            if(obj){
                this.setState({
                    lastPrice: obj.lastReal,
                    ceilingPrice: obj.ceilingPrice,
                    floorPrice: obj.floorPrice,
                    market: obj.market
                });
            }
        });
        props.componentEvent.on("estimatedData", (obj)=>{
            try {
                if(obj){
                    this.setState({
                        ceilingPriceE: obj.ceilingPriceE,
                        floorPriceE: obj.floorPriceE
                    });
                }
            } catch (error) {
                
            }
        });
        props.componentEvent.on("changeQuantitySell", (obj)=>{
            this.setState({
                quantity: common.roundingNumber(this.state.market, obj.quantity)
            });
            this.optionOrder(2);
        });

        this.props_master = this.props;
    }

    componentWillMount(){
        const op = JSON.parse(localStorage.getItem('rememberOrderQuick'));
        if(op !== null){
            this.setState({isOrderQuick: op});
        }
        const typeOfOrder = JSON.parse(localStorage.getItem('rememberTypeOfOrder'));
        if(typeOfOrder){
            this.setState({typeOfOrder: typeOfOrder});
        }
        document.removeEventListener('click', this.handleClick);
    }

    componentWillUnmount(){
        // this.props_master.componentEvent.stop();
    }

    componentDidUpdate(prev){
        try {
            if(prev.codeStock !== this.props.codeStock){
                const lstStock = [...this.props.lstStockIndex];
                const idx = lstStock.findIndex(x => x.s === this.props.codeStock);
                if(idx > -1){
                    const lstTmp = lstTypeOfCommand(lstStock[idx].m);
                    this.setState({lstTypeOfCommand : lstTmp, typeCommand: lstTmp[0], nameStock: lstStock[idx].n1});
                }
                this.setState({codeStock: this.props.codeStock, lstStock: this.props.lstStockIndex});
            }
            if(this.props.subNumberChange && prev.subNumberChange !== this.props.subNumberChange){
                this.actionUpdateSubNumber(this.props.subNumberChange);
                //reload lại lịch sử giao dịch của tiểu khoản
                this.props._onReloadOrderHistory();
                this.checkAccountBuySellAble();
            }
        } catch (error) {
            
        }
    }

    async componentDidMount(){
        const{
            accountInfo
        } = this.state;

        if(accountInfo){
            await this.setState({subNumber: accountInfo.userInfo.accounts[0].accountSubs[0].subNumber});
            await this.getBankAccountInv();
        }

        let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
        if (obj) {
            if(obj.CODE_STOCK){
                this.setState({ codeStock: obj.CODE_STOCK});
            }
            if(obj.SUB_NUMBER){
                this.setState({ subNumber: obj.SUB_NUMBER });
            }
        }
        document.addEventListener('click', this.handleClick);
    }

    handleClick = (event) => {
        if(this.wrapperRef.current){
            const { target } = event;
            if (!this.wrapperRef.current.contains(target)) {
                this.setState({isShowSuggestionQuantity: false});
            }
            if (!this.wrapperRefPrice.current.contains(target)) {
                this.setState({isVisibleMoney: false});
            }
        }
    }

    _handleKeyDown = (e)=>{
        if (e.key === 'Tab' || e.key === 'Escape') {
            this.setState({ isShowSuggestionQuantity: false, isVisibleMoney: false });
        }
    }

    onQuantitySuggest = (value)=>{
        this.setState({isShowSuggestionQuantity: false, quantity: value, isWarning: 0});
        this.checkQuantityOdd(value);
    }

    onPriceSuggest = (value)=>{
        this.setState({isVisibleMoney: false, priceOrder: value, isWarningPrice: 0});
        this.checkPriceOrder(value);
    }

    onSuggestionQuantity = ()=>{
        this.setState({isShowSuggestionQuantity: true});
    }

    shortcutQuantity = (value)=>{
        this.setState({quantity: value});
    }

    handleChange = (event, newValue) => {
        this.setState({value: newValue});
    };

    onClickIconAction = (stt)=> {
        this.setState({key: stt});
    }

    optionOrder = async(option)=>{
        const {
            isSelected,
            priceOrder
        } = this.state;
        if(option !== isSelected){
            await this.setState({isSelected: option, isWarning: 0});
            this.checkAccountBuySellAble();
            this.checkPriceOrder(priceOrder);
        }
    }

    activeModalMoney = ()=>{
        this.setState( prevState => ({
            isVisibleMoney: !prevState.isVisibleMoney
        }));
    }

    updateInputDate = name => async(value)=>{
        const {
            priceOrder
        } = this.state;
        this.setState({[name]: value, isWarningPrice: 0});
        await this.checkPriceOrder(priceOrder);
    }

    updateSelectValue = name => async(event)=>{
        const {
            subNumber,
            codeStock,
            priceOrder
        } = this.state;
        
        this.setState({isWarning: 0});
        if(name === 'codeStock'){
            socket.disconectChanel(codeStock);
            this.props._onChangeCodeStock(event);
            storage.rememberSectionOrder(JSON.stringify({CODE_STOCK: event, SUB_NUMBER: subNumber}));
        }

        //check account buy able
        if(name === 'subNumber' || name === 'codeStock' || name === 'priceOrder' || name === 'quantity'){
            this.checkAccountBuySellAble();
        }
        if(name === 'quantity'){
            this.setState({isShowSuggestionQuantity: true});
            this.checkQuantityOdd(event);
        }
        if(name === 'priceOrder'){
            this.setState({isWarningPrice: 0});
            this.checkPriceOrder(event);
        }

        if(name === 'typeOfOrder'){
            storage.rememberTypeOfOrder(JSON.stringify(event));
            this.setState({isWarningPrice: 0});
            this.checkPriceOrder(priceOrder);
        }
        if(name === 'priceOrderLimit'){
            this.setState({isWarningStop: 0});
        }

        if(name === 'typeCommand'){
            if(event !== 'LO'){
                this.setState({isWarningPrice: 0, isWarningStop: 0});
            }else{
                this.checkPriceOrder(priceOrder);
            }
        }
        await this.setState({[name]: event});
    }

    checkSellAble = (stockCode)=>{
        this.setState({stockSellObj: {}});
        const lstStockSell = [...this.props.accountSellAble];
        const idx = lstStockSell.findIndex(item => item.stockCode === stockCode);
        if(idx > -1){
            this.setState({stockSellObj: lstStockSell[idx]});
        }
    }

    onChangeOrderQuick = (checked)=>{
        this.setState({isOrderQuick: !checked});
        storage.rememberOrderQuick(JSON.stringify(!checked));
    }

    updateSubNumberValue = async(event)=>{
        //Gửi sự kiện change subNumber
        // this.props_master.componentEvent.fire("changeSubNumber", true, event);
        this.props.dispatch({
            type: 'SUB_NUMBER',
            data: event
        });
        await this.actionUpdateSubNumber(event);
        //reload lại lịch sử giao dịch của tiểu khoản
        this.props._onReloadOrderHistory();
        this.checkAccountBuySellAble();
    }

    actionUpdateSubNumber = async (event)=>{
        const {
            subNumber,
            codeStock
        } = this.state;

        if(subNumber === '00' || subNumber === '01' || subNumber === '02'){
            if(event === '80'){
                let lstDerivative = this.props.lstStock.length > 0 ? this.props.lstStock.filter(item => item.t === 'FUTURES') : [];
                if(lstDerivative.length > 0){
                    this.props._onChangeCodeStock(lstDerivative[0].s);
                    storage.rememberSectionOrder(JSON.stringify({CODE_STOCK: lstDerivative[0].s, SUB_NUMBER: event}));
                }
                this.props._onChangeListStock(lstDerivative);
            }else{
                storage.rememberSectionOrder(JSON.stringify({CODE_STOCK: codeStock, SUB_NUMBER: event}));
            }
        }else{
            if(event === '00' || event === '01' || subNumber === '02'){
                let lstDerivative = this.props.lstStock.length > 0 ? this.props.lstStock.filter(item => item.t === 'STOCK') : [];
                if(lstDerivative.length > 0){
                    this.props._onChangeCodeStock(lstDerivative[0].s);
                    storage.rememberSectionOrder(JSON.stringify({CODE_STOCK: lstDerivative[0].s, SUB_NUMBER: event}));
                }
                this.props._onChangeListStock(lstDerivative);
            }else{
                storage.rememberSectionOrder(JSON.stringify({CODE_STOCK: codeStock, SUB_NUMBER: event}));
            }
        }
        await this.setState({subNumber: event, isWarning: 0});
    }

    getBankAccountInv = async()=> {
        const {
            accountInfo,
            subNumber
        } = this.state;
        try {
            await this.props.getBankAccount({
                accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                subNumber: subNumber
            });
        } catch (error) {
            
        }
    }

    checkPriceOrder = debounce(async(eventReceived)=> {
        try {
            const{
                ceilingPrice,
                floorPrice,
                lastPrice,
                typeOfOrder,
                isSelected,
                fromDate,
                typeCommand,
                // market
            } = this.state;

            // let arr = common.renderPriceSuggestion({
            //     last: lastPrice,
            //     ceilingPrice: ceilingPrice,
            //     floorPrice: floorPrice,
            //     market: market
            // });
            if(typeCommand === 'LO'){
                let event = eventReceived;
                if(eventReceived === '' || eventReceived === null || eventReceived === undefined){
                    event = 0;
                }
                if(typeOfOrder === 1 || typeOfOrder === 4){
                    if(parseFloat(event) < floorPrice){
                        //this.setState({isWarningPrice: 2}); //Giá thấp hơn giá sàn
                    }else if(parseFloat(event) > ceilingPrice){
                        //this.setState({isWarningPrice: 3}); //Giá cao hơn giá trần
                    }else{
                        // let isInvalid = arr.findIndex(o => o.value === eventReceived);
                        // if(isInvalid < 0){
                        //     this.setState({isWarningPrice: 6}); //Giá không thuộc bước giá
                        // }
                    }
                }else{
                    if(typeOfOrder === 2 || typeOfOrder === 3){
                        if(common.compareTwoDate(fromDate, new Date()) === 1){
                            if(parseFloat(event) <= lastPrice && isSelected === 1){
                                this.setState({isWarningPrice: 4});  //Giá dừng mua phải lớn hơn giá hiện tại
                            }
                            if(parseFloat(event) >= lastPrice && isSelected === 2){
                                this.setState({isWarningPrice: 5});  //Giá dừng bán phải nhỏ hơn giá hiện tại
                            }
                        }
                    }
                }
            }
        } catch (error) {
            
        }
    }, 500);

    checkAccountBuySellAble = debounce(async()=> {
        try {
            const {
                accountInfo,
                subNumber,
                priceOrder,
                quantity,
                isSelected,
                codeStock
            } = this.state;

            if(subNumber && priceOrder > 0){
                if(isSelected === 1){
                    await this.props.getAccountBuyAble({
                        accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                        orderPrice: priceOrder || 0,
                        orderQuantity: quantity || 0,
                        subNumber: subNumber
                    });
                }
                if(isSelected === 2){
                    await this.props.getAccountSellAble({
                        accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                        orderPrice: priceOrder || 0,
                        subNumber: subNumber
                    });
                    this.checkSellAble(codeStock);
                }
            }
        } catch (error) {
            
        }
    }, 500);

    checkQuantityOdd = debounce((value)=> {
        try {
            const {
                market
            } = this.state;
            if(market === 'HOSE'){
                if(value < 10){
                    this.setState({isWarning: 3}); //cảnh báo lô lẻ
                }
            }else{
                if(value < 100){
                    this.setState({isWarning: 3}); //cảnh báo lô lẻ
                }
            }
        } catch (error) {
            
        }
    }, 500);
    
    onHandleBuy = async(typeSelect)=>{
        const {
            quantity,
            stockSellObj,
            isOrderQuick,
            isWarningPrice,
            typeOfOrder,
            priceOrderLimit,
            typeCommand,
            market
        } = this.state;
        let pass = true;
        // storage.removeQuantitySuggestion();
        const accountBuyAble = this.props.accountBuyAble;
        let maxQuantity = 0;
        if(typeSelect === 1 && accountBuyAble.buyableQuantity){
            maxQuantity = accountBuyAble.buyableQuantity;
        }
        if(typeSelect === 2 && stockSellObj){
            maxQuantity = stockSellObj.sellableQuantity;
        }
        
        if(typeOfOrder === 1 || typeOfOrder === 4){
            if(quantity <= 0 || quantity > maxQuantity || !maxQuantity){
                this.setState({isWarning: 1});
                pass = false;
            }else{
                if(typeCommand !== 'LO'){ //Nếu khác lệnh LO thì ko cần chặn giá
                    pass = true;
                }else{
                    if(isWarningPrice !== 0){
                        pass = false;
                    }
                }
            }
        }else{
            if(typeOfOrder === 2 || typeOfOrder === 3){
                if(typeCommand !== 'LO'){ //Nếu khác lệnh LO thì ko cần chặn giá
                    pass = true;
                }else{
                    if(isWarningPrice !== 0){
                        pass = false;
                    }else if(typeOfOrder === 3){
                        if(priceOrderLimit <= 0){
                            pass = false;
                            this.setState({isWarningStop: 1});
                        }
                    }
                }
            }
        }

        if(pass){
            let arrPriceSuggest = common.rememberSuggestQuantity(quantity);
            if(market === 'HOSE' && quantity > 500000){
                common.notify("warning", "Số lượng không được vượt quá 500.000 đối với cổ phiếu sàn HOSE");
            }else{
                storage.rememberQuantitySuggestion(JSON.stringify(arrPriceSuggest || null));
                if(isOrderQuick){ //cần xác nhận mới được đặt mua, bán
                    this.setState({openDiaLog: true});
                }else{
                    this.actionOrderApi(typeOfOrder);
                }
            }
        }
    }

    actionOrderApi = async(typeOfOrder) => {
        const {
            accountInfo,
            codeStock,
            subNumber,
            quantity,
            priceOrder,
            priceOrderLimit,
            typeCommand,
            isSelected,
            fromDate,
            toDate,
            userInfo
        } = this.state;

        try {
            const accountBank = this.props.bankAccount.length > 0 ? this.props.bankAccount[0] : [];
            let typeBuySell = 'BUY';
            if(isSelected === 2){
                typeBuySell = 'SELL';
            }
            this.setState({isLoadingBuy: true});
            const data = {
                "accountNumber": accountInfo.userInfo.accounts[0].accountNumber,
                "subNumber": subNumber,
                "orderQuantity":quantity,
                "orderPrice": priceOrder || 0,
                "stockCode": codeStock,
                "bankCode": accountBank.bankCode || '',
                "bankName": accountBank.bankName || '',
                "bankAccount": accountBank.bankAccount || '',
                "sellBuyType": typeBuySell,
                "orderType": typeCommand,
                "securitiesType": "STOCK"
            }
            if(typeOfOrder === 1){  //Đặt lệnh thường
                const res = await this.props.equityOrder(data);
                if(res.type === 'EQUITY_ORDER.LIST'){
                    this.setState(
                        {
                            isLoadingBuy: false,
                            openDiaLog: false,
                            quantity: 0
                        });
                    this.checkAccountBuySellAble();
                    this.props._onReloadOrderHistory();
                    common.notify("success", <span>
                        Đặt {typeBuySell === 'BUY' ? 'mua' : 'bán'} lệnh thường thành công!!!<br />
                        {typeBuySell === 'BUY' ? 'Mua' : 'Bán'} {quantity}&nbsp;{codeStock}&nbsp;giá&nbsp;{{
                            'LO': `${common.convertTextDecimal(priceOrder)}`,
                            'ATO': 'ATO',
                            'MP': 'MP',
                            'ATC': 'ATC',
                            'MTL': 'MTL',
                            'MAK': 'MAK',
                            'MOK': 'MOK',
                            'PLO': 'PLO'
                        }[typeCommand]}
                    </span>);
                    try {
                        this.props.indexLogs({...data, type: 'normal'});
                    } catch (error) {
                        
                    }
                }
            }
            if(typeOfOrder === 2 || typeOfOrder === 3){ //Đặt lệnh dừng MP và dừng giới hạn
                let dataStop = {
                    ...data,
                    orderType: typeOfOrder === 2 ? 'STOP' : 'STOP_LIMIT',
                    stopPrice: priceOrder || 0,
                    fromDate: common.dateToYYYYMMDD(fromDate),
                    toDate: common.dateToYYYYMMDD(toDate)
                }
                if(typeOfOrder === 3){
                    dataStop = {
                        ...dataStop,
                        orderPrice: priceOrderLimit
                    }
                }
                const res = await this.props.equityOrderStop(dataStop);
                if(res.type === 'EQUITY_ORDER_STOP.POST'){
                    this.setState(
                        {
                            isLoadingBuy: false,
                            openDiaLog: false,
                            quantity: 0,
                            priceOrderLimit: 0
                        });
                    this.checkAccountBuySellAble();
                    this.props._onReloadOrderHistory();
                    common.notify("success", <span>
                        Đặt {typeBuySell === 'BUY' ? 'mua' : 'bán'} lệnh dừng {{2: 'MP', 3: 'giới hạn'}[typeOfOrder]} thành công!!!<br />
                        {typeBuySell === 'BUY' ? 'Mua' : 'Bán'} {quantity}&nbsp;{codeStock}&nbsp;giá&nbsp;{{
                            'LO': {priceOrder},
                            'ATO': 'ATO',
                            'MP': 'MP',
                            'ATC': 'ATC',
                            'MTL': 'MTL',
                            'MAK': 'MAK',
                            'MOK': 'MOK',
                            'PLO': 'PLO'
                        }[typeCommand]}
                    </span>);
                    try {
                        this.props.indexLogs({...dataStop, type: 'stop'});
                    } catch (error) {
                        
                    }
                }
            }
            if(typeOfOrder === 4){  //Đặt lệnh trước
                let dataAdvance = {
                    ...data,
                    phoneNumber: userInfo.phoneNumber,
                    // advanceOrderDate: common.dateToYYYYMMDD(new Date())
                }
                const res = await this.props.equityOrderAdvance(dataAdvance);
                if(res.type === 'EQUITY_ORDER_ADVANCE.POST'){
                    this.setState(
                        {
                            isLoadingBuy: false,
                            openDiaLog: false,
                            quantity: 0
                        });
                    this.checkAccountBuySellAble();
                    this.props._onReloadOrderHistory();
                    common.notify("success", <span>
                        Đặt {typeBuySell === 'BUY' ? 'mua' : 'bán'} lệnh trước thành công!!!<br />
                        {typeBuySell === 'BUY' ? 'Mua' : 'Bán'} {quantity}&nbsp;{codeStock}&nbsp;giá&nbsp;{{
                            'LO': {priceOrder},
                            'ATO': 'ATO',
                            'MP': 'MP',
                            'ATC': 'ATC',
                            'MTL': 'MTL',
                            'MAK': 'MAK',
                            'MOK': 'MOK',
                            'PLO': 'PLO'
                        }[typeCommand]}
                    </span>);
                    try {
                        this.props.indexLogs({...dataAdvance, type: 'advance'});
                    } catch (error) {
                        
                    }
                }
            }
        } catch (error) {
            this.setState({isLoadingBuy: false});
        }
    }

    _onCloseDialog = ()=>{
        this.setState({openDiaLog: false});
    }

    disabledDate = (current)=> {
        let d = moment(new Date()).add(-1, 'day');
        return current && current < d.endOf('day');
    }

    render(){
        const {
            isSelected,
            accountInfo,
            isVisibleMoney,
            codeStock,
            subNumber,
            typeOfOrder,
            typeCommand,
            lstTypeOfCommand,
            priceOrder,
            priceOrderLimit,
            lstStock,
            quantity,
            isLoadingBuy,
            isWarning,
            openDiaLog,
            stockSellObj,
            isOrderQuick,
            nameStock,
            isWarningPrice,
            fromDate,
            toDate,
            isWarningStop,
            ceilingPriceE,
            ceilingPrice,
            lastPrice,
            floorPrice,
            floorPriceE,
            isShowSuggestionQuantity,
            market
        } = this.state;
        //00: -TK: thường, 01: TK margin, 80: TK phái sinh
        const lstSubNumber = accountInfo ? accountInfo.userInfo.accounts[0].accountSubs : [];

        const accountBuyAble = this.props.accountBuyAble;
        const accountSellAble = this.props.accountSellAble;

        return(
            <Row>
                <Dialog 
                    data={{
                        COMMAND: isSelected,
                        STOCK_CODE: codeStock,
                        NAME_STOCK: nameStock,
                        TYPE_COMMAND: typeCommand,
                        QUANTITY: quantity,
                        PRICE_ORDER: priceOrder,
                        FROMDATE: fromDate,
                        TODATE: toDate,
                        TYPEOFORDER: typeOfOrder,
                        PRICEORDER_LIMIT: priceOrderLimit
                    }}
                    config={{
                        isOpen: openDiaLog,
                        isLoading: isLoadingBuy
                    }}
                    onActionBuy={this.actionOrderApi}
                    onClose={this._onCloseDialog}
                />
                <div className={mainOrder}>
                    <Row style={styles.rootOrder} gutter={10}>
                        <Col span={12} className="p-top5">
                            <Select
                                className={customSelectOrder}
                                style={{top: 0}}
                                showSearch
                                value={typeOfOrder}
                                optionFilterProp="children"
                                onChange={this.updateSelectValue('typeOfOrder')}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value={1}>Lệnh thường</Option>
                                <Option value={2}>Lệnh dừng MP</Option>
                                <Option value={3}>Lệnh dừng G.Hạn</Option>
                                <Option value={4}>Lệnh đặt trước</Option>
                            </Select>
                        </Col>
                        <Col span={12} className="btnHeaderComponent p-top5">
                            <Row>
                                <Col span={12}>
                                    <Button className={isSelected === 1 ? "btn-tab-order isActive" : "btn-tab-order"} onClick={()=>this.optionOrder(1)}>
                                        MUA
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button className={isSelected === 2 ? "btn-tab-order isActive sell" : "btn-tab-sale"} onClick={()=>this.optionOrder(2)}>
                                        BÁN
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                       
                        <List style={{width: '100%'}} split={false}>
                            <List.Item className="p-top10">
                                <Col span={12}>
                                    <span style={styles.labelTitle}>
                                        Tiểu khoản
                                    </span> <br />
                                    <Select
                                        className={customSelectOrder}
                                        showSearch
                                        placeholder="Chọn tiểu khoản"
                                        value={subNumber}
                                        onChange={this.updateSubNumberValue}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {lstSubNumber.length > 0 ? lstSubNumber.map((item, idx)=>{
                                            return(
                                                <Option key={idx} value={item.subNumber}>
                                                    {`${item.subNumber} (${item.subNumber === '00' ? 'Thường' : (item.subNumber === '01' ? 'Margin' : 'Phái sinh')})`}
                                                </Option>
                                            )
                                        }) 
                                    : null}
                                    </Select>
                                </Col>
                                <Col span={12}>
                                    {
                                        isSelected === 1 ? 
                                            <div>
                                                <span style={{...styles.labelTitle, ...{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}}>
                                                    Sức mua&nbsp;
                                                    <Tooltip placement="bottomRight" overlayStyle={{width: '100%', lineHeight: 2, fontWeight: 500}} title={
                                                        <span style={{fontSize: '0.8em'}}>
                                                            <div style={{fontWeight: 600, fontSize: 13}}>
                                                                Thông tin sức mua
                                                            </div>
                                                            <div className="p-top10">
                                                                <Row>
                                                                    <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                        Tài sản định giá
                                                                    </Col>
                                                                    <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                        {common.convertTextDecimal(accountBuyAble.assetValuationAmount)}
                                                                    </Col>
                                                                    <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                        Tiền gửi
                                                                    </Col>
                                                                    <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                        {common.convertTextDecimal(accountBuyAble.depositAmount)}
                                                                    </Col>
                                                                    <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                        Sức mua
                                                                    </Col>
                                                                    <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                        {common.convertTextDecimal(accountBuyAble.buyingPower)}
                                                                    </Col>
                                                                    <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                        Bảo lãnh
                                                                    </Col>
                                                                    <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                        {common.convertTextDecimal(accountBuyAble.virtualDepositAmount)}
                                                                    </Col>
                                                                    <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                        Hạn mức margin
                                                                    </Col>
                                                                    <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                        {common.convertTextDecimal(accountBuyAble.marginLimitation)}
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </span>}
                                                    >
                                                        <img alt="" width="16px" src="/icon/ic_information.svg"/>
                                                    </Tooltip>
                                                </span>
                                                <span style={{color: color._BLACK, fontSize: 15, fontWeight: 600, display: 'flex', justifyContent: 'flex-end', paddingTop: 10}}>
                                                    {common.convertTextDecimal(accountBuyAble.buyingPower || 0)}
                                                </span>
                                            </div>
                                        :
                                            <div>
                                                <span style={{...styles.labelTitle, ...{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}}>
                                                    SL có thể bán&nbsp;
                                                    <Tooltip placement="bottomRight" overlayStyle={{width: '100%', lineHeight: 2, fontWeight: 500}} title={<span style={{fontSize: '0.8em'}}>
                                                        <div style={{fontWeight: 600, fontSize: 13}}>
                                                            Thông tin Tài Khoản
                                                        </div>
                                                        <div className="p-top10">
                                                            <Row>
                                                                <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                    Mã CK
                                                                </Col>
                                                                <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                    {codeStock}
                                                                </Col>
                                                                <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                    Số dư CK
                                                                </Col>
                                                                <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                    {common.convertTextDecimal(stockSellObj.balanceQuantity)}
                                                                </Col>
                                                                <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                    KL có thể bán
                                                                </Col>
                                                                <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                    {common.convertTextDecimal(stockSellObj.sellableQuantity)}
                                                                </Col>
                                                                <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                    CK mua T1
                                                                </Col>
                                                                <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                    {common.convertTextDecimal(stockSellObj.todayBuy)}
                                                                </Col>
                                                                <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                    CK bán T1
                                                                </Col>
                                                                <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                    {common.convertTextDecimal(stockSellObj.todaySell)}
                                                                </Col>
                                                                <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                    CK mua T2
                                                                </Col>
                                                                <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                    {common.convertTextDecimal(stockSellObj.t1Buy)}
                                                                </Col>
                                                                <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                    CK bán T2
                                                                </Col>
                                                                <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                    {common.convertTextDecimal(stockSellObj.t1Sell)}
                                                                </Col>
                                                                <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                    CK mua T3
                                                                </Col>
                                                                <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                    {common.convertTextDecimal(stockSellObj.t2Buy)}
                                                                </Col>
                                                                <Col span={12} style={{color: 'rgba(255, 255, 255, 0.6)'}}>
                                                                    CK bán T3
                                                                </Col>
                                                                <Col span={12} style={{textAlign: 'right', fontWeight: 600}}>
                                                                    {common.convertTextDecimal(stockSellObj.t2Sell)}
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                        </span>}
                                                    >
                                                        <img alt="" width="16px" src="/icon/ic_information.svg"/>
                                                    </Tooltip>
                                                </span>
                                                <span style={{color: color._BLACK, fontSize: 15, fontWeight: 600, display: 'flex', justifyContent: 'flex-end', paddingTop: 10}}>
                                                    {common.convertTextDecimal(stockSellObj.sellableQuantity || 0)}
                                                </span>
                                            </div>
                                    }
                                </Col>
                            </List.Item>    
                            {
                                isSelected === 1 ? 
                                    <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                        <span style={styles.labelTitle}>
                                            Mã Cổ phiếu
                                        </span> <br />
                                        <Select
                                            className={customSelectOrder}
                                            showSearch
                                            placeholder="Chọn mã cổ phiếu"
                                            onChange={this.updateSelectValue('codeStock')}
                                            value={codeStock}
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
                                    </List.Item>
                                :
                                    <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                        <span style={styles.labelTitle}>
                                            Mã Cổ phiếu
                                        </span> <br />
                                        <Select
                                            className={customSelectOrder}
                                            showSearch
                                            placeholder="Chọn mã cổ phiếu"
                                            onChange={this.updateSelectValue('codeStock')}
                                            value={codeStock}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {accountSellAble.length > 0 ? accountSellAble.map((item, idx)=>{
                                                return(
                                                    <Option key={idx} value={item.stockCode}>
                                                        {item.stockCode}
                                                    </Option>
                                                )
                                            }) 
                                            : null}
                                        </Select>
                                    </List.Item>
                            }

                            <List.Item>
                                <Col span={12}>
                                    <span style={styles.labelTitle} className={([2,3,4,5].includes(isWarningPrice) === true) ? "isWarning" : ""}>
                                        {(typeOfOrder === 2 || typeOfOrder === 3) ? 'Giá dừng' : 'Giá'}
                                    </span> <br />
                                    <span className={customSelectOrderNumber} ref={this.wrapperRefPrice}
                                        onKeyDown={this._handleKeyDown}>
                                        <InputNumber 
                                            className={([2,3,4,5].includes(isWarningPrice) === true) ? "isWarning" : ""}
                                            min={0} 
                                            value={priceOrder}
                                            onChange={this.updateSelectValue("priceOrder")}
                                            formatter={value => common.formatterNumber(value)}
                                            parser={value => common.parserNumber(value)}
                                            step={common.stepPriceForExchanges({market: market, last: priceOrder})}
                                            // step={market === 'HOSE' ? 10 : 100}
                                        />
                                        <Button className="btnMoney" onClick={this.activeModalMoney}>đ</Button>
                                        {isVisibleMoney ? <div className={formQuantity}>
                                            <div className="ceiling" onClick={()=> this.onPriceSuggest(ceilingPrice)}>
                                                CE: {common.convertTextDecimal(ceilingPrice)}
                                            </div>
                                            {
                                                (() => {
                                                    let arr = common.renderPriceSuggestion({
                                                        last: lastPrice,
                                                        ceilingPrice: ceilingPrice,
                                                        floorPrice: floorPrice,
                                                        market: market
                                                    });
                                                    return arr.length > 0 ? <List
                                                        size="small"
                                                        bordered
                                                        split={false}
                                                        dataSource={arr}
                                                        className="styleListStock isPriceSuggestion"
                                                        renderItem={(item, idx) => 
                                                        <List.Item className="item" style={{color: `${item.color}`}} onClick={()=> this.onPriceSuggest(item.value)}>
                                                            <Col span={11} style={{textAlign: 'right'}}>
                                                                {common.convertTextDecimal(item.value)}
                                                            </Col>
                                                            <Col span={12} style={{textAlign: 'right'}}>
                                                                {item.ratio}%
                                                            </Col>
                                                        </List.Item>}
                                                    />
                                                : null
                                                })()
                                            }
                                            <div className="floor" onClick={()=> this.onPriceSuggest(floorPrice)}>
                                                FL: {common.convertTextDecimal(floorPrice)}
                                            </div>
                                        </div> : null}
                                        <div style={{position: 'relative'}}>
                                            {
                                                [2,3,4,5,6].includes(isWarningPrice) === true ? 
                                                    <span style={{fontSize: 11, color: color._RED_VCSC, position: 'absolute', left: 0, width: 'max-content'}}>
                                                        {
                                                            (() => {
                                                                switch(isWarningPrice) {
                                                                    case 2:
                                                                        return 'Giá phải lớn hơn giá sàn';
                                                                    case 3: 
                                                                        return 'Giá phải thấp hơn giá trần';
                                                                    case 4:
                                                                        return 'Giá dừng mua phải lớn hơn giá hiện tại';
                                                                    case 5:
                                                                        return 'Giá dừng bán phải nhỏ hơn giá hiện tại';
                                                                    case 6:
                                                                        return 'Bước giá không hợp lệ';
                                                                    default: 
                                                                        return null;
                                                                }
                                                            })()
                                                        }
                                                    </span>
                                                    : 
                                                    ((typeOfOrder === 2 || typeOfOrder === 3) ?
                                                        (
                                                            <div style={{fontSize: 11, color: color._ORANGE, position: 'absolute', left: 0, width: 'max-content', fontWeight: 600}}>
                                                                {`Lệnh kích hoạt khi Giá tt ${isSelected === 1 ? '>=' : '<='} ${priceOrder}`}
                                                            </div>
                                                        )
                                                    : null
                                                    )
                                            }
                                        </div>
                                    </span>
                                </Col>
                                
                                <Col span={12}>
                                    {(typeOfOrder === 2 || typeOfOrder === 3) ?
                                        (
                                            typeOfOrder === 3 ? 
                                            <div>
                                                <span style={styles.labelTitle}>
                                                    Giá giới hạn
                                                </span> <br />
                                                <span className={customSelectOrderNumberRoot}>
                                                    <InputNumber 
                                                        className={(isWarning === 2 || isWarning === 3) ? "isWarning" : ""}
                                                        min={0} 
                                                        value={priceOrderLimit}
                                                        onChange={this.updateSelectValue("priceOrderLimit")}
                                                        formatter={value => common.formatterNumber(value)}
                                                        parser={value => common.parserNumber(value)}
                                                        // step={market === 'HOSE' ? 10 : 100}
                                                        step={common.stepPriceForExchanges({market: market, last: priceOrderLimit})}
                                                    />
                                                    {/* <Button className="btnMoney" onClick={this.activeModalMoney}>đ</Button> */}
                                                    <div style={{position: 'relative'}}>
                                                        <span style={{fontSize: 11, color: color._RED_VCSC, position: 'absolute', right: 0, width: 'max-content'}}>
                                                            {isWarningStop === 1 ? "Giá giới hạn phải lớn 0" : null}
                                                        </span>
                                                    </div>
                                                </span>
                                            </div>
                                            : null
                                        )
                                        :
                                        <div>
                                            <span style={styles.labelTitle}>
                                                Kiểu lệnh
                                            </span> <br />
                                            <Select
                                                className={customSelectOrder}
                                                showSearch
                                                value={typeCommand}
                                                onChange={this.updateSelectValue('typeCommand')}
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {lstTypeOfCommand.length > 0 ? lstTypeOfCommand.map((item, idx)=>{
                                                    return(
                                                        <Option key={idx} value={item}>
                                                            {item}
                                                        </Option>
                                                    )
                                                }) 
                                            : null}
                                            </Select>
                                        </div>
                                    }
                                </Col>
                            </List.Item>
                            
                            <List.Item>
                                <Col span={12}>
                                    <span style={styles.labelTitle} className={isWarning === 1 ? "isWarning" : ''}>
                                        Số lượng
                                    </span> <span style={{fontSize: 13}} className={isWarning === 1 ? "isWarning" : ''}>(Tối đa <span style={{cursor: 'pointer'}}
                                        onClick={()=>this.shortcutQuantity(isSelected === 1 ? common.roundingNumber(market, accountBuyAble.buyableQuantity || 0) : common.roundingNumber(market, stockSellObj.sellableQuantity || 0))}>
                                        {
                                            isSelected === 1 ? 
                                                common.convertTextDecimal(common.roundingNumber(market, accountBuyAble.buyableQuantity || 0))
                                                : common.convertTextDecimal(common.roundingNumber(market, stockSellObj.sellableQuantity || 0))
                                        }
                                        </span>
                                    )</span><br />
                                    <span 
                                        className={customSelectOrderNumberRoot} 
                                        ref={this.wrapperRef}
                                        onKeyDown={this._handleKeyDown}
                                    >
                                        <InputNumber 
                                            min={0}
                                            value={quantity}
                                            className={isWarning === 1 ? "isWarning" : ''}
                                            onChange={this.updateSelectValue("quantity")}
                                            formatter={value => common.formatterNumber(value)}
                                            parser={value => common.parserNumber(value)}
                                            step={10}
                                            onClick={this.onSuggestionQuantity}
                                        />
                                        {isShowSuggestionQuantity ? <div className={formQuantity}>
                                            {
                                                (() => {
                                                    let arr = common.suggestionNumberQuantity(quantity);
                                                    return arr.length > 0 ? <List
                                                        size="small"
                                                        bordered
                                                        split={false}
                                                        dataSource={arr}
                                                        className="styleListStock"
                                                        renderItem={(item, idx) => 
                                                        <List.Item className="item" onClick={()=> this.onQuantitySuggest(item)}>
                                                            {common.convertTextDecimal(item)}
                                                        </List.Item>}
                                                    />
                                                : null
                                                })()
                                        }
                                        </div> : null}
                                        {isWarning === 1 ? 
                                            <span style={{fontSize: 11, color: color._RED_VCSC}}>{quantity <= 0 ? 'Số lượng mua không hợp lệ' : 'Vượt quá số lượng tối đa'}</span> 
                                            : (isWarning === 3 ? <span style={{fontSize: 11, color: color._ORANGE}}>Quý khách đang đặt lệnh với lô lẻ</span> : null)}
                                    </span>
                                </Col>
                                <Col span={12} style={{wordWrap: 'break-word'}}>
                                    <span style={{...styles.labelTitle, ...{display: 'flex', justifyContent: 'flex-end'}}}>
                                        Giá trị giao dịch
                                    </span>
                                    <span 
                                        style={{color: color._BLACK, fontSize: 15, fontWeight: 600, display: 'flex', justifyContent: 'flex-end'}}
                                    >
                                        {common.convertTextDecimal(priceOrder*quantity)}
                                    </span>
                                </Col>
                            </List.Item>
                            {(typeOfOrder === 2 || typeOfOrder === 3) ?
                                <List.Item className={dataStyle}>
                                    <Col span={12}>
                                        <span style={styles.labelTitle}>
                                            Từ ngày
                                        </span> <br />
                                        <DatePicker 
                                            disabledDate={this.disabledDate} 
                                            className="datePicker" 
                                            onChange={this.updateInputDate('fromDate')} 
                                            format={dateFormat} 
                                            value={fromDate}
                                        />
                                    </Col>
                                    <Col span={12} className="p-left10">
                                        <span style={styles.labelTitle}>
                                            Đến ngày
                                        </span> <br />
                                        <DatePicker 
                                            className="datePicker" 
                                            onChange={this.updateInputDate('toDate')} 
                                            format={dateFormat} 
                                            value={toDate}
                                        />
                                    </Col>
                                </List.Item>
                                : null
                            }

                            {typeOfOrder === 4 ?
                                <div>
                                    <List.Item className={dataStyle}>
                                        <Col span={12}>
                                            <span style={styles.labelTitle}>
                                                Ước tính CE
                                            </span> <br />
                                            <div style={{fontSize: 15, fontWeight: 600, color: color._BLUE_VCSC}}>
                                                {common.convertTextDecimal(ceilingPriceE)}
                                            </div>
                                        </Col>
                                        <Col span={12} className="p-left10">
                                            <span style={styles.labelTitle}>
                                                Ước tính FL
                                            </span> <br />
                                            <div style={{fontSize: 15, fontWeight: 600, color: color._RED_VCSC}}>
                                                {common.convertTextDecimal(floorPriceE)}
                                            </div>
                                        </Col>
                                    </List.Item>
                                </div>
                                : null
                            }

                            <List.Item>
                                <Col span={12} className="customSwitch">
                                    <span style={{fontWeight: 600}}>Xác nhận</span>&nbsp;&nbsp;<Switch size="small" checked={isOrderQuick} onChange={()=>this.onChangeOrderQuick(isOrderQuick)}/>
                                </Col>
                                <Col span={12} className="p-left10">
                                    {
                                        isSelected === 1 ?
                                            <Button loading={isLoadingBuy} className="btn-order-buy" onClick={()=> this.onHandleBuy(1)}>
                                                ĐẶT MUA
                                            </Button>
                                        : 
                                            <Button loading={isLoadingBuy} className="btn-order-edit" onClick={()=> this.onHandleBuy(2)}>
                                                ĐẶT BÁN
                                            </Button>
                                    }
                                    
                                </Col>
                            </List.Item>
                        </List>
                    </Row>
                </div>
            </Row>
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstStock: state.indexCore['STOCKS.LIST'],
        accountBuyAble: state.indexCore['BUY_ABLE.LIST'],
        accountSellAble: state.indexCore['SELL_ABLE.LIST'],
        bankAccount: state.indexCore['BANK_ACCOUNT.LIST'],
        subNumberChange: state.rootMain['SUB_NUMBER']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getAccountBuyAble: (data)=> dispatch(getAccountBuyAble(data)),
        getAccountSellAble: (data)=> dispatch(getAccountSellAble(data)),
        equityOrder: (data)=> dispatch(equityOrder(data)),
        getBankAccount: (data)=> dispatch(getBankAccount(data)),
        equityOrderStop: (data)=> dispatch(equityOrderStop(data)),
        equityOrderAdvance: (data)=> dispatch(equityOrderAdvance(data)),
        indexLogs: (data)=> dispatch(indexLogs(data)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (OrderBuy);

const styles = {
    rootTabs: {
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        margin: 0,
    },
    rootOrder: {
        marginLeft: 0,
        marginRight: 0,
        padding: 10,
        backgroundColor: color._WHITE,
        borderRadius: 8,
        height: 'auto'
    },
    labelTitle: {
        fontSize: 13,
        fontWeight: 600,
        color: color._GREY_666
    }
}