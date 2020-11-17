import React, {Component} from 'react';
import {Row, Col, Tabs, Pagination } from 'antd';
import {CardItemFortfolio} from './Card';
import {SwapRightOutlined} from '@ant-design/icons';
import * as common from '../../../components/Common/Common';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import {getIndexsManagement} from '../../../stores/actions/investor/indexAction';
import {deleteIndex} from '../../../stores/actions/investor/indexAction';

import Loading from '../../../components/Loading/Loading';

import {css} from 'emotion';

const { TabPane } = Tabs;
let color = window['colors'];
const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;

const rootMain = css`
    height: auto;
    .header{
        .titleHead{
            font-size: 1.6em;
            font-weight: 500;
            color: ${color._BLACK};
            float: left;
        }
        .pagination{
            float: right;
            .ant-pagination-item-active a{
                color: ${color._BLUE_VCSC};
            }
            .ant-pagination-item-active{
                border-color: ${color._BLUE_VCSC};
            }
            .ant-pagination-item{
                &:hover{
                    border-color: ${color._BLUE_VCSC};
                }
                a{
                    &:hover{
                        color: ${color._BLUE_VCSC};
                    }
                }
            }
            .ant-pagination-prev, .ant-pagination-next{
                .ant-pagination-item-link{
                    &:hover{
                        border-color: ${color._BLUE_VCSC};
                    }
                    .anticon-left, .anticon-right{
                        color: ${color._BLUE_VCSC};
                    }
                }
                
            }
        }
        .clearBoth{
            clear: both;
        }
    }
    
    .rootBody{
        .ant-tabs-ink-bar{
            background-color: ${color._BLUE_VCSC};
        }
        .ant-tabs-tab{
            color: ${color._GREY_999};
            font-weight: 500;
            font-size: 1.3em;
            &:hover{
                color: ${color._BLUE_VCSC};
            }
        }
        .ant-tabs-tab-active{
            font-weight: 600;
            color: ${color._BLUE_VCSC};
        }
        .ant-tabs-content{
            .paddingItem{
                padding: 1em;
                font-weight: 500;
            }
            .itemPortfolio{
                background-color: ${color._WHITE};
                border-radius: 0.5em;
                overflow: auto;
                cursor: pointer;
                .updateMatchOrder{
                    background-color: ${color._ORANGE};
                    padding: 0.5em 0.6em;
                    border-radius: 0.3em;
                    color: ${color._WHITE};
                    font-weight: 600;
                    font-size: 13px;
                    z-index: 100;
                    &:hover{
                        background-color: #fab839;
                    }
                }
                .titleLabel{
                    padding: 1em 1em 0 1em;
                    font-size: 1.5em;
                    font-weight: 500;
                    color: ${color._BLACK}
                }
                .scroll{
                    @media only screen and (max-width: 992px) {
                        width: 300%;
                        height: auto;
                    }
                    .headerTotalStatistical{
                        border-radius: 8px;
                        padding: 0.8em 0;
                        background-color: ${color._WHITE};
                        .itemComp{
                            padding: 0 1.5em;
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
                        .rightEnd{
                            padding: 0 1.5em;
                            display: flex;
                            justify-content: flex-end;
                            color: ${color._BLUE_VCSC};
                            font-weight: 600;
                            cursor: pointer;
                            &:hover{
                                color: ${color._BLUE_LINK};
                            }
                        }
                        .borderRight{
                            border-right: 1px solid ${color._GREY_LIGHT_2};
                        }
                    }
                }
           } 
        }
    }
`

class ListPortfolio extends Component {
    constructor(props){
        super(props);
        this.state = {
            indexPage: 0,
            isLoading: false,
            isCloseConfirm: false
        }
    }

    componentDidMount(){
        this.loadData();
        this.props.dispatch({
            type: 'INDEX_ID_IN_DETAIL',
            data: null
        });
    }

    componentDidUpdate(prev){
        if(this.props.subNumberChange && prev.subNumberChange !== this.props.subNumberChange){
            this.loadData(this.props.subNumberChange);
        }
    }

    loadData = async()=>{
        try {
            await this.loadListIndexPage(0);
        } catch (error) {
            
        }
    }

