import React, {Component} from 'react';
import {Col, Row, Radio, Input, List, Checkbox, Button } from 'antd';
import {SwapOutlined } from '@ant-design/icons';
// import * as common from '../../components/Common/Common';

import {connect} from 'react-redux';
import {getStockList} from '../../../stores/actions/core/stockListAction';
import {actionProportion} from '../../../stores/actions/investor/proportionAction';
import {actionUploadIcon} from '../../../stores/actions/investor/uploadIconAction';

import Loading from '../../../components/Loading/Loading';

import * as common from '../../../components/Common/Common';
import {css} from 'emotion';

// const BASE_URL = process.env.REACT_APP_BASE_URL_INVEST;

// const BASE_URL_N = `${BASE_URL}/uploads/icon`;

const { Search } = Input;
const { TextArea } = Input;
let color = window['colors'];

const mainRoot = css`
    .labelHeader{
        color: ${color._BLACK};
        /* color: var(--blue);  */
        font-weight: 500;
        font-size: 1.7em;
        text-align: center;
    }
    .body_1{
        background-color: ${color._WHITE};
        border-radius: 0.6em;
        height: auto;
        padding: 1rem;
        .left{
            width: 70%;
            float: left;
            .lable{
                font-size: 13px;
                font-weight: 600;
                color: ${color._GREY_666}
            }
            .styleInput{
                border-radius: 0.3rem;
                border: 1px solid ${color._STROKE}
            }
            .isWarning{
                border: 1px solid ${color._RED_VCSC}
            }
        }
        .right{
            width: calc(30% - 1rem);
            background-color: ${color._STROKE};
            float: right;
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            height: 11.5rem;
            border-radius: 0.3rem;
            cursor: pointer;
            @media only screen and (max-width: 768px) {
                height: auto;
                padding: 1em;
                margin-top: 6em;
            }
            input[type="file"] {
                display: none!important;
            }
            &:hover{
                background-color: ${color._LIGHT_dce7f3};
            }
        }
        .clearBoth{
            clear: both;
        }
    }

    .body_2{
        .label{
            color: ${color._BLACK};
            font-weight: 600
        }
        .left{
            .rootStockCode{
                height: 70vh;
                .headerRoot{
                    background-color: ${color._GREY_LIGHT_2};
                    border: 1px solid ${color._STROKE};
                    width: 100%;
                    height: 7em;
                    padding: 1em;
                    border-top-left-radius: 0.3em;
                    border-top-right-radius: 0.3em;
                    @media only screen and (max-width: 768px) {
                        padding: 0.5em;
                        height: auto;
                    }
                    .radioOption{
                        padding: 1em;
                        padding-bottom: 0;
                        @media only screen and (max-width: 768px) {
                            padding: 0;
                            padding-top: 0.5em;
                        }
                        .ant-radio-inner{
                            border-color: ${color._STROKE};
                            &:after{
                                background-color: ${color._BLUE_VCSC};
                            }
                        }
                        .label{
                            font-weight: 500;
                        }
                    }
                }
                .styleSearch{
                    border-radius: 5em;
                    width: 100%;
                    border: 1px solid ${color._STROKE};
                    .ant-input-search-icon{
                        font-size: 1.4em;
                        color: ${color._GREY_999};
                    }
                }
                .bodyRoot{
                    background-color: ${color._WHITE};
                    height: calc(100% - 6em);
                    border: 1px solid ${color._STROKE};
                    border-top: 0;
                    border-bottom-left-radius: 0.3em;
                    border-bottom-right-radius: 0.3em;
                    padding: 1rem;
                    padding-bottom: 0;
                    overflow: auto;
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
                    .styleListStock{
                        border: 0;
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
                            &:hover{
                                background-color: ${color._HOVER};
                            }
                        }
                        .ant-pagination-item-active a{
                            color: ${color._BLUE_VCSC};
                        }
                        .ant-pagination-item-active{
                            border-color: ${color._BLUE_VCSC};
                        }
                        .ant-list-pagination{
                            margin-right: 0;
                        }
                    }
                }
            }
        }
        .swapStock{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 70vh;
            width: 100%;
            @media only screen and (max-width: 768px) {
                height: 5vh;
            }
            .iconSwap{
                color: ${color._GREY_999};
                font-size: 1.5em;
            }
        }
        .right{
            .mainLeft{
                height: 70vh;
                .headerRoot{
                    height: 3em;
                    padding-left: 1em;
                    display: flex;
                    align-items: center;
                    border-top-left-radius: 0.3em;
                    border-top-right-radius: 0.3em;
                    border: 1px solid ${color._STROKE};
                    background-color: ${color._GREY_LIGHT_2};
                    .label{
                        color: ${color._BLACK};
                        font-weight: 600
                    }
                }
                .bodyRoot{
                    background-color: ${color._WHITE};
                    height: calc(100% - 2.7em);
                    border: 1px solid ${color._STROKE};
                    border-top: 0;
                    border-bottom-left-radius: 0.3em;
                    border-bottom-right-radius: 0.3em;
                    overflow: auto;
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
                            &:hover{
                                background-color: ${color._HOVER};
                            }
                        }
                    }
                }
            }
        }
    }

    .footer{
        display: flex;
        justify-content: flex-end;
        @media only screen and (max-width: 768px) {
            justify-content: center;
        }
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
        .btnReject{
            font-size: 13px;
            font-weight: 600;
            color: ${color._RED_VCSC};
            height: auto;
            width: 10em;
            padding: 8px 0;
            border-radius: 4px;
            border: 1px solid ${color._RED_VCSC};
            &:hover{
                background-color: ${color._RED_LIGHT_2};
            }
        }
    }
`

