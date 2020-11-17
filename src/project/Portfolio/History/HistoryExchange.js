import React, {Component} from 'react';
import {DatePicker, Tag, Row, Col, Select} from 'antd';
import {CaretDownOutlined, PlusOutlined, CaretUpOutlined, SyncOutlined, MinusOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';
import {getHistory, getHistoryIndexTime} from '../../../stores/actions/investor/historyAction';
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
                width: 17em;
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
        .itemPortfolio{
            background-color: ${color._WHITE};
            border-radius: 0.6em;
            height: 7em;
            .left{
                padding: 1.9em;
                padding-right: 0;
                float: left;
                width: calc(100% - 6em);
                .main{
                    border-right: 1px solid ${color._STROKE};
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
                }
            }
            .right{
                float: right;
                width: 6em;
                height: 7em;
                display: flex;
                justify-content: center;
                align-items: center;
                .iconDown{
                    font-size: 1.8em;
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
        color: ${color._BLACK};
        .reload{
            color: ${color._BLUE_VCSC};
            font-size: 1.2em;
            cursor: pointer;
        }
    }
    .bodyRoot{
        width: 100%;
        background-color: ${color._WHITE};
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
            font-weight: 500;
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
                this.setState({isLoading: true});
                const res = await this.onLoadIndexTime(item);
                this.setState({isLoading: false});
                if(res.type === 'HISTORY.INDEX_TIME'){
                    this.setState({isChooses: [...isChooses, {key: idx, dataIndexTime: res.data || []}] });
                }
            }
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    onLoadIndexTime = async(item)=>{
        let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
        let subNumber = '00';
        if(obj){
            if(obj.SUB_NUMBER){
                subNumber = obj.SUB_NUMBER;
            }
        }
        return await this.props.getHistoryIndexTime({
            subNumber: subNumber,
            fromDate: common.dateToYYYYMMDD(item.createDate) || '',
            commandId: item.commandId || '',
            indexsId: this.props.indexsId || null
        });
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
                        <div style={{float: 'left', width: '2em'}}/>
                        <div style={{float: 'right', width: 'calc(100% - 2em)'}}>
                            <Row>
                                <Col span={6}>
                                    Ngày GD
                                </Col>
                                <Col span={6}>
                                    Mã lệnh
                                </Col>
                                <Col span={6}>
                                    Loại danh mục
                                </Col>
                                <Col span={5} style={{textAlign: 'right'}}>
                                    Giá trị đặt lệnh
                                </Col>
                            </Row>
                        </div>
                        <div style={{clear: 'both'}} />
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
                                        <div style={{float: 'left', width: '2em'}}>
                                            {isCheck ?
                                                <MinusOutlined className="iconExpand"/>
                                                : <PlusOutlined className="iconExpand"/>
                                            }
                                        </div>
                                        <div style={{float: 'right', width: 'calc(100% - 2em)'}}>
                                            <Row>
                                                <Col span={6}>
                                                    <span style={{fontWeight: 500}}>{common.convertDDMMYYYY(item.createDate)}</span>
                                                </Col>
                                                <Col span={6}>
                                                    <span style={{fontWeight: 500}}>{item.commandId}</span>
                                                </Col>
                                                <Col span={6}>
                                                    {item.type}
                                                </Col>
                                                <Col span={5} style={{textAlign: 'right'}}>
                                                    {common.convertTextDecimal(item.value)}
                                                </Col>
                                            </Row>
                                        </div>
                                    </Row>
                                    <div className="borderBottom"/>
                                    {isCheck ? 
                                        <CollapseTime 
                                            data={dataTmp}
                                            getHistoryIndexTime={this.props.getHistoryIndexTime}
                                            itemMaster={item}
                                            lstIndexTime={this.props.lstIndexTime}
                                            indexsId={this.props.indexsId || null}
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
            data: [],
            isLoading: false
        }
    }

    componentWillMount(){
        const dataIndexTime = this.props.data;
        this.setState({data: dataIndexTime});
    }

    reloadData = async()=>{
        try {
            this.setState({isLoading: true});
            const item = this.props.itemMaster;
            if(item){
                const res = await this.onLoadIndexTime(item);
                if(res.type === 'HISTORY.INDEX_TIME'){
                    this.setState({data: res.data});
                }
            }
            this.setState({isLoading: false});
        } catch (error) {
            
        }
    }

    onLoadIndexTime = async(item)=>{
        let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
        let subNumber = '00';
        if(obj){
            if(obj.SUB_NUMBER){
                subNumber = obj.SUB_NUMBER;
            }
        }
        return await this.props.getHistoryIndexTime({
            subNumber: subNumber,
            fromDate: common.dateToYYYYMMDD(item.createDate) || '',
            commandId: item.commandId || '',
            indexsId: this.props.indexsId
        });
    }

    render(){
        const {
            data,
            isLoading
        } = this.state;

        let totalMatched = 0;
        if(data.length > 0){
            totalMatched = data.reduce(function(accumulator, currentValue) {
                return accumulator + currentValue.matchedQuantity * currentValue.matchedPrice;
            }, 0);
        }

        return(
            <Loading isLoading={isLoading}>
                <div className={collapseFirst}>
                    <Row className="header">
                        <Col span={4}>
                            Thời gian
                        </Col>
                        <Col span={3}>
                            Số hiệu lệnh
                        </Col>
                        <Col span={3}>
                            Mã CP
                        </Col>
                        <Col span={2}>
                            Mua/bán
                        </Col>
                        <Col span={2} style={{textAlign: 'right'}}>
                            SL Đặt
                        </Col>
                        <Col span={2} style={{textAlign: 'right'}}>
                            Giá Đặt
                        </Col>
                        <Col span={2} style={{textAlign: 'right'}}>
                            SL Khớp
                        </Col>
                        <Col span={2} style={{textAlign: 'right'}}>
                            Giá Khớp
                        </Col>
                        <Col span={1} />
                        <Col span={2}>
                            Trạng thái
                        </Col>
                        <Col span={1} style={{textAlign: 'center'}}>
                            <SyncOutlined className="reload" onClick={this.reloadData}/>
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
                                        <Col span={3}>
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
                                        <Col span={2} style={{textAlign: 'right'}}>
                                            {common.convertTextDecimal(item.orderPrice)}
                                        </Col>
                                        <Col span={2} style={{textAlign: 'right'}}>
                                            {common.convertTextDecimal(item.matchedQuantity)}
                                        </Col>
                                        <Col span={2} style={{textAlign: 'right'}}>
                                            {common.convertTextDecimal(item.matchedPrice)}
                                        </Col>
                                        <Col span={1} />
                                        <Col span={2} style={{fontWeight: 600}}>
                                            <span style={{color: common.statusOrderHistory({
                                                ...item,
                                                orderStatus: item.status
                                            }).color}}>{common.statusOrderHistory({
                                                ...item,
                                                orderStatus: item.status
                                            }).status}</span>
                                        </Col>
                                    </Row>
                                    <div className="borderBottom"/>
                                </div>
                            )
                        }) : null}
                        <div className="footerTotal">
                            <Row>
                                <Col span={18} className="label" style={{textAlign: 'right', fontWeight: 600}}>
                                    Giá trị khớp lệnh
                                </Col>
                                <Col span={2} className="total" style={{textAlign: 'right'}}>
                                    {common.convertTextDecimal(totalMatched)}
                                </Col>
                                <Col span={4}/>
                            </Row>
                        </div>
                    </div>
                </div>
            </Loading>
        )
    }
}

