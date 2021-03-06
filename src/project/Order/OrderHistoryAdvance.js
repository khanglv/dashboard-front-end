import React, {Component} from 'react';
import {Table, Tag, Row, Col, Select, Button} from 'antd';
import * as common from '../../components/Common/Common';
import Confirm from '../../components/Dialog/Confirm';
import {css} from 'emotion';
import {connect} from 'react-redux';
import {equityOrderAdvanceHistory, equityOrderAdvanceCancel} from '../../stores/actions/core/equityOrderAdvanceAction';
import {indexLogs} from '../../stores/actions/investor/indexLogs';

// const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
const { Option } = Select;
let color = window['colors'];

const rootMain = css`
    .btnCancel{
        background-color: ${color._RED_VCSC}!important;
        color: ${color._WHITE}!important;
        padding: 0 1.5em;
        top: 5px;
        height: auto;
        border-radius: 0.4em;
        border: 1px solid ${color._RED_VCSC}!important;
        &:hover{
            background-color: ${color._RED_VCSC_MY_HOVER}!important;
            border: 1px solid ${color._RED_VCSC_MY_HOVER}!important;
            color: ${color._WHITE};
        }
    }
    .datePicker{
        .ant-picker-input{
            input{
                font-size: 12px;
            }
        }
        top: 5px;
        border: 1px solid ${color._STROKE};
        border-radius: 0.3em;
        color: ${color._BLACK};
        font-weight: 500;
        svg{
            color: ${color._BLACK};
        }
    }
    .tableOrder{
        font-weight: 500;
        .ant-table-body, .ant-table-content{
            ::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            ::-webkit-scrollbar-track {
                /* box-shadow: inset 0 0 5px #b6b5b5; 
                border-radius: 8px; */
            }

            ::-webkit-scrollbar-thumb {
                background: #e0dede; 
                border-radius: 8px;
                width: 100px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #c3c3c3;
            }
        }
        .ant-table-thead{
            font-size: 12px;
            tr{
                th{
                    font-weight: 600;
                    color: #999999;
                    background-color: #f2f2f2;
                }
            }
        }
        .ant-table-tbody{
            font-size: 13px;
            tr{
                td{
                    border-bottom: 0;
                }
            }
        }

        .ant-checkbox-checked .ant-checkbox-inner{
            background-color: #00377b;
            border-color: #00377b;
        }

        .ant-checkbox-inner::after{
            background-color: #00377b;
        }
        @media only screen and (max-width: 992px) {
            .ant-table{
                font-size: 12px;
            }
        }
        .hide {
            display: none;
        }
        .available{
            display: inline-block!important;
            position: absolute;
            top: 0.5em
        }
        .ant-table-row{
            &:hover{
                .hide{
                    display: inline-block;
                    position: absolute;
                    top: 0.5em
                }
            }
        }
        .actionOrder{
            width: 5em;
            @media only screen and (max-width: 992px) {
                width: 4em;
            }
        }
    }
`

const customSelectOrder = css`
    width: 100%;
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
    .ant-select-selection-item, .ant-select-selection-placeholder{
        font-size: 13px;
    }
`

class OrderHistoryAdvance extends Component{
    constructor(props){
        super(props);
        this.state = {
            accountInfo: JSON.parse(localStorage.getItem('accountInfoKey')),
            currentKey: null,
            openDiaLog: false,
            stockCode: null,
            sellBuyType: 'Tất cả',
            dataOrderHistory: [],
            dataCancelMaster: [],
            orderSatus: 'Tất cả',
            marketType: 'Tất cả',
            isLoading: false,
            isLoadingBtn: false,
            isOpenConfirm: false
        }
    }

    setAvailable = (key)=>{
        this.setState({currentKey: key});
    }

    componentDidMount(){
        this.loadDataOrderAdvanceHistory();
    }

    componentDidUpdate(prev){
        if(this.props.isReloadHistoryAdvance){
            this.loadDataOrderAdvanceHistory();
            this.props.onStopLoadHistoryAdvance();
        }
    }

    loadDataOrderAdvanceHistory = async()=>{
        const {
            accountInfo,
            stockCode,
            sellBuyType,
            marketType,
        } = this.state;
        try {
            let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
            // '2020-05-22T10:00:00.000Z'
            this.setState({isLoading: true});
            await this.props.equityOrderAdvanceHistory({
                accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
                marketType: marketType === 'Tất cả' ? 'ALL' : marketType,
                subNumber: obj ? obj.SUB_NUMBER : '00',
                stockCode: stockCode === 'Tất cả' ? null : stockCode,
                sellBuyType: sellBuyType === 'Tất cả' ? null : sellBuyType,
                fetchCount: 100
            });
            this.setState({isLoading: false, openDiaLog: false});
        } catch (error) {
            this.setState({isLoading: false});
        }
    }

