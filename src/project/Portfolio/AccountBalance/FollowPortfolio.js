import React, {Component} from 'react';
import {Row, Col, List} from 'antd';
import {connect} from 'react-redux';
import {getAssetInfoIndex} from '../../../stores/actions/investor/indexAction';

import {CaretUpOutlined, CaretDownOutlined, SyncOutlined} from '@ant-design/icons';
import * as common from '../../../components/Common/Common';
import Loading from '../../../components/Loading/Loading';

import {css} from 'emotion';

let color = window['colors'];

const rootMain = css`
    overflow-x: auto;
    .totalRoot{
        width: calc(100% - 6em);
        padding-left: 1.9em;
        padding-right: 1.9em;
        @media only screen and (max-width: 992px) {
            width: calc(100% - 6em);
        }
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
        .floatRight{
            text-align: right;
        }
    }
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
                    padding-right: 1.9em;
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
                    .floatRight{
                        text-align: right;
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

const rootCollapse = css`
    padding: 1.5em 1.9em;
    padding-top: 0;
    border-bottom-left-radius: 0.6em;
    border-bottom-right-radius: 0.6em;
    background-color: ${color._WHITE};
    height: 'auto';
    @media only screen and (max-width: 992px) {
        overflow: auto;
        width: 100%;
    }
    .header{
        width: 100%;
        background-color: ${color._GREY_LIGHT_2};
        padding: 1em;
        padding-right: 1.9em;
        font-weight: 600;
        color: ${color._BLACK};
        border: 1px solid ${color._STROKE};
        border-top-left-radius: 0.3em;
        border-top-right-radius: 0.3em;
        @media only screen and (max-width: 992px) {
            width: 150%;
        }
        .floatRight{
            text-align: right;
        }
    }
    .bodyRoot{
        padding-right: 0.9em;
        background-color: ${color._WHITE};
        height: auto;
        border: 1px solid ${color._STROKE};
        border-top: 0;
        border-bottom-left-radius: 0.3em;
        border-bottom-right-radius: 0.3em;
        overflow: auto;
        @media only screen and (max-width: 992px) {
            width: 150%;
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
                font-weight: 500;
                &:hover{
                    background-color: ${color._HOVER};
                    color: ${color._BLACK}
                }
                .floatRight{
                    text-align: right;
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
`

class ExpandCollapse extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: false
        }
    }

    reloadData = async()=>{
        try {
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            let subNumber = '00';
            if(obj){
                if(obj.SUB_NUMBER){
                    subNumber = obj.SUB_NUMBER;
                }
            }
            this.setState({isLoading: true});
            await this.props.getAssetInfoIndex(subNumber);
            this.setState({isLoading: false});
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    render(){
        const {
            isLoading
        } = this.state;

        const data = this.props.data;
        return(
            <div className={rootCollapse}>
                <Loading isLoading={isLoading}>
                    <Row className="header">
                        <Col span={2}>
                            Mã CP
                        </Col>
                        <Col span={3} className="floatRight">
                            Số lượng CP
                        </Col>
                        <Col span={4} className="floatRight">
                            Giá mua
                        </Col>
                        <Col span={4} className="floatRight">
                            Giá hiện tại
                        </Col>
                        <Col span={4} className="floatRight">
                            Giá trị hiện tại
                        </Col>
                        <Col span={3} className="floatRight">
                            Lãi/Lỗ
                        </Col>
                        <Col span={3} className="floatRight">
                            % Lãi/Lỗ
                        </Col>
                        <Col span={1} style={{textAlign: 'right', color: color._BLUE_VCSC}}>
                            <SyncOutlined className="reload" onClick={this.reloadData}/>
                        </Col>
                    </Row>
                    <div className="bodyRoot">
                        {data.length > 0 ?
                            <List
                                size="default"
                                bordered
                                dataSource={data}
                                className="styleListStock"
                                renderItem={(item, idx) => 
                                <List.Item className="item">
                                    <Col span={2} style={{fontWeight: 600}}>
                                        {item.stockCode}
                                    </Col>
                                    <Col span={3} className="floatRight">
                                        {common.convertTextDecimal(item.orderQuantity)}
                                    </Col>
                                    <Col span={4} className="floatRight">
                                        {common.convertTextDecimal(item.orderValue)}
                                    </Col>
                                    <Col span={4} className="floatRight">
                                        {common.convertTextDecimal(item.last)}
                                    </Col>
                                    <Col span={4} className="floatRight">
                                        {common.convertTextDecimal(item.currentValue)}
                                    </Col>
                                    <Col span={3} className="floatRight" style={{color: item.rateLossValue > 0 ? color._GREEN : color._RED_VCSC}}>
                                        {common.convertTextDecimal(item.rateLossValue)}
                                    </Col>
                                    <Col span={3} className="floatRight" style={{color: item.percentRateLoss > 0 ? color._GREEN : color._RED_VCSC}}>
                                        {item.percentRateLoss}
                                    </Col>
                                    <Col span={1} />
                                </List.Item>}
                            />
                            : null
                        }
                    </div> 
                </Loading>
            </div>
        )
    }
}

class FollowPortfolio extends Component{
    constructor(props){
        super(props);
        this.state = {
            isChooses: [],
            isLoading: false
        }
    }

    componentDidMount(){
        this.loadData();
    }

    componentDidUpdate(prev){
        if(this.props.subNumberChange && prev.subNumberChange !== this.props.subNumberChange){
            this.loadData(this.props.subNumberChange);
        }
    }

    loadData = async()=>{
        try {
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            let subNumber = '00';
            if(obj){
                if(obj.SUB_NUMBER){
                    subNumber = obj.SUB_NUMBER;
                }
            }
            this.setState({isLoading: true});
            await this.props.getAssetInfoIndex(subNumber);
            this.setState({isLoading: false});
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    openExpandCollapse = (idx)=>{
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

    render(){
        const {
            isChooses
        } = this.state;

        const data = this.props.lstIndexAssetInfo;

        return(
            <div className={rootMain}>
                <div className="rootBody p-top5">
                    <Row className="totalRoot">
                        <Col span={13}></Col>
                        <Col span={5} className="floatRight">
                            <div className="label">
                                TỔNG GIÁ TRỊ HIỆN TẠI
                            </div>
                            <div className="title">
                                {common.convertTextDecimal(data.totalValueAll)}
                            </div>
                        </Col>
                        <Col span={3} className="floatRight">
                            <div className="label">
                                LÃI/LỖ
                            </div>
                            <div className="title" style={{color: data.totalRateLossValueAll > 0 ? color._GREEN : color._RED_VCSC}}>
                                {common.convertTextDecimal(data.totalRateLossValueAll)}
                            </div>
                        </Col>
                        <Col span={3} className="floatRight">
                            <div className="label">
                                % LÃI/LỖ
                            </div>
                            <div className="title" style={{color: data.totalpercentRateLossAll > 0 ? color._GREEN : color._RED_VCSC}}>
                                {data.totalpercentRateLossAll}
                            </div>
                        </Col>
                    </Row>
                    {Object.keys(data).length > 0 ? (data.arrIndexs.length > 0 ? data.arrIndexs.map((item, idx)=>{
                        let isCheck = false;
                        if(isChooses.includes(idx) === true){
                            isCheck = true;
                        }
                        return(
                            <div className="p-top20" key={idx}>
                                <div className={`itemPortfolio ${isCheck ? 'isActive' : ''}`} onClick={()=> this.openExpandCollapse(idx)}>
                                    <div className="left">
                                        <div className="main">
                                            <Row>
                                                <Col span={10}>
                                                    <div className="label">
                                                        DANH MỤC
                                                    </div>
                                                    <div className="title">
                                                        {item.indexsName}
                                                    </div>
                                                </Col>
                                                <Col span={4} className="floatRight" style={{paddingRight: '0.9em'}}>
                                                    <div className="label">
                                                        SỐ CP
                                                    </div>
                                                    <div className="title">
                                                        {common.convertTextDecimal(item.totalStock)}
                                                    </div>
                                                </Col>
                                                <Col span={4} className="floatRight">
                                                    <div className="label">
                                                        GIÁ TRỊ HIỆN TẠI
                                                    </div>
                                                    <div className="title">
                                                        {common.convertTextDecimal(item.totalValue)}
                                                    </div>
                                                </Col>
                                                <Col span={3} className="floatRight">
                                                    <div className="label">
                                                        LÃI/LỖ
                                                    </div>
                                                    <div className="title" style={{color: item.totalRateLossValue > 0 ? color._GREEN : color._RED_VCSC}}>
                                                        {common.convertTextDecimal(item.totalRateLossValue)}
                                                    </div>
                                                </Col>
                                                <Col span={3} className="floatRight">
                                                    <div className="label">
                                                        % LÃI/LỖ
                                                    </div>
                                                    <div className="title" style={{color: item.totalPercentRateLoss > 0 ? color._GREEN : color._RED_VCSC}}>
                                                        {item.totalPercentRateLoss}
                                                    </div>
                                                </Col>
                                            </Row>
                                            
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
                                    <ExpandCollapse data={item.listOrder} getAssetInfoIndex={this.props.getAssetInfoIndex}/>
                                    : null
                                }
                            </div>
                        )
                    }) : null) : null}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstIndexAssetInfo: state.portFolio['INDEX.ASSET_INFO']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getAssetInfoIndex: (subNumber)=> dispatch(getAssetInfoIndex(subNumber)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (FollowPortfolio);