import React, {useState, useEffect} from 'react';
import {Form, Modal, Button, Row, Col, Tag, List, InputNumber} from 'antd';
import * as common from '../../components/Common/Common';
import {debounce} from 'lodash';
import {css} from 'emotion';

let color = window['colors'];

const rootModalDialog = css`
    .ant-modal-content{
        border-radius: 8px;
    }
    .ant-modal-content > .ant-modal-header{
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        background-color: ${color._GREY_LIGHT_1}
    }
    .ant-modal-body{
        padding: 0
    }
    .bodyMain{
        padding: 1em;
        .labelLeft{
            font-weight: 500;
            color: ${color._GREY_666};
        }
        .labelRight{
            font-weight: 600;
            color: ${color._BLACK};
        }
        .ant-list-item{
            padding: 7px 0
        }
    }
    .footerRoot{
        width: 100%;
        border-radius: 8px;
        .moreInfo{
            padding: 15px;
            padding-top: 10px;
            .showMore, .showLess{
                font-weight: 600;
                color: ${color._BLUE_VCSC};
                cursor: pointer;
            }
        }
        .border-line{
            border: 1px solid ${color._GREY_LIGHT_2};
        }
        .footerOrder{
            color: ${color._BLACK};
            font-weight: 500;
        }
        .btnOrder{
            font-size: 13px;
            font-weight: 600;
            color: ${color._WHITE};
            height: auto;
            width: 100%;
            border-radius: 4px;
            padding: 8px 0;
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
            width: 100%;
            padding: 8px 0;
            border-radius: 4px;
            border: 1px solid ${color._RED_VCSC};
            &:hover{
                background-color: ${color._RED_LIGHT_2};
            }
        }
    }
`

const customSelectOrderNumber = css`
    position: relative;
	top: 6px;
	color: #333333;
	font-weight: 500;
    font-size: 13px;
    .ant-input-number{
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border: 1px solid ${color._STROKE};
    }
    .btnMoney{
        left: 2px;
        border-radius: 0;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        font-size: 11px;
        padding: 0 3px;
        top: -2px;
        background-color: ${color._STROKE};
        font-weight: 500;
        color: ${color._BLACK}
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
    
`