    confirmCancelOrderAdvance = async(data = {})=>{
        const {
            dataCancelMaster
        } = this.state;

        if(Object.keys(data).length > 0 && dataCancelMaster.length === 0){
            await this.setState({dataCancelMaster: [data]});
        }
        this.setState({isOpenConfirm: true});
    }

    _onActionOk = async()=>{
        const {
            dataCancelMaster
        } = this.state;

        try {
            if(dataCancelMaster.length > 0){
                this.setState({isLoadingBtn: true});
                let count = 0;
                for(let i = 0; i < dataCancelMaster.length; i ++){
                    let res = await this.cancelOrderAdvanceApi(dataCancelMaster[i]);
                    if(res.type === 'EQUITY_ORDER_ADVANCE.CANCEL'){
                        count = count + 1;
                        try {
                            this.props.indexLogs({...dataCancelMaster[i], type: 'advance'});
                        } catch (error) {
                            
                        }
                    }
                }
                if(count > 0){
                    common.notify("success", `Hủy ${count}/${dataCancelMaster.length} lệnh thành công!!!`);
                }
                this.setState({currentKey: '', isLoadingBtn: false, selectedRowKeys: [], dataCancelMaster: [], isOpenConfirm: false});
                this.loadDataOrderAdvanceHistory();
            }
        } catch (error) {
            this.setState({isLoadingBtn: false});
        }
    }


