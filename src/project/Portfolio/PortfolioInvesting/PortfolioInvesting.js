import React, {Component} from 'react';
import {Row, Col, Button, Input, List } from 'antd';
import {CheckOutlined} from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux';
import {getIndexInvesting} from '../../../stores/actions/investor/indexAction';
import * as common from '../../../components/Common/Common';
import Loading from '../../../components/Loading/Loading';

import {css} from 'emotion';

let color = window['colors'];
const { TextArea } = Input;
const rootMain = css`
    padding-top: 10px;
    padding-bottom: 1em;
    max-width: 1400px;
    width: 100%;
    @media only screen and (max-width: 1600px) {
        height: calc(100vh - 100px);
        padding-top: 10px;
        max-width: 1200px;
        padding-bottom: 1em;
    }

    @media only screen and (max-width: 1200px) {
        height: calc(100vh - 100px);
        padding-top: 10px;
        max-width: 1000px;
        padding-bottom: 1em;
    }
    
    @media only screen and (max-width: 992px) {
        padding-right: 0.5rem;
        padding-left: 0.5rem;
        padding-bottom: 1em;
        height: auto;
        overflow: auto;
        width: 1400px;
    }
    .header{
        display: flex;
        align-items: center;
        .left{
            float: left;
            width: 50%;
            .title{
                font-weight: 500;
                font-size: 1.8em;
                display: flex;
                align-items: center;
                color: ${color._BLACK};
                .updateMatchOrder{
                    background-color: ${color._ORANGE};
                    padding: 0.5em 0.6em;
                    border-radius: 0.3em;
                    color: ${color._WHITE};
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    &:hover{
                        background-color: #fab839;
                    }
                }
            }
        }
        .right{
            float: right;
            width: 50%;
            display: flex;
            justify-content: flex-end;
            .textLabel{
                font-weight: 600;
                color: ${color._BLUE_VCSC};
                background-color: ${color._BLUE_VCSC_LIGHT};
                padding: 0.9em 2.5em;
                border-radius: 0.3em;
            }
        }
        .clearBoth{
            clear: both;
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
    .description{
        .label{
            font-weight: 600;
            color: ${color._GREY_666}
        }
        .rootBody{
            border-radius: 0.5em;
            background-color: ${color._WHITE};
            padding: 1em;
            height: 9em;
            overflow-y: auto;
        }
        .styleInput{
            border-radius: 0.5rem;
            border: 0;
            padding: 1em;
            background-color: ${color._WHITE};
            color: ${color._BLACK};
            cursor: auto;
        }
    }
    .rootMainBody{
        .label{
            font-weight: 600;
            color: ${color._GREY_666}
        }
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
        .main{
            height: 'auto';
            @media only screen and (max-width: 992px) {
                overflow: auto;
            }
            .header{
                background-color: ${color._GREY_LIGHT_2};
                padding: 0.8em 1em;
                font-size: 13px;
                font-weight: 600;
                color: ${color._BLACK};
                border: 1px solid ${color._STROKE};
                border-top-left-radius: 0.3em;
                border-top-right-radius: 0.3em;
                @media only screen and (max-width: 992px) {
                    width: 150%;
                }
                .alignRight{
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
                        font-size: 13px;
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
                        .alignRight{
                            text-align: right;
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
                width: 30%;
                float: left;
                .btnOrderF{
                    font-size: 13px;
                    font-weight: 600;
                    color: ${color._WHITE};
                    height: auto;
                    border-radius: 4px;
                    padding: 10px 2em;
                    background-color: ${color._RED_VCSC};
                    border: 1px solid ${color._RED_VCSC};
                    &:hover{
                        background-color: ${color._RED_VCSC_MY_HOVER};
                        border: 1px solid ${color._RED_VCSC_MY_HOVER};
                    }
                }
            }
            .right{
                float: right;
                .btnOrderS{
                    font-size: 13px;
                    font-weight: 600;
                    color: ${color._WHITE};
                    height: auto;
                    border-radius: 4px;
                    padding: 10px 2em;
                    margin-left: 2em;
                    background-color: ${color._ORANGE};
                    border: 1px solid ${color._ORANGE};
                    &:hover{
                        background-color: ${color._ORANGE_HOVER};
                        border: 1px solid ${color._ORANGE_HOVER};
                    }
                }
                .btnOrderT{
                    font-size: 13px;
                    font-weight: 600;
                    color: ${color._WHITE};
                    height: auto;
                    width: 10em;
                    border-radius: 4px;
                    padding: 10px 0;
                    margin-left: 2em;
                    background-color: ${color._BLUE_VCSC};
                    border: 1px solid ${color._BLUE_VCSC};
                    &:hover{
                        background-color: ${color._BLUE_VCSC_HOVER};
                        border: 1px solid ${color._BLUE_VCSC_HOVER};
                    }
                }
                .btnCopy{
                    font-size: 13px;
                    font-weight: 600;
                    color: ${color._WHITE};
                    height: auto;
                    width: auto;
                    border-radius: 4px;
                    padding: 10px 2em;
                    margin-left: 1em;
                    background-color: ${color._BLACK};
                    border: 1px solid ${color._BLACK};
                    &:hover{
                        background-color: #3b4148;
                        border: 1px solid #3b4148;
                    }
                }
            }
            .clearBoth{
                clear: both;
            }
        }
    }   
`

