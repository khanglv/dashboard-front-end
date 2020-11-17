import React, {Component} from 'react';
import {Row, Col, List} from 'antd';
import {css} from 'emotion';
import * as common from '../../../components/Common/Common';
import Loading from '../../../components/Loading/Loading';

const color = window['colors'];
const rootMain = css`
    height: 'auto';
    @media only screen and (max-width: 992px) {
        /* overflow: auto; */
    }
    .totalRoot{
        width: 100%;
        padding-left: 1em;
        padding-right: 1em;
        @media only screen and (max-width: 992px) {
            width: 200%;
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
            @media only screen and (max-width: 992px) {
                font-size: 1em;
            }
        }
        .floatRight{
            text-align: right;
        }
    }
    .header{
        width: 100%;
        background-color: ${color._GREY_LIGHT_2};
        padding: 1em;
        font-weight: 600;
        color: ${color._BLACK};
        border: 1px solid ${color._STROKE};
        border-top-left-radius: 0.3em;
        border-top-right-radius: 0.3em;
        @media only screen and (max-width: 992px) {
            width: 200%;
        }
        .floatRight{
            text-align: right;
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
            width: 200%;
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

class FollowStock extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: false
        }
    }

    render(){
        const {
            isLoading
        } = this.state;

        const data = this.props.data || {};
        console.log(data);
        let arrData = [];
        let totalProfitLoss = 0;
        let totalPrice = 0;
        if(Object.keys(data).length > 0){
            if(data.profitLossItems){
                arrData = data.profitLossItems;
                if(arrData.length > 0){
                    totalProfitLoss = arrData.reduce(function(accumulator, currentValue) {
                        return accumulator + currentValue.profitLoss;
                    }, 0);
                    totalPrice = arrData.reduce(function(accumulator, currentValue) {
                        return accumulator + currentValue.currentPrice * currentValue.buyingQuantity;
                    }, 0);
                }
            }
        }
        return(
            <div className={rootMain}>
                <Loading isLoading={isLoading}>
                    <Row className="totalRoot p-top10">
                        <Col span={12}></Col>
                        <Col span={4} className="floatRight">
                            <div className="label">
                                TỔNG GIÁ TRỊ HIỆN TẠI
                            </div>
                            <div className="title">
                                {common.convertTextDecimal(totalPrice)}
                            </div>
                        </Col>
                        <Col span={4} className="floatRight">
                            <div className="label">
                                LÃI/LỖ
                            </div>
                            <div className="title" style={{color: totalProfitLoss > 0 ? color._GREEN : color._RED_VCSC}}>
                                {common.convertTextDecimal(totalProfitLoss)}
                            </div>
                        </Col>
                        <Col span={3} className="floatRight">
                            <div className="label">
                                % LÃI/LỖ
                            </div>
                            <div className="title" style={{color: data.totalProfitLossRate > 0 ? color._GREEN : color._RED_VCSC}}>
                                {data.totalProfitLossRate}
                            </div>
                        </Col>
                        <Col span={1}/>
                    </Row>
                    <div className="p-top20">
                        <Row className="header">
                            <Col span={1}>
                                STT
                            </Col>
                            <Col span={2}>
                                Mã CP
                            </Col>
                            <Col span={3} className="floatRight">
                                Số lượng CP
                            </Col>
                            <Col span={3} className="floatRight">
                                Giá mua
                            </Col>
                            <Col span={3} className="floatRight">
                                Giá hiện tại
                            </Col>
                            <Col span={4} className="floatRight">
                                Giá trị hiện tại
                            </Col>
                            <Col span={4} className="floatRight">
                                Lãi/Lỗ
                            </Col>
                            <Col span={3} className="floatRight">
                                % Lãi/Lỗ
                            </Col>
                        </Row>
                        <div className="bodyRoot">
                            {arrData.length > 0 ?
                                <List
                                    size="default"
                                    bordered
                                    dataSource={arrData}
                                    className="styleListStock"
                                    renderItem={(item, idx) => 
                                    <List.Item className="item">
                                        <Col span={1}>
                                            {idx+1}
                                        </Col>
                                        <Col span={2} style={{fontWeight: 600}}>
                                            {item.stockCode}
                                        </Col>
                                        <Col span={3} className="floatRight">
                                            {common.convertTextDecimal(item.buyingQuantity)}
                                        </Col>
                                        <Col span={3} className="floatRight">
                                            {common.convertTextDecimal(item.buyingPrice)}
                                        </Col>
                                        <Col span={3} className="floatRight">
                                            {common.convertTextDecimal(item.currentPrice)}
                                        </Col>
                                        <Col span={4} className="floatRight">
                                            {common.convertTextDecimal(item.currentPrice * item.buyingQuantity)}
                                        </Col>
                                        <Col span={4} className="floatRight" style={{color: item.profitLoss > 0 ? color._GREEN : color._RED_VCSC}}>
                                            {common.convertTextDecimal(item.profitLoss)}
                                        </Col>
                                        <Col span={3} className="floatRight" style={{color: item.profitLossRate > 0 ? color._GREEN : color._RED_VCSC}}>
                                            {item.profitLossRate}
                                        </Col>
                                        <Col span={1} />
                                    </List.Item>}
                                />
                                : null
                            }
                        </div> 
                    </div>
                </Loading>
            </div>
        )
    }
}

export default FollowStock;