    cancelOrderAdvanceApi = async(data)=>{
        const {
            accountInfo
        } = this.state;

        let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));

        return await this.props.equityOrderAdvanceCancel({
            accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
            subNumber: obj ? obj.SUB_NUMBER : '00',
            orderNumber: data.orderNumber,
            advanceOrderDate: data.orderDate
        });
    }

    updateSelectValue = name => async(event)=>{
        await this.setState({[name]: event});
        this.loadDataOrderAdvanceHistory();
    }

    changeStockCodeShortcut = (value)=>{
        this.props._changeStockCodeShortcut(value);
    }

    _onCloseConfirm = ()=>{
        this.setState({isOpenConfirm: false});
    }

    render(){
        const {
            currentKey,
            selectedRowKeys,
            isLoading,
            dataCancelMaster,
            isOpenConfirm,
            isLoadingBtn
        } = this.state;

        const columns = [
            {
                title: 'Thời gian',
                dataIndex: 'orderTime',
                render: (id, record) => {
                    return(
                        <div>
                            <div>{common.stringToTimeHHMMSS(record.orderDate)}</div>
                            {record.orderStatus === 'PENDING' ? 
                            <span className={`hide ${currentKey === record.key ? 'available' : ''}`}>
                                {/* <img 
                                    style={{width: '1.5em', cursor: 'pointer'}} 
                                    alt="" src="icon/ic_edit.svg"
                                    onClick={()=> this.setEditOrderHistory(record)}
                                />&nbsp;&nbsp; */}
                                <span onClick={()=> this.confirmCancelOrderAdvanc(record)}>
                                    <img style={{width: '1.5em', cursor: 'pointer'}} alt="" src="icon/ic_delete.svg"/>
                                </span>
                            </span> : null}
                        </div>
                        
                    )
                }
            },
            {
                title: 'Số hiệu lệnh',
                dataIndex: 'branchCode',
                width: 100,
                render: branchCode =>{
                    return(
                        <div style={{fontWeight: 600}}>{branchCode}</div>
                    )
                }
            },
            {
                title: 'Mã CP',
                width: 60,
                dataIndex: 'stockCode',
                render: stockCode =>{
                    return(
                        <div style={{fontWeight: 600, cursor: 'pointer'}} onClick={()=>this.changeStockCodeShortcut(stockCode)}>{stockCode}</div>
                    )
                }
            },
            {
                title: 'Mua, Bán',
                dataIndex: 'sellBuyType',
                width: 80,
                render: (i, record) => {
                    return(
                        <Tag  color={record.status === 'CANCELLED' ? '#e1e3ea' : (record.sellBuyType === 'BUY' ? '#c6dfff' : '#ffd7d8')}>
                            <span 
                                style={{color: record.status === 'CANCELLED' ? '#999999' : (record.sellBuyType === 'BUY' ? '#00377b' : '#c42127'), fontWeight: 600}}
                            >
                                {record.sellBuyType === 'BUY' ? ' Mua' : 'Bán'}
                            </span>
                        </Tag>
                    )
                }
            },
            {
                title: 'SL Đặt',
                dataIndex: 'orderQuantity',
                align: 'right',
                render: orderQuantity => {
                    return(
                        <div>{common.convertTextDecimal(orderQuantity)}</div>
                    )
                }
            },
            {
                title: 'Giá',
                dataIndex: 'orderPrice',
                align: 'right',
                render: (i, record) => {
                    return(
                        <div>{record.orderPrice > 0 ? common.convertTextDecimal(record.orderPrice || 0) : record.orderType}</div>
                    )
                }
            },
            {
                title: 'Kiểu lệnh',
                dataIndex: 'orderType',
                render: orderType => {
                    return(
                        <div style={{fontWeight: 500}}>{orderType}</div>
                    )
                }
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                render: (tmp, record)=>{
                    // let returnStatus = common.statusOrderHistory({orderStatus: record.orderStatus, unmatchedQuantity: record.unmatchedQuantity});
                    return(
                        <div style={{color: color._RED_VCSC, fontWeight: 500}}>{record.orderStatus}</div>
                    )
                }
            },
            {
                title: 'Người đặt',
                dataIndex: 'username',
                width: 110,
                render: username => {
                    return(
                        <div style={{fontWeight: 500}}>{username}</div>
                    )
                }
            }
        ];

        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({dataCancelMaster: selectedRows, selectedRowKeys: selectedRowKeys});
            },
            getCheckboxProps: record => ({
                disabled: record.unmatchedQuantity === 0,
                key: record.key,
            }),
            columnWidth: 40
        };

        const dataTable = this.props.lstEquityHistoryAdvance.length > 0 ?
            this.props.lstEquityHistoryAdvance.map((item, idx)=>{
                return{
                    ...item,
                    key: idx
                }
            })
        : [];

        const lstStock = this.props.lstStock || [];

        return(
            <div className={rootMain}>
                <Confirm 
                    configs={
                        {
                            isOpen: isOpenConfirm,
                            title: 'Xác nhận',
                            message: <span>Quý khách có muốn hủy <b>{dataCancelMaster.length} lệnh</b> này không?</span>,
                            isLoading: isLoadingBtn
                        }} 
                    onClose={this._onCloseConfirm}
                    onActionOk={this._onActionOk}
                />
                <Row gutter={10} style={{padding: '0 20px'}}>
                    <Col xl={4} md={8} xs={8}>
                        <Select
                            className={customSelectOrder}
                            showSearch
                            allowClear
                            placeholder="Nhập mã CP"
                            onChange={this.updateSelectValue('stockCode')}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {lstStock.length > 0 ? lstStock.map((item, idx)=>{
                                return(
                                    <Option key={idx} value={item.s}>
                                        {item.s}
                                    </Option>
                                )
                            }) 
                            : null}
                        </Select>
                    </Col>
                    <Col xl={4} md={8} xs={8}>
                        <Select
                            className={customSelectOrder}
                            showSearch
                            placeholder="Tất cả lệnh"
                            onChange={this.updateSelectValue('sellBuyType')}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="Tất cả">Tất cả</Option>
                            <Option value="BUY">Mua</Option>
                            <Option value="SELL">Bán</Option>
                        </Select>
                    </Col>
                    <Col xl={4} md={8} xs={8}>
                        <Select
                            className={customSelectOrder}
                            showSearch
                            placeholder="Tất cả sàn"
                            onChange={this.updateSelectValue('marketType')}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="Tất cả">Tất cả</Option>
                            <Option value="HOSE">HOSE</Option>
                            <Option value="UPCOM">UPCOM</Option>
                            <Option value="HNX">HNX</Option>
                        </Select>
                    </Col>
                    
                    <Col xl={12} md={8} xs={8} style={{display: 'flex', justifyContent: 'flex-end'}}>
                    {
                        dataCancelMaster.length > 0 ? 
                            <Button className="btnCancel" onClick={()=>this.confirmCancelOrderAdvance()}>Hủy ({dataCancelMaster.length})</Button>
                        : null
                    }
                    </Col>
                </Row>
                <Table
                    className="tableOrder p-top20"
                    columns={columns} 
                    dataSource={dataTable}
                    size={'small'}
                    rowSelection={rowSelection}
                    scroll={{y: '34em'}}
                    pagination={false}
                    loading={isLoading}
                />
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        lstEquityHistoryAdvance: state.indexCore['EQUITY_ORDER_ADVANCE.HISTORY'],
        bankAccount: state.indexCore['BANK_ACCOUNT.LIST'],
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        equityOrderAdvanceHistory: (data)=> dispatch(equityOrderAdvanceHistory(data)),
        equityOrderAdvanceCancel: (data)=> dispatch(equityOrderAdvanceCancel(data)),
        indexLogs: (data)=> dispatch(indexLogs(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (OrderHistoryAdvance);