export default function Dialog(props) {
    // const [isVisibleMoney, setisVisibleMoney] = useState(false);
    const [objMarket, setObjMarket] = useState({
        lastPrice: null,
        ceilingPrice: null,
        floorPrice: null,
        market: 'HOSE'
    });
    const [priceOrder, setPriceOrder] = useState(0);
    const [isWarning, setIsWarning] = useState(0);
    const [isShowMore, setIsShowMore] = useState(false);

    useEffect(() => {
        setPriceOrder(props.data.orderPrice || 0);
    }, [props]);

    props.componentEvent.on("changeStockCode", (obj)=>{
        try {
            if(obj){
                setObjMarket({
                    lastPrice: obj.lastReal,
                    ceilingPrice: obj.ceilingPrice,
                    floorPrice: obj.floorPrice,
                    market: obj.market
                });
            }
        } catch (error) {
            
        }
    });

    const handleCancel = () => {
        setIsWarning(0);
        props.onClose();
    };

    const onActionOrderModify = (data)=>{
        try {
            if(isWarning === 0){
                props.onActionOrderModify({ ...data, priceEdit: priceOrder});
            }
        } catch (error) {
            
        }
    }

    let setting = {
        ...props.config,
        ...props.data
    }

    const updateSelectValue = async(event)=>{
        setIsWarning(0);
        await setPriceOrder(event);
        checkPriceOrder(event);
    }

    const showMoreLess = (isPrevCheck)=>{
        setIsShowMore(!isPrevCheck);
    }

    const checkPriceOrder = debounce(async(eventReceived)=> {
        try {
            let event = eventReceived;
            if(eventReceived === '' || eventReceived === null || eventReceived === undefined){
                event = 0;
            }
            if(parseFloat(event) < objMarket.floorPrice){
                // setIsWarning(2); //Giá thấp hơn giá sàn
            }else if(parseFloat(event) > objMarket.ceilingPrice){
                // setIsWarning(3); //Giá cao hơn giá trần
            }else{
                let arr = common.renderPriceSuggestion({
                    last: objMarket.lastPrice,
                    ceilingPrice: objMarket.ceilingPrice,
                    floorPrice: objMarket.floorPrice,
                    market: objMarket.market
                });
                let isInvalid = arr.findIndex(o => o.value === eventReceived);
                if(isInvalid < 0){
                    setIsWarning(6); //Giá không thuộc bước giá
                }
            }
        } catch (error) {
            
        }
    }, 500);

    return (
        <div>
            <Modal
                className={rootModalDialog}
                visible={setting.isOpen}
                centered={true}
                title={<div style={{fontSize: 14, color: '#333333', fontWeight: 600}}>
                            Hủy nhanh và đặt ngay Lệnh mới
                    </div>}
                footer={null}
                bodyStyle={styles.bodyModal}
                maskStyle={styles.modalCss}
                width='30em'
                closable={false}
            >
                <Form style={{width: '100%'}}>
                    <Form.Item>
                        <List split={false} className="bodyMain">
                            <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                <Col span={8} className="labelLeft">
                                    Lệnh
                                </Col>
                                <Col span={16} className="labelRight">
                                    <Tag color={setting.sellBuyType === 'BUY' ? color._BLUE_VCSC_LIGHT : color._RED_VCSC_LIGHT}>
                                        <span style={{fontSize: 13, color: setting.sellBuyType === 'BUY' ? color._BLUE_VCSC : color._RED_VCSC}}>{setting.sellBuyType === 'BUY' ? 'Mua' : 'Bán'}</span>
                                    </Tag>
                                </Col>
                            </List.Item>
                            <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                <Col span={8} className="labelLeft">
                                    Mã CP
                                </Col>
                                <Col span={16} className="labelRight">
                                    {setting.stockCode}
                                </Col>
                            </List.Item>
                            <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                <Col span={8} className="labelLeft">
                                    Kiểu lệnh
                                </Col>
                                <Col span={16} className="labelRight">
                                    {setting.orderType}
                                </Col>
                            </List.Item>
                            <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                <Col span={8} className="labelLeft">
                                    Số lượng
                                </Col>
                                <Col span={16} className="labelRight">
                                    {common.convertTextDecimal(setting.unmatchedQuantity)}
                                </Col>
                            </List.Item>
                            <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                <Col span={8} className="labelLeft">
                                    Giá
                                </Col>
                                <Col span={16} className="labelRight">
                                    <div className={customSelectOrderNumber}>
                                        <InputNumber 
                                            min={0} 
                                            value={priceOrder}
                                            onChange={updateSelectValue}
                                            formatter={value => common.formatterNumber(value)}
                                            parser={value => common.parserNumber(value)}
                                            step={common.stepPriceForExchanges({market: objMarket.market, last: priceOrder})}
                                        />
                                    </div>
                                    {
                                        [2,3,6].includes(isWarning) === true ? 
                                        <div style={{fontSize: 11, color: color._RED_VCSC, width: 'max-content', paddingTop: 10}}>
                                            {
                                                (() => {
                                                    switch(isWarning) {
                                                        case 2:
                                                            return 'Giá phải lớn hơn giá sàn';
                                                        case 3: 
                                                            return 'Giá phải thấp hơn giá trần';
                                                        case 6:
                                                            return 'Bước giá không hợp lệ';
                                                        default: 
                                                            return null;
                                                    }
                                                })()
                                            }
                                        </div> : null
                                    }
                                </Col>
                            </List.Item>
                            
                            {setting.sellBuyType === 'BUY' ? 
                                <div style={{fontSize: 12, color: '#c42127', paddingLeft: 5, paddingTop: 10}}>Vui lòng kiểm tra tiền / sức mua trước khi thực hiện lệnh!</div>
                            : null}
                        </List>
                        <div className="footerRoot p-top10">
                            <div className="border-line"></div>
                            <div style={{textAlign: 'center'}} className="footerOrder p-top15">
                                Quý khách có muốn sửa lệnh này không?
                            </div>
                            <div style={{paddingBottom: 15}}>
                                <div className="moreInfo">
                                    <span style={{fontSize: '0.8em'}}>
                                        Bằng việc <b>Xác nhận</b>, Quý khách hiểu và đồng ý các rủi ro xảy ra khi hủy thành công lệnh hiện tại 
                                        nhưng đặt lệnh thay thế thất bại do <b>thiếu sức mua</b> và <b>vi phạm nguyên tắc của phiên giao dịch</b>. 
                                        Cụ thể như sau:&nbsp;&nbsp;
                                        {!isShowMore ? <span className="showMore" onClick={()=> showMoreLess(isShowMore)}>... Xem thêm</span> : null} <br />
                                        {isShowMore ? <span>
                                            - Tăng giá đặt mua dẫn đến thiếu sức mua, lệnh Mua thay thế bị từ chối <br />
                                            - Hủy thành công lệnh mua (có sử dụng sức mua margin), nhưng lệnh thay thế 
                                                bị từ chối do thiếu sức mua (bị chiếm room cho vay của mã chứng khoán) <br />
                                            - Trong thời gian chuyển phiên, lệnh hiện tại được hủy thành công nhưng lệnh thay thế bị Sàn HOSE từ chối…
                                                Khi đó, <b>Quý khách vui lòng đặt lại lệnh mới</b> để chủ động giao dịch.
                                            <div><span className="showLess" onClick={()=> showMoreLess(isShowMore)}>... Ẩn bớt</span> <br /></div>
                                        </span> : null}
                                    </span>
                                </div>
                            </div>
                            <Row gutter={15} justify="center">
                                <Col md={8} xs={12}>
                                    <Button key="back" onClick={handleCancel} className="btnReject">
                                        HỦY BỎ
                                    </Button>
                                </Col>
                                <Col md={8} xs={12}>
                                    <Button key="submit" onClick={()=>onActionOrderModify(setting)} className="btnOrder">
                                        Xác nhận
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

const styles = {
    bodyModal: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 0
    },
    modalCss: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    }
}