import React, {Component} from 'react';
import {Row, Col, Radio, List, InputNumber, Button} from 'antd';
import {SwapLeftOutlined} from '@ant-design/icons';

import {connect} from 'react-redux';
import {actionIndex, actionEditIndex} from '../../../stores/actions/investor/indexAction';

import Loading from '../../../components/Loading/Loading';

import * as common from '../../../components/Common/Common';
import {css} from 'emotion';

let color = window['colors'];

const root = css`
    .header{
        height: auto;
        .label{
            font-size: 1.8em;
            font-weight: 500;
            color: ${color._BLACK}
        }
        .right{
            display: flex;
            justify-content: flex-end;
            align-items: center;
            font-size: 1em;
            height: auto;
            .ant-radio-inner{
                border-color: ${color._STROKE};
                &:after{
                    background-color: ${color._BLUE_VCSC};
                }
            }
            .labelRadio{
                font-weight: 500;
                color: ${color._BLACK}
            }
        }
    }
    .main{
        height: 'auto';
        .header{
            background-color: ${color._GREY_LIGHT_2};
            padding: 1em;
            font-weight: 600;
            color: ${color._BLACK};
            border: 1px solid ${color._STROKE};
            border-top-left-radius: 0.3em;
            border-top-right-radius: 0.3em;
        }
        .bodyRoot{
            background-color: ${color._WHITE};
            height: auto;
            border: 1px solid ${color._STROKE};
            border-top: 0;
            border-bottom-left-radius: 0.3em;
            border-bottom-right-radius: 0.3em;
            overflow: auto;
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
                    display: flex;
                    align-items: center;
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
                width: 10em;
                border-radius: 4px;
                padding: 8px 0;
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

class Proportion extends Component{
    constructor(props){
        super(props);
        this.state = {
            isSelectProportion: props.infoPortfolio.TYPE === 'COPY' ? 3 : 1,
            isDisabled: props.infoPortfolio.TYPE === 'COPY' ? false : true,
            dataProportion: [],
            isLoading: false,
            isCopy: props.infoPortfolio.TYPE === 'COPY' ? true : false
        }
    }

    componentWillMount(){
        this.loadDataProportion(1);
    }

    loadDataProportion = (number, typeBefore = 1)=>{
        let data = [];
        if(Object.keys(this.props.proportion).length > 0){
            if(number === 1){
                data = this.props.proportion.capitalization;
            }
            if(number === 2){
                data = this.props.proportion.allocation;
            }
            if(number === 3 && typeBefore === 1){
                data = this.props.proportion.capitalization;
            }
            if(number === 3 && typeBefore === 2){
                data = this.props.proportion.allocation;
            }
        }
        this.setState({dataProportion: data});
    }

    onBackPortfolio = ()=>{
        this.props.dispatch({
            type: 'NUMBER.PORTFOLIO.PAGE',
            data: 2
        });
    }

    onOptionProportion = (e)=>{
        const {
            isSelectProportion
        } = this.state;

        this.loadDataProportion(e.target.value, isSelectProportion);
        this.setState({isSelectProportion: e.target.value});
        if(e.target.value === 3){
            this.setState({isDisabled: false});
        }else{
            this.setState({isDisabled: true});
        }
    }

    handleChange = (idx) => (event)=>{
        const data = this.props.proportion;
        let dataNew = [];
        if(Object.keys(data).length > 0){
            let dataTmp = this.state.dataProportion;
            if(dataTmp.length > 0){
                dataNew = dataTmp.map((item, index)=>{
                    if(index === idx){
                        return{
                            ...item,
                            proportion: typeof event === "number" ? event : 0
                        }
                    }
                    return {
                        ...item
                    }
                });
            }
        }
        this.setState({dataProportion : dataNew});
    }

    onProportion = async(total)=>{
        try {
            const {
                dataProportion,
                isSelectProportion
            } = this.state;
            if(dataProportion.length > 0){
                let isPass = true;
                let idx = dataProportion.findIndex(item => parseFloat(item.proportion) === 0);
                if(idx > -1){
                    isPass = false;
                }
                if(isPass){
                    if(parseFloat(total) === 100){
                        const info = this.props.infoPortfolio;
                        if(Object.keys(info).length > 0){
                            let subNumber = '00';
                            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
                            if (obj) {
                                if(obj.SUB_NUMBER){
                                    subNumber = obj.SUB_NUMBER;
                                }
                            }
                            let data = {
                                arrIndexsDetail: JSON.stringify([...dataProportion]),
                                indexsName: info.NAME || null,
                                noted: info.DESCRIPTION || '',
                                optionProportion: isSelectProportion,
                                icon: info.IMAGE || '',
                                subNumber: subNumber
                            }
                            
                            if(info.INDEXID){
                                data = {
                                    ...data,
                                    id: info.INDEXID,
                                    arrIndexsDetailOld: info.arrOld,
                                    arrIndexsDetailNew: dataProportion
                                }
                                //tìm lstArr trong arrOld không có trong arrNew
                                let found_1 = data.arrIndexsDetailOld.filter( ( el ) => data.arrIndexsDetailNew.map(o2 => o2.stockCode).indexOf(el.stockCode) === -1 );
                                let found_2 = data.arrIndexsDetailNew.filter( ( el ) => data.arrIndexsDetailOld.map(o2 => o2.stockCode).indexOf(el.stockCode) === -1 );
                                let found_3 = data.arrIndexsDetailNew.filter( ( el ) => data.arrIndexsDetailOld.map(o2 => o2.stockCode).indexOf(el.stockCode) > -1 );             
                                //tìm lstArr trong arrOld nằm trong arrNew (trường hợp remove add lại)
                                let found_4 = [];
                                if(found_3.length > 0){
                                    found_4 = data.arrIndexsDetailOld.filter( ( el ) => found_3.map(o2 => o2.stockCode).indexOf(el.stockCode) > -1 );
                                }
                                
                                let found_1_Convert = found_1.length > 0 ? found_1.map((item)=>{
                                    return{
                                        ...item,
                                        actionType: 'remove'
                                    }
                                }) : [];
                                // let found_3_Convert = found_4.length > 0 ? found_4.map((item)=>{
                                //     return{
                                //         ...item,
                                //         actionType: 'edit'
                                //     }
                                // }) : [];

                                let found_3_Convert = [];
                                if(found_4.length > 0){
                                    found_3_Convert = data.arrIndexsDetailNew.filter( ( el ) => found_4.map(o2 => o2.stockCode).indexOf(el.stockCode) > -1 ).map((item)=>{
                                        let index = data.arrIndexsDetailOld.map(o2 => o2.stockCode).indexOf(item.stockCode);
                                        return{
                                            ...item,
                                            actionType: 'edit',
                                            id: index > -1 ? data.arrIndexsDetailOld[index].id : null
                                        }
                                    })
                                }
                                let newArr = [...found_1_Convert, ...found_2, ...found_3_Convert];

                                this.setState({isLoading: true});
                                const res = await this.props.actionEditIndex({...data,
                                    arrIndexsDetail: JSON.stringify(newArr)
                                });
                                this.setState({isLoading: false});
                                if(res.type === 'INDEX.EDIT'){
                                    common.notify("success", "Chỉnh sửa danh mục thành công!!!");
                                    this.props.dispatch({
                                        type: 'NUMBER.PORTFOLIO.PAGE',
                                        data: 1
                                    });
                                }
                            }else{
                                this.setState({isLoading: true});
                                const res = await this.props.actionIndex(data);
                                this.setState({isLoading: false});
                                if(res.type === 'INDEX.POST'){
                                    common.notify("success", "Tạo danh mục thành công!!!");
                                    this.props.dispatch({
                                        type: 'NUMBER.PORTFOLIO.PAGE',
                                        data: 1
                                    });
                                }
                            }
                        }
                    }else{
                        common.notify("warning", "Tổng tỉ trọng phải bằng 100% !!!");
                    }
                }else{
                    common.notify("warning", "Tỉ trọng cổ phiếu không được bằng 0 !!!");
                }
            }
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    render(){
        const {
            isSelectProportion,
            isDisabled,
            dataProportion,
            isLoading,
            isCopy
        } = this.state;

        const total = (dataProportion.length > 0 ? dataProportion.reduce((accumulator, currentValue) => {
            return accumulator + (typeof currentValue.proportion === "number" ? currentValue.proportion : 0);
        }, 0) : 0).toFixed(2);
        
        return(
            <Loading isLoading={isLoading}>     
                <div className={root}>
                    <Row justify="center">
                        <Col xl={14} lg={18} md={24} xs={24}>
                            <Row className="header">
                                <Col span={8}>
                                    <span className="label">Chọn tỷ trọng</span>
                                </Col>
                                <Col span={16} className="right">
                                    <Radio.Group onChange={this.onOptionProportion} value={isSelectProportion}>
                                        {!isCopy ? <Radio value={1} className="labelRadio">Theo vốn hóa</Radio> : null}
                                        <Radio value={2} className="labelRadio">Phân bổ đều</Radio>
                                        <Radio value={3} className="labelRadio">Tự điều chỉnh</Radio>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            
                            <div className="main p-top20">
                                <Row className="header">
                                    <Col span={4}>
                                        Mã CP
                                    </Col>
                                    <Col span={16}>
                                        Tên cổ phiếu
                                    </Col>
                                    <Col span={4}>
                                        Tỷ trọng (%)
                                    </Col>
                                </Row>

                                <div className="bodyRoot">
                                    {dataProportion.length > 0 ?
                                        <List
                                            size="default"
                                            bordered
                                            dataSource={dataProportion}
                                            className="styleListStock"
                                            renderItem={(item, idx) => 
                                            <List.Item className="item">
                                                <Col span={4}>
                                                    <span style={{fontWeight: 600}}>{item.stockCode}</span>
                                                </Col>
                                                <Col span={16}>
                                                    <span style={{fontWeight: 500}}>{item.companyName}</span>
                                                </Col>
                                                <Col span={4}>
                                                    <InputNumber 
                                                        min={0}
                                                        value={item.proportion}
                                                        onChange={this.handleChange(idx)}
                                                        formatter={value => common.formatterNumber(value)}
                                                        parser={value => common.parserNumber(value)}
                                                        disabled={isDisabled}
                                                        className="customInput"
                                                    />
                                                </Col>
                                            </List.Item>}
                                        />
                                    : null}
                                    <div className="footerTotal">
                                        <Row>
                                            <Col span={19} className="label">
                                                TỔNG
                                            </Col>
                                            <Col span={1} />
                                            <Col span={4} className="total">
                                                {total}%
                                            </Col>
                                        </Row>
                                    </div>
                                </div>

                                <div className="footer p-top20">
                                    <div className="left">
                                        <div style={{cursor: 'pointer'}} onClick={this.onBackPortfolio}>
                                            <SwapLeftOutlined style={{fontSize: '1.5em'}}/> QUAY LẠI
                                        </div>
                                    </div>
                                    <div className="right">
                                        <Button key="submit" className="btnOrder" onClick={()=> this.onProportion(total)}>
                                            XÁC NHẬN
                                        </Button>
                                    </div>
                                    <div className="clearBoth"></div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Loading>
        )
    }
}

const mapStateToProps = state =>{
    return{
        proportion: state.portFolio['PROPORTION.PUT'],
        infoPortfolio: state.portFolio['PORTFOLIO.INFO'],
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        actionIndex: (data)=> dispatch(actionIndex(data)),
        actionEditIndex: (data)=> dispatch(actionEditIndex(data)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Proportion);