class HistoryExchange extends Component{
    constructor(props){
        super(props);
        this.state = {
            isChooses: [],
            fromDate: moment(new Date(new Date(newDate).setMonth(newDate.getMonth()-1)), dateFormat),
            toDate: moment(new Date(), dateFormat),
            isType: 0,
            isLoading: false
        }
    }

    componentDidMount(){
        this.loadData();
    }

    loadData = async()=>{
        try {
            const {
                fromDate,
                toDate,
                isType
            } = this.state;
            this.setState({isLoading: true, isChooses: []});
            await this.props.getHistory({
                fromDate: fromDate,
                toDate: toDate,
                type: isType
            });
            this.setState({isLoading: false});

        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    updateInputDate = name => async(value)=>{
        await this.setState({[name]: value});
        this.loadData(this.state.codeBond);
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
            isType,
            isLoading
        } = this.state;

        const data = this.props.lstHistory;

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
                                    value={isType}
                                    onChange={this.updateSelectValue('isType')}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Option value={0}>Tất cả loại danh mục</Option>
                                    <Option value="DAUTUBANDAU">Đầu tư ban đầu</Option>
                                    <Option value="DAUTUTHEM">Đầu tư thêm</Option>
                                    <Option value="TAICANBANGDANHMUC">Tái cân bằng danh mục</Option>
                                    <Option value="BAN">Bán</Option>
                                </Select>
                            </div>
                            <div className="clearBoth"></div>
                        </div>
                    </div>
                    <div className="rootBody p-top5">
                        {data.length > 0 ? data.map((item, idx)=>{
                            let isCheck = false;
                            if(isChooses.includes(idx) === true){
                                isCheck = true;
                            }
                            return(
                                <div className="p-top20" key={idx}>
                                    <div className={`itemPortfolio ${isCheck ? 'isActive' : ''}`} onClick={()=> this.openCollapseFirst(idx)}>
                                        <div className="left">
                                            <div className="main">
                                                <div className="label">
                                                    DANH MỤC
                                                </div>
                                                <div className="title">
                                                    {item.indexsName}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="right">
                                            <div className="iconDown">
                                                {isCheck ? <CaretUpOutlined style={{color: color._BLUE_VCSC}}/> : <CaretDownOutlined />}
                                            </div>
                                        </div>
                                        <div className="clearBoth"></div>
                                    </div>
                                    {isCheck ? 
                                        <CollapseFirst 
                                            data={item.command || []}
                                            getHistoryIndexTime={this.props.getHistoryIndexTime}
                                            lstIndexTime={this.props.lstIndexTime}
                                            indexsId={item.id}
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

const mapStateToProps = state =>{
    return{
        lstHistory: state.portFolio['HISTORY.LIST'],
        lstIndexTime: state.portFolio['HISTORY.INDEX_TIME']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getHistory: (data)=> dispatch(getHistory(data)),
        getHistoryIndexTime: (data)=> dispatch(getHistoryIndexTime(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (HistoryExchange);