class PortfolioInvesting extends Component{
    constructor(props){
        super(props);
        this.state= {
            indexID: null,
            dataStatislic: {},
            isLoading: false
        }
    }

    componentDidUpdate(prev){
        if(this.props.subNumberChange && prev.subNumberChange !== this.props.subNumberChange){
            window.location.href = '/list-portfolio';
        }
    }

    componentWillMount(){
        const idTmp = this.props.indexId;
        // this.setState({indexID: params.indexID, dataStatislic: this.props.location.state || {}});
        this.setState({indexID: idTmp});
        if(idTmp){
            this.loadData(idTmp);
        }else{
            window.location.href = '/list-portfolio';
        }
        // this.setState({dataStatislic: this.props.location.state || {}});;
    }

    loadData = async (indexID)=>{
        try {
            this.setState({isLoading: true});
            await this.props.getIndexInvesting({
                indexsId: parseInt(indexID)
                // totalValueCurrent: totalValueCurrent || 0
            });
            this.setState({isLoading: false});
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    onActionInvestMore = ()=>{
        const {
            indexID
        } = this.state;
        if(indexID){
            this.props.history.push(`/detail-portfolio/${indexID}`);
        }
    }

    onActionSalePortfolio = (lstIndexs)=>{
        this.props.dispatch({
            type: 'NUMBER.PORTFOLIO_INVESTING.PAGE',
            data: 2
        });
        this.props.dispatch({
            type: 'LIST.INDEXS.INVESTING',
            data: {
                lstIndexs: lstIndexs,
                indexId: this.props.objIndexInvesting.id
            }
        });
    }

    onActionRebalance = (lstIndexs, currentValue)=>{
        this.props.dispatch({
            type: 'NUMBER.PORTFOLIO_INVESTING.PAGE',
            data: 3
        });
        this.props.dispatch({
            type: 'LIST.INDEXS.INVESTING',
            data: {
                lstIndexs: lstIndexs,
                totalValueCurrent: currentValue,
                indexId: this.props.objIndexInvesting.id
            }
        });
    }

    _onMoveToHistory = (indexsId)=>{
        if(indexsId){
            this.props.dispatch({
                type: 'INDEX_ID_IN_UPDATE',
                data: indexsId
            });
        }
        this.props.history.push('/history-portfolio');
    }

    onActionMove = (lstIndexs, dataUse)=>{
        this.props.dispatch({
            type: 'NUMBER.PORTFOLIO_INVESTING.PAGE',
            data: 4
        });

        this.props.dispatch({
            type: 'LIST.INDEXS.MOVE',
            data: {
                indexsDetail: lstIndexs,
                indexsName: dataUse.indexsName,
                indexsId: this.props.objIndexInvesting.id || ''
            }
        });
    }

    render(){
        const {
            isLoading
        } = this.state;

        let data = this.props.objIndexInvesting;
        let lstIndexs = Object.keys(data).length > 0 ? data.arrIndexsDetail : [];
        return(
            <div>
                <Loading isLoading={isLoading}>
                    <div className={rootMain}>
                        <div className="header p-top10">
                            <div className="left">
                                <div className="title">
                                    {data.indexsName}&nbsp;&nbsp;
                                    {data.isRefresh ?
                                        <span className="updateMatchOrder" onClick={()=> this._onMoveToHistory(data.id)}>Cập nhật lệnh khớp</span>
                                    : null}
                                </div>
                            </div>
                            <div className="right">
                                <span className="textLabel"><CheckOutlined style={{fontSize: 16}}/>&nbsp;&nbsp;ĐANG ĐẦU TƯ</span>
                            </div>
                            <div className="clearBoth"></div>
                        </div>
                        
                        <div className="comHeaderRoot p-top20">
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
                        <div className="description p-top20">
                            <div className="label">
                                Mô tả
                            </div>
                            <div className="p-top10">
                                <TextArea 
                                    value={data.noted} 
                                    rows={5}
                                    className="styleInput"
                                    disabled
                                />
                                {/* <div className="rootBody">
                                    {data.noted}
                                </div> */}
                            </div>
                        </div>
                        <div className="rootMainBody p-top20">
                            <div className="main p-top20">
                                <Row className="header">
                                    <Col span={2}>
                                        Mã CP
                                    </Col>
                                    <Col span={6}>
                                        Tên cổ phiếu
                                    </Col>
                                    <Col span={2} className="alignRight">
                                        Số lượng CP
                                    </Col>
                                    <Col span={3} className="alignRight">
                                        KL bán chưa khớp
                                    </Col>
                                    <Col span={3} className="alignRight">
                                        Tổng GT hiện tại
                                    </Col>
                                    <Col span={3} className="alignRight">
                                        Tỉ trọng hiện tại
                                    </Col>
                                    <Col span={3} className="alignRight">
                                        Tỉ trọng mục tiêu
                                    </Col>
                                    <Col span={2} className="alignRight">
                                        % Chênh lệch
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
                                            <List.Item className="item">
                                                <Col span={2}>
                                                    <span style={{fontWeight: 600}}>{item.stockCode}</span>
                                                </Col>
                                                <Col span={6}>
                                                    <span style={{fontWeight: 500}}>{item.companyName}</span>
                                                </Col>
                                                <Col span={2} className="alignRight">
                                                    <span style={{fontWeight: 500}}>{common.convertTextDecimal(item.quantity)}</span>
                                                </Col>
                                                <Col span={3} className="alignRight">
                                                    <span style={{fontWeight: 500, color: item.quantitySelling > 0 ? color._RED_VCSC : null}}>{common.convertTextDecimal(item.quantitySelling)}</span>
                                                </Col>
                                                <Col span={3} className="alignRight">
                                                    <span style={{fontWeight: 500}}>{common.convertTextDecimal(item.currentValue)}</span>
                                                </Col>
                                                <Col span={3} className="alignRight">
                                                    <span style={{fontWeight: 500}}>{item.proportionReal}%</span>
                                                </Col>
                                                <Col span={3} className="alignRight">
                                                    <span style={{fontWeight: 500}}>{item.proportionTarget}%</span>
                                                </Col>
                                                <Col span={2} className="alignRight">
                                                    <span style={{fontWeight: 500}}>{item.percentDifference}%</span>
                                                </Col>
                                            </List.Item>}
                                        />
                                    : null}
                                </div>
                            </div>
                            
                            <div className="footer p-top20">
                                <div className="left">
                                    <Button key="submit1" className="btnOrderF" onClick={()=> this.onActionSalePortfolio(lstIndexs)}>
                                        {'BÁN DANH MỤC'}
                                    </Button>
                                </div>
                                <div className="right">
                                    <Button key="submit2" className="btnOrderS" onClick={()=> this.onActionRebalance(lstIndexs, data.totalValueCurrent)}>
                                        {'TÁI CÂN BẰNG DM'}
                                    </Button>
                                    <Button key="submit3" className="btnOrderT" onClick={this.onActionInvestMore}>
                                        {'ĐẦU TƯ THÊM'}
                                    </Button>
                                </div>
                                <div className="right">
                                    <Button key="submit" className="btnCopy" onClick={()=>this.onActionMove(lstIndexs, data)}>
                                        CHUYỂN CP NGOÀI VÀO DANH MỤC
                                    </Button>
                                </div>
                                <div className="clearBoth"></div>
                            </div>
                            <div style={{height: 20, display: 'block'}}></div>
                        </div>
                    </div>
                </Loading>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        objIndexInvesting: state.portFolio['INDEX.INVESTING'],
        indexId: state.portFolio['INDEX_ID_IN_DETAIL']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getIndexInvesting: (indexID)=> dispatch(getIndexInvesting(indexID)),
        dispatch
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (PortfolioInvesting));