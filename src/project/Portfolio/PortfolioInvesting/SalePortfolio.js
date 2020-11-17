import React, {Component} from 'react';
import {Row, Col, List, Tag, Button, InputNumber, Checkbox} from 'antd';
import{SwapLeftOutlined, SyncOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';
import {indexFillMoneySell, indexQuantityForSell} from '../../../stores/actions/investor/indexAction';
import DialogAction from './DialogAction';
import Loading from '../../../components/Loading/Loading';
import * as common from '../../../components/Common/Common';
import {css} from 'emotion';

let color = window['colors'];

const rootMain = css`
    .rootHeader{
        .title{
            font-weight: 500;
            font-size: 1.8em;
            color: ${color._BLACK};
            @media only screen and (max-width: 992px) {
                font-size: 1.2em;
            }
        }
        .comHeaderRoot{
            @media only screen and (max-width: 992px) {
                overflow: auto;
            }
            .scroll{
                @media only screen and (max-width: 992px) {
                    width: 300%;
                    height: auto;
                }
                .headerTotalStatistical{
                    border-radius: 8px;
                    padding: 20px 0;
                    background-color: ${color._WHITE};
                    .itemComp{
                        padding: 0 20px;
                        word-wrap: break-word;
                        .title{
                            font-weight: 600;
                            color: ${color._GREY_999};
                            font-size: 12px;
                            line-height: 2;
                        }
                        .content{
                            font-weight: 500;
                            color: ${color._BLUE_VCSC};
                            font-size: 22px
                        }
                        .contentWarning{
                            font-weight: 500;
                            color: ${color._RED_VCSC};
                            font-size: 22px
                        }
                    }
                    .borderRight{
                        border-right: 1px solid ${color._GREY_LIGHT_2};
                    }
                }
            }
        }
        .left{
            float: left;
            .customInput{
                border-radius: 1px solid ${color._STROKE};
                border-radius: 0.3em;
                width: 12em;
                top: 1px;
            }
            .btnCheckSum{
                font-size: 13px;
                font-weight: 600;
                color: ${color._WHITE};
                height: auto;
                width: 8em;
                border-radius: 4px;
                padding: 9px 0;
                margin-left: 1em;
                background-color: ${color._ORANGE};
                border: 1px solid ${color._ORANGE};
                &:hover{
                    background-color: ${color._ORANGE_HOVER};
                    border: 1px solid ${color._ORANGE_HOVER};
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

class SalePortfolio extends Component{
    constructor(props){
        super(props);
        this.state= {
            lstIndexs: [],
            lstIndexsReal: [],
            isLoading: false,
            totalExpected: 0,
            priceInvest: 0,
            totalLimit: 0,
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
        this.loadData(true);
    }
    
    loadData = async (setChosseMaster, isReload = false)=>{
        try {
            const {
                lstChoose,
                isChosseMaster
            } = this.state;
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            let subNumber = '00';
            if(obj){
                if(obj.SUB_NUMBER){
                    subNumber = obj.SUB_NUMBER;
                }
            }
            this.setState({isLoading: true});
            const res = await this.props.indexQuantityForSell({
                subNumber: subNumber,
                arrIndexsDetail: JSON.stringify(this.props.lstIndexOfItem.lstIndexs)
            });
            this.setState({isLoading: false});
            if(res.type === 'INDEX.QUANTITY_SELL'){
                if(Object.keys(res.data).length > 0){
                    let lstTmp = res.data.arrIndexsDetail.map(item => {
                        return true
                    });
                    
                    this.totalExpect(setChosseMaster, isReload ? lstChoose : lstTmp);
                    this.setState({
                        lstIndexs: res.data.arrIndexsDetail, 
                        dataMaster: res.data,
                        isChosseMaster: setChosseMaster,
                        totalLimit: res.data.totalValue, 
                        priceInvest: res.data.totalValue
                    });
                    if(!isReload){
                        this.setState({lstChoose: lstTmp, lstIndexsReal: res.data.arrIndexsDetail});
                    }else{
                        this.totalExpect(isChosseMaster, lstChoose);
                    }
                }
            }
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    componentWillUnmount(){
        this.props.dispatch({
            type: 'LIST.INDEXS.INVESTING',
            data: {}
        });
        this.props.dispatch({
            type: 'NUMBER.PORTFOLIO_INVESTING.PAGE',
            data: 1
        });
    }

    onActionCheckInvest = async()=>{
        try {
            const {
                priceInvest,
                totalLimit,
                lstIndexs,
                isChosseMaster,
                lstChoose
            } = this.state;

            if(parseFloat(priceInvest) > totalLimit){
                common.notify("warning", `Số tiền muốn bán không được lớn hơn tổng dự kiến ${common.convertTextDecimal(totalLimit)}`);
            }else{
                this.setState({isLoading: true});
                const res = await this.props.indexFillMoneySell({
                    money: priceInvest,
                    arrIndexsDetail: JSON.stringify(lstIndexs),
                    totalValue: totalLimit
                });
                this.setState({isLoading: false});
                if(res.type === 'INDEX.FILL_SELL'){
                    await this.setState({lstIndexs: res.data});
                    this.totalExpect(isChosseMaster, lstChoose);
                }
            }
        } catch (error) {
            this.setState({isLoading: false});
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
                
                await this.setState({lstIndexs: newArr});
                this.totalExpect(isChosseMaster, lstChoose);
            }
        } catch (error) {
            
        }
    }

    onUpdateLastPrice = ()=>{
        const {
            isChosseMaster
        } = this.state;

        this.loadData(isChosseMaster, true);
    }

    updateSelectValue = name => async(event) =>{
        this.setState({[name]: event});
    }

    onBackPortfolio = ()=>{
        this.props.dispatch({
            type: 'NUMBER.PORTFOLIO_INVESTING.PAGE',
            data: 1
        });
    }

    onActionSale = (data)=>{
        if(data.length > 0){
            this.setState({isOpenModalInvest: true});
        }else{
            common.notify("warning", "Quí khách cần chọn ít nhất một cổ phiếu để tiếp tục thao tác!!!");
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
            isLoading,
            priceInvest,
            lstIndexs,
            lstIndexsReal,
            isOpenModalInvest,
            lstChoose,
            isChosseMaster,
            indeterminate
        } = this.state;

        let totalExpected = 0;
        if(lstIndexsReal.length > 0){
            totalExpected = lstIndexsReal.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.quantity * currentValue.last;
            }, 0);
        }

        //sau này để lại lstIndexs
        // let lstIndexsTest = lstIndexs.length > 0 ? lstIndexs.map((item)=>{
        //     return {
        //         ...item,
        //         quantity: parseInt(item.quantity/100)*100
        //     }
        // }) : [];

        let data = this.props.objIndexInvesting;

        return(
            <Loading isLoading={isLoading}>
                <div className={rootMain}>
                    <DialogAction
                        isOpen={isOpenModalInvest} 
                        lstIndexs={lstIndexsReal} 
                        onRejectActionInvest={this.onRejectActionInvest}
                        indexsId={this.props.lstIndexOfItem.indexId}
                        totalExpected={totalExpected}
                    />
                    <div className="rootHeader">
                        <div className="title p-top20">
                            Bán danh mục - {data.indexsName}
                        </div>
                        <div className="comHeaderRoot p-top10">
                            <div className="scroll">
                                <Row className="headerTotalStatistical">
                                    <Col span={8} className="itemComp borderRight">
                                        <div className="title">TỔNG ĐẦU TƯ</div>
                                        <div className="content">{common.convertTextDecimal(data.totalValue || 0)}</div>
                                    </Col>
                                    <Col span={8} className="itemComp borderRight">
                                        <div className="title">GIÁ TRỊ HIỆN TẠI</div>
                                        <div className="content">{common.convertTextDecimal(data.totalValueCurrent || 0)}</div>
                                    </Col>
                                    <Col span={8} className="itemComp borderRight">
                                        <div className="title">GIÁ TRỊ LÃI/LỖ</div>
                                        <div className="content"style={{color: data.rateLossValue > 0 ? color._GREEN : color._RED_VCSC}}>{common.convertTextDecimal(data.rateLossValue)}&nbsp;({data.percentRateLoss}%)</div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className="p-top20">
                            <div className="left">
                                <div className="label">
                                    Số tiền bạn muốn bán
                                </div>
                                <div className="p-top5">
                                    <InputNumber 
                                        min={0} 
                                        className="customInput"
                                        size="large"
                                        value={priceInvest}
                                        onChange={this.updateSelectValue("priceInvest")}
                                        formatter={value => common.formatterNumber(value)}
                                        parser={value => common.parserNumber(value)}
                                        step={10}
                                    />
                                    <Button key="submit" className="btnCheckSum" onClick={this.onActionCheckInvest}>
                                        TÍNH TOÁN
                                    </Button>
                                </div>
                            </div>
                            <div className="right" style={{paddingTop: 40}}>
                                <div onClick={this.onUpdateLastPrice}>
                                    <SyncOutlined /> Cập nhật / Bán tối đa
                                </div>
                            </div>
                            <div className="clearBoth"></div>
                        </div>
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
                            <Col span={2} style={{textAlign: 'center'}}>
                                Giao dịch
                            </Col>
                            <Col span={2}></Col>
                            <Col span={4}>
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
                            <Col span={5} style={{textAlign: 'right'}}>
                                KL giao dịch
                            </Col>
                            <Col span={5} style={{textAlign: 'right'}}>
                                Giá trị dự kiến
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
                                        <Col span={2} style={{textAlign: 'center'}}>
                                            <Tag color={color._RED_VCSC_LIGHT}>
                                                <span style={{color: color._RED_VCSC, fontWeight: 600, fontSize: 14}}>{'Bán'}</span>
                                            </Tag>
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={4}>
                                            <span style={{fontWeight: 600}}>{item.stockCode}</span>
                                        </Col>
                                        <Col span={5} style={{textAlign: 'center'}}>
                                            <span style={{fontWeight: 500}}>{common.convertTextDecimal(item.last)}</span>
                                            &nbsp;{
                                                checkPriceChange(item)
                                            }
                                            
                                            {/* {item.last === item.ceilingPrice ? <span style={{color: color._GREEN}}>- Trần</span> : (item.last === item.floorPrice ? <span style={{color: color._RED_VCSC}}>- Sàn</span> : null)} */}
                                        </Col>
                                        <Col span={5} style={{textAlign: 'right'}}>
                                            <span style={{fontWeight: 500}}>{common.convertTextDecimal(item.quantity)}</span>
                                        </Col>
                                        <Col span={5} style={{textAlign: 'right'}}>
                                            <span style={{fontWeight: 500}}>{common.convertTextDecimal(item.quantity*item.last)}</span>
                                        </Col>
                                    </List.Item>}
                                />
                            : null}
                            <div className="footerTotal">
                                <Row>
                                    <Col span={19} className="label" style={{textAlign: 'right'}}>
                                        TỔNG
                                    </Col>
                                    <Col span={5} className="total" style={{textAlign: 'right'}}>
                                        {common.convertTextDecimal(totalExpected)}
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className="footer p-top20">
                        <div className="left">
                            <div style={{ cursor: 'pointer' }} onClick={this.onBackPortfolio}>
                                <SwapLeftOutlined style={{ fontSize: '1.5em' }} /> QUAY LẠI
                            </div>
                        </div>
                        <div className="right">
                            {lstIndexs.length === 0 ? <span style={{fontWeight: 600, fontSize: 12, color: color._RED_VCSC}}>Chưa có cổ phiếu về để thực hiện!</span> : null}
                            <Button key="submit" className="btnOrder" onClick={()=>this.onActionSale(lstIndexsReal)}>
                                THỰC HIỆN BÁN
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
        lstQuantityForSell: state.portFolio['INDEX.QUANTITY_SELL'],
        lstIndexOfItem: state.portFolio['LIST.INDEXS.INVESTING'],
        lstIndexFillSell: state.portFolio['INDEX.FILL_SELL'],
        objIndexInvesting: state.portFolio['INDEX.INVESTING']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        indexFillMoneySell: (data)=> dispatch(indexFillMoneySell(data)),
        indexQuantityForSell: (data)=> dispatch(indexQuantityForSell(data)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (SalePortfolio);