class FormCreate extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            exChangeValue: 'all',
            data: [],
            dataSearch: [],
            dataSwap: this.props.dataPortfolio || [],
            valueSearch: '',
            portfolioInvest: '',
            portfolioDescription: '',
            isLoadingRoot: false,
            indexId: this.props.infoPortfolio.INDEXID || null,
            arrIndexsDetailOld: [],
            isWarning: false
        }
    }

    componentWillMount(){
        this.loadData();
    }

    componentWillUnmount(){
        this.props.dispatch({
            type: 'STOCKS.LIST',
            data: []
        });
    }

    loadData = async ()=>{
        try {
            const {dataSwap} = this.state;
            this.setState({isLoading: true});
            if(Object.keys(this.props.infoPortfolio).length > 0){
                this.setState({
                    portfolioInvest: this.props.infoPortfolio.NAME || '',
                    portfolioDescription: this.props.infoPortfolio.DESCRIPTION || '',
                    arrIndexsDetailOld: this.props.infoPortfolio.arrOld || []
                });
            }
            const res = await this.props.getStockList();
            if(res.type === 'STOCKS.LIST'){
                let dataTmp = [];
                if(this.props.lstStock.length > 0){
                    dataTmp = this.props.lstStock.filter(item => item.t === 'STOCK');
                    if(dataSwap.length > 0){
                        dataTmp = dataTmp.filter(o1 => dataSwap.map(o2 => o2.CODE).indexOf(o1.s) === -1);
                    }
                }
                
                this.setState({
                    isLoading: false, 
                    data: dataTmp
                });
            }
        } catch (error) {
            
        }
    }

    selectionStockCode = (code, name, exchanges)=>{
        const {
            dataSwap,
            data
        } = this.state;
        let dataTmp = [...data];
        let dataSwapTmp = [...dataSwap];
        if(data){
            dataTmp = dataTmp.filter(item => item.s !== code);
            dataSwapTmp = [ {CODE: code, NAME: name, EXCHANGES: exchanges}, ...dataSwap];
        }
        this.setState({dataSwap: dataSwapTmp, data: dataTmp, dataSearch: []});
    }

    onRevertStockCode = (stockCode, nameStock)=>{
        const {
            dataSwap,
            data
        } = this.state;
        let dataTmp = [...data];
        let dataSwapTmp = [...dataSwap];
        if(dataSwap.length > 0 && stockCode){
            dataSwapTmp = dataSwap.filter(item => item.CODE !== stockCode);
            dataTmp = [{s: stockCode, n1: nameStock}, ...data];
        }
        this.setState({dataSwap: dataSwapTmp, data: dataTmp, valueSearch: '', exChangeValue: 'all'});
    }

    onExchange = (e)=>{
        const {
            dataSwap
        } = this.state;

        let lst = this.props.lstStock.length > 0 ? this.props.lstStock.filter(item => item.t === 'STOCK') : [];
        //loại bỏ các phần tử nằm trong 1 mảng khác
        let exclude = lst.filter(o1 => dataSwap.map(o2 => o2.CODE).indexOf(o1.s) === -1);
        let lstTmp = [];
        if(lst.length > 0){
            switch(e.target.value){
                case 'HOSE':
                    lstTmp = exclude.filter(item => item.m === 'HOSE');
                    break;
                case 'HNX':
                    lstTmp = exclude.filter(item => item.m === 'HNX');
                    break;
                case 'UPCOM':
                    lstTmp = exclude.filter(item => item.m === 'UPCOM');
                    break;
                default:
                    lstTmp = exclude;
                    break;
            }
        }
        this.setState({exChangeValue: e.target.value, data: lstTmp, valueSearch: '', dataSearch: []});
    }

    onChangeSearch = async(event)=>{
        const {
            data,
        } = this.state;
        let updatedList = data;
        let dataSearchTmp = [];
        if(updatedList.length > 0 && event.target.value.length > 0){
            dataSearchTmp = updatedList.filter(function(item){
                return item.s.toLowerCase().search( `${event.target.value}`.toLowerCase()) !== -1;
            });
        }
        this.setState({dataSearch: dataSearchTmp, valueSearch: event.target.value});
    }

    onSearch = (value) =>{
        const {
            data
        } = this.state;
        let code = value.toLowerCase();
        const idx = data.findIndex(item => item.s.toLowerCase() === code);
        if(idx > -1){
            this.selectionStockCode(data[idx].s, data[idx].n1, data[idx].m);
            this.setState({valueSearch: ''});
        }
    }

    updateInputValue = (event)=>{
        this.setState({[event.target.name]: event.target.value, isWarning: false});
    }

    updataInputArea = (event)=>{
        if (event.keyCode === 13) {
            // this.setState({[event.target.name]: `${this.state.portfolioDescription}/n`});
        }
    }

    onCancelCreate = ()=>{
        this.props.cancelCreate();
    }

    onUploadImageLocal = async(e)=>{
        try {
            this.setState({loadingUpload: true});
            const file = await e.target.files[0];
            const formData = new FormData();
            formData.append('icon', file);
            await this.props.actionUploadIcon(formData);
            // this.setState({loadingUpload: false});
            
        } catch (error) {
            
        }
    }

    onProportion = async ()=>{
        try {
            const {
                dataSwap,
                portfolioInvest,
                portfolioDescription
            } = this.state;
            if(portfolioInvest.trim().length > 0){
                if(portfolioInvest.length > 50){
                    common.notify("warning", "Tên danh mục không được dài hơn 50 ký tự!!!");
                    this.setState({isWarning: true});
                }else if(portfolioDescription.length > 1000){
                    common.notify("warning", "Mô tả danh mục không được dài hơn 1000 ký tự!!!");
                }else{
                    if(dataSwap.length > 0){
                        this.setState({isLoadingRoot: true});
                        const res = await this.props.actionProportion({
                            arrData: JSON.stringify(dataSwap), 
                            indexsName: portfolioInvest,
                            type: this.props.infoPortfolio.TYPE || null
                        });
                        this.setState({isLoadingRoot: false});
                        if(res.type === 'PROPORTION.PUT'){
                            await this.props.dispatch({
                                type: 'PORTFOLIO.DATA',
                                data: dataSwap
                            });
                            this._onStoragePortfolio();
                            await this.props.dispatch({
                                type: 'NUMBER.PORTFOLIO.PAGE',
                                data: 3
                            });
                        }
                    }else{
                        common.notify("warning", "Cần chọn ít nhất một mã cổ phiếu để tiếp tục chức năng này!");
                    }
                }
            }else{
                common.notify("warning", "Cần nhập tên danh mục để tiếp tục!");
            }
        } catch (error) {
            
        }
    }

    _onStoragePortfolio = ()=>{
        const {
            portfolioInvest,
            portfolioDescription,
            indexId,
            arrIndexsDetailOld
        } = this.state;
        
        let data = {
            NAME: portfolioInvest,
            DESCRIPTION: portfolioDescription,
            IMAGE: Object.keys(this.props.indexIcon).length > 0 ? this.props.indexIcon.path : '',
            INDEXID: indexId,
            arrOld: arrIndexsDetailOld,
            TYPE: this.props.infoPortfolio.TYPE || null
        }

        this.props.dispatch({
            type: 'PORTFOLIO.INFO',
            data: data
        });
    }

    render(){
        const {
            isLoading,
            exChangeValue,
            data,
            dataSwap,
            valueSearch,
            dataSearch,
            portfolioInvest,
            isLoadingRoot,
            portfolioDescription,
            indexId,
            isWarning
        } = this.state;

        return(
            <div className={mainRoot}>
                <Loading isLoading={isLoadingRoot}>
                    <div className="labelHeader">
                        {indexId ? 'Sửa danh mục' : 'Tạo mới danh mục đầu tư'}
                    </div>
                    <div className="p-top15">
                        <div className="body_1">
                            <div className="left">
                                <Row gutter={[10, 10]}>
                                    <Col md={5} xs={24}>
                                        <span className="lable">Tên danh mục</span>
                                    </Col>
                                    <Col md={19} xs={24}>
                                        <Input 
                                            placeholder="Danh mục đầu tư"
                                            name="portfolioInvest"
                                            className={`styleInput ${isWarning ? 'isWarning' : ''}`}
                                            value={portfolioInvest}
                                            onChange={event => this.updateInputValue(event)}
                                        />
                                    </Col>
                                    <Col md={5} xs={24}>
                                        <span className="lable">Mô tả</span>
                                    </Col>
                                    <Col md={19} xs={24}>
                                        <TextArea 
                                            rows={6}
                                            value={portfolioDescription}
                                            className="styleInput"
                                            name="portfolioDescription"
                                            onChange={event => this.updateInputValue(event)}
                                            onPressEnter={event => this.updataInputArea(event)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <label id="file-upload-excel" style={{ marginBottom: 16 }}>
                                    {Object.keys(this.props.indexIcon).length === 0 ? 
                                        <div className="right">
                                            <img alt="" src="images/icons/another/ic_img.svg" />
                                            <div style={{color: color._BLUE_VCSC}}>Tải lên hình ảnh</div>
                                            <Input id="file-upload-excel" accept="image/*" type="file" onChange={this.onUploadImageLocal} />
                                        </div>
                                        :
                                        <div className="right">
                                            <img alt="" style={{maxWidth: '100%', maxHeight: '100%'}} src={`${this.props.indexIcon.path}`} />
                                            <Input id="file-upload-excel" accept="image/*" type="file" onChange={this.onUploadImageLocal} />
                                        </div>    
                                    }
                            </label>
                            <div className="clearBoth"></div>
                        </div>
                    </div>
                    <div className="body_2 p-top15">
                        <div className="label">Danh sách cổ phiếu</div>
                        <Row>
                            <Col xxl={11} lg={11} md={12} xs={24} className="left">
                                <div className="rootStockCode p-top10">
                                    <div className="headerRoot">
                                        <Search 
                                            // suffix={<SearchOutlined style={{color: color._STROKE, fontSize: '1.1rem'}}/>} 
                                            placeholder="Tìm kiếm"  
                                            className="styleSearch"
                                            value={valueSearch}
                                            onSearch={this.onSearch}
                                            onChange={this.onChangeSearch}
                                        />
                                        <div className="radioOption">
                                            <Radio.Group onChange={this.onExchange} value={exChangeValue}>
                                                <Radio value='all' className="label">Tất cả</Radio>
                                                <Radio value='HOSE' className="label">HOSE</Radio>
                                                <Radio value='HNX' className="label">HNX</Radio>
                                                <Radio value='UPCOM' className="label">UPCOM</Radio>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                    <div className="bodyRoot">
                                        {data.length > 0 ?
                                            <List
                                                size="small"
                                                bordered
                                                dataSource={dataSearch.length > 0 ? dataSearch : data}
                                                split={false}
                                                className="styleListStock"
                                                pagination={{defaultPageSize: 50, size: 'small'}}
                                                loading={isLoading}
                                                renderItem={item => 
                                                <List.Item className="item">
                                                    <Checkbox onChange={()=>this.selectionStockCode(item.s, item.n1, item.m)} checked={dataSwap.map(o2 => o2.CODE).indexOf(item.s) > -1}>
                                                        <span style={{fontWeight: 600, color: color._BLACK, display: 'inline-flex', width: '4em'}}>{item.s}</span>
                                                        <span style={{fontWeight: 500, color: color._BLACK}}>{item.n1}</span>
                                                    </Checkbox>
                                                </List.Item>}
                                            />
                                        : null}
                                    </div>
                                </div>
                            </Col>
                            <Col xxl={2} lg={2} md={1} xs={0} className="swapStock">
                                <SwapOutlined className="iconSwap"/>
                            </Col>
                            <Col xxl={11} lg={11} md={11} xs={24} className="right p-top10">
                                <div className="mainLeft">
                                    <div className="headerRoot label">
                                        Cổ phiếu đã chọn ({dataSwap.length})
                                    </div>
                                    <div className="bodyRoot">
                                        {data.length > 0 ?
                                            <List
                                                size="small"
                                                bordered
                                                dataSource={dataSwap}
                                                split={false}
                                                className="styleListStock"
                                                renderItem={item => 
                                                <List.Item className="item">
                                                    <Checkbox onChange={()=> this.onRevertStockCode(item.CODE, item.NAME)} checked={dataSwap.map(o2 => o2.CODE).indexOf(item.CODE) > -1}>
                                                        <span style={{fontWeight: 600, color: color._BLACK, display: 'inline-flex', width: '4em'}}>{item.CODE}</span>
                                                        <span style={{fontWeight: 500, color: color._BLACK}}>{item.NAME}</span>
                                                    </Checkbox>
                                                </List.Item>}
                                            />
                                        : null}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="footer p-top20">
                        <Button key="back" className="btnReject" onClick={this.onCancelCreate}>
                            HỦY BỎ
                        </Button>
                        <Button key="submit" className="btnOrder" onClick={this.onProportion}>
                            TIẾP TỤC
                        </Button>
                    </div>
                </Loading>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstStock: state.portFolio['STOCKS.LIST'],
        infoPortfolio: state.portFolio['PORTFOLIO.INFO'],
        dataPortfolio: state.portFolio['PORTFOLIO.DATA'],
        indexIcon: state.portFolio['UPLOAD.ICON']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getStockList: ()=> dispatch(getStockList()),
        actionProportion: (data)=> dispatch(actionProportion(data)),
        actionUploadIcon: (data)=> dispatch(actionUploadIcon(data)),
        cancelCreate: ()=> dispatch({
            type: 'NUMBER.PORTFOLIO.PAGE',
            data: 1
        }),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (FormCreate);