    loadListIndexPage = async(indexPage)=> {
        try {
            let subNumber = '00';
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            if (obj) {
                if(obj.SUB_NUMBER){
                    subNumber = obj.SUB_NUMBER;
                }
            }
            this.setState({isLoading: true});
            await this.props.getIndexsManagement({indexPage: indexPage, numberPage: (windowWidth > 1600 || windowWidth < 768) ? 4 : 3, subNumber: subNumber});
            this.setState({isLoading: false});
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    onChangePagination = async(page, pageSize)=>{
        let indexPage = (page - 1)*pageSize;
        if(page === 1){
            indexPage = 0;
        }
        await this.setState({indexPage: indexPage});
        this.loadListIndexPage(parseInt(indexPage));
    }

    _onActionDeleteIndex = async(idIndex)=>{
        try {
            this.setState({isLoading: true});
            const res = await this.props.deleteIndex({id: idIndex});
            this.setState({isLoading: false});
            if(res.type === 'INDEX.DELETE'){
                this.loadData();
                common.notify("success", "Xóa danh mục thành công!!!");
                return true;
            }
            return false;
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    onActionDetail = (indexId, data)=>{
        if(data.totalValue > 0){
            this.props.history.push('/detail-portfolio-investing');
            this.props.dispatch({
                type: 'INDEX_ID_IN_DETAIL',
                data: indexId
            });
        }else{
            common.notify("warning", "Chưa có cổ phiếu nào khớp lệnh trong danh mục này!!!");
        }
    }

    _onMoveToHistory = (indexsId)=> (e)=>{
        if(indexsId){
            this.props.dispatch({
                type: 'INDEX_ID_IN_UPDATE',
                data: indexsId
            });
        }
        this.props.history.push('/history-portfolio');
        e.stopPropagation(); //stop action
    }

    onActionInvestment = (indexsId)=>{
        if(indexsId){
            this.props.history.push(`/detail-portfolio/${indexsId}`);
        }
    }

    _onEditPortfolio = async(dataUse)=>{
        if(Object.keys(dataUse).length > 0){
            let arrData = [];
            if(dataUse.indexsDetail.length > 0){
                arrData = dataUse.indexsDetail.map((item)=>{
                    return{
                        stockCode: item.stockCode,
                        id: item.id,
                        CODE: item.stockCode,
                        NAME: item.companyName,
                        proportion: item.proportionTarget
                    }
                });
            }
            await this.props.dispatch({
                type: 'PORTFOLIO.DATA',
                data: arrData
            });

            let data = {
                NAME: dataUse.indexsName,
                DESCRIPTION: dataUse.noted,
                IMAGE: dataUse.icon || '',
                INDEXID: dataUse.id,
                arrOld: arrData.length > 0 ? arrData.map((item)=>{
                    return{
                        ...item,
                        actionType: 'edit'
                    }
                }) : []
            }
    
            await this.props.dispatch({
                type: 'PORTFOLIO.INFO',
                data: data
            });

            await this.props.dispatch({
                type: 'UPLOAD.ICON',
                data: {path: dataUse.icon || ''}
            });

            this.props.createPortfolio();
            this.props.history.push('/portfolio-create');
            
        }
    }

    render(){
        const{
            isLoading
        } = this.state;

        const data = this.props.lstIndexManagement;
        let total = Object.keys(data).length > 0 ? data.lengthIndexs : 0;
        let lstIndexs = Object.keys(data).length > 0 ? data.data.indexs : [];
        let lstInvesting = Object.keys(data).length > 0 ? data.data.investing : [];
        let lstInvested = Object.keys(data).length > 0 ? data.data.invested : [];

        return(
            <div className={rootMain}>
                <Loading isLoading={isLoading}>
                    <div className="header">
                        <div className="titleHead p-top20">
                            Danh mục đã tạo
                        </div>
                        <div className="pagination p-top20">
                            <Pagination 
                                total={total} 
                                onChange={this.onChangePagination}
                                size="small"
                                hideOnSinglePage={true}
                                pageSize={(windowWidth > 1600 || windowWidth < 768) ? 4 : 3}
                                responsive={true}
                            />
                        </div>
                        <div className="clearBoth"></div>
                    </div>
                    
                    <div className="p-top20">
                        <Row gutter={[20, 20]}>
                            {lstIndexs.length > 0 ?
                                lstIndexs.map((item, idx)=>{
                                    return(
                                        <Col key={idx} xxl={6} xl={8} md={12} xs={24}>
                                            <CardItemFortfolio 
                                                data={item} 
                                                onActionDeleteIndex={this._onActionDeleteIndex}
                                                onEditPortfolio={this._onEditPortfolio}
                                            />
                                        </Col>
                                    )
                                })
                            : null}
                        </Row>
                    </div>
                    <div className="rootBody p-top20">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={`DM đang đầu tư (${lstInvesting.length})`} key="1">
                                {
                                    lstInvesting.length > 0 ?
                                        lstInvesting.map((item, idx)=>{
                                            return(
                                                <div key={idx} style={{paddingTop: idx !== 0 ? '1em' : 0}}>
                                                    <div className="itemPortfolio" onClick={()=> this.onActionDetail(item.indexsId, item)}>
                                                        <div className="titleLabel">
                                                            {item ? `${common.padWithZeroes(item.indexsId, 3)} - ${item.indexsName}` : null}
                                                            &nbsp;&nbsp; {
                                                                        <span className="updateMatchOrder" onClick={this._onMoveToHistory(item.indexsId)}>Cập nhật lệnh khớp</span> 
                                                                }
                                                        </div>
                                                        <div className="scroll">
                                                            <Row className="headerTotalStatistical">
                                                                <Col span={6} className="itemComp borderRight">
                                                                    <div className="title">TỔNG ĐẦU TƯ</div>
                                                                    <div className="content">{common.convertTextDecimal(item.totalValue)}</div>
                                                                </Col>
                                                                <Col span={6} className="itemComp borderRight">
                                                                    <div className="title">GIÁ TRỊ HIỆN TẠI</div>
                                                                    <div className="content">{common.convertTextDecimal(item.totalValueCurrent)}</div>
                                                                </Col>
                                                                <Col span={6} className="itemComp">
                                                                    <div className="title">GIÁ TRỊ LÃI/LỖ</div>
                                                                    <div className="content" style={{color: item.rateLossValue > 0 ? color._GREEN : color._RED_VCSC}}>{common.convertTextDecimal(item.rateLossValue)}&nbsp;({item.percentRateLoss}%)</div>
                                                                </Col>
                                                                <Col span={6} className="rightEnd">
                                                                    XEM CHI TIẾT&nbsp;<SwapRightOutlined style={{fontSize: '1.5em'}} />
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    : <div className="itemPortfolio paddingItem">Chưa có mục nào!!!</div>
                                }
                            </TabPane>
                            <TabPane tab={`DM đã tất toán (${lstInvested.length})`} key="2">
                                {
                                    lstInvested.length > 0 ?
                                        lstInvested.map((item, idx)=>{
                                            return(
                                                <div key={idx} style={{paddingTop: idx !== 0 ? '1em' : 0}} onClick={()=> this.onActionInvestment(item.indexsId)}>
                                                    <div className="itemPortfolio">
                                                        <div className="titleLabel">
                                                            {item ? `${common.padWithZeroes(item.indexsId, 3)} - ${item.indexsName}` : null}
                                                        </div>
                                                        <div className="scroll">
                                                            <Row className="headerTotalStatistical">
                                                                <Col span={6} className="itemComp borderRight">
                                                                    <div className="title">TỔNG ĐẦU TƯ</div>
                                                                    <div className="content">{common.convertTextDecimal(item.value)}</div>
                                                                </Col>
                                                                <Col span={6} className="itemComp borderRight">
                                                                    <div className="title">GIÁ TT HIỆN TẠI</div>
                                                                    <div className="content">{common.convertTextDecimal(item.currentValue)}</div>
                                                                </Col>
                                                                <Col span={6} className="itemComp">
                                                                    <div className="title">GIÁ TRỊ LÃI/LỖ</div>
                                                                    <div className="content" style={{color: item.rateLossValue > 0 ? color._GREEN : color._RED_VCSC}}>{common.convertTextDecimal(item.rateLossValue)}&nbsp;({item.percentRateLoss}%)</div>
                                                                </Col>
                                                                <Col span={6} className="rightEnd">
                                                                    XEM CHI TIẾT&nbsp;<SwapRightOutlined style={{fontSize: '1.5em'}} />
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    : <div className="itemPortfolio paddingItem">Chưa có mục nào!!!</div>
                                }
                            </TabPane>
                        </Tabs>
                        <div style={{height: 20, display: 'block'}}></div>
                    </div>
                </Loading>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstIndexManagement: state.portFolio['INDEX.MANAGEMENT']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getIndexsManagement: (data)=> dispatch(getIndexsManagement(data, false)),
        deleteIndex: (data)=> dispatch(deleteIndex(data)),
        createPortfolio: ()=> dispatch({
            type: 'NUMBER.PORTFOLIO.PAGE',
            data: 2
        }),
        dispatch
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (ListPortfolio));