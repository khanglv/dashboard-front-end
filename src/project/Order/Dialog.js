import React from 'react';
import {Form, Modal, Button, Row, Col, Tag, List} from 'antd';
import * as common from '../../components/Common/Common';
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

export default function Dialog(props) {
    const handleCancel = () => {
        props.onClose();
    };

    const onActionBuy = (typeOfOrder)=>{
        props.onActionBuy(typeOfOrder);
    }

    let setting = {
        ...props.config,
        ...props.data
    }

    return (
        <div>
            <Modal
                className={rootModalDialog}
                visible={setting.isOpen}
                centered={true}
                title={<div style={{fontSize: 14, color: color._BLACK, fontWeight: 600}}>
                            XÁC NHẬN ĐẶT LỆNH
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
                                    <Tag color={setting.COMMAND === 1 ? color._BLUE_VCSC_LIGHT : color._RED_VCSC_LIGHT}>
                                        <span style={{color: setting.COMMAND === 1 ? color._BLUE_VCSC : color._RED_VCSC}}>{setting.COMMAND === 1 ? 'MUA' : 'BÁN'}</span>
                                    </Tag>
                                </Col>
                            </List.Item>
                            <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                <Col span={8} className="labelLeft">
                                    Mã CP
                                </Col>
                                <Col span={16} className="labelRight">
                                    {setting.STOCK_CODE} ({setting.NAME_STOCK})
                                </Col>
                            </List.Item>
                            {
                                setting.TYPEOFORDER === 1 || setting.TYPEOFORDER === 4 ?
                                    <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                        <Col span={8} className="labelLeft">
                                            Kiểu lệnh
                                        </Col>
                                        <Col span={16} className="labelRight">
                                            {setting.TYPE_COMMAND}
                                        </Col>
                                    </List.Item>
                                : null
                            }
                            
                            <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                <Col span={8} className="labelLeft">
                                    Số lượng
                                </Col>
                                <Col span={16} className="labelRight">
                                    {common.convertTextDecimal(setting.QUANTITY)}
                                </Col>
                            </List.Item>
                            <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                <Col span={8} className="labelLeft">
                                    {(setting.TYPEOFORDER === 2 || setting.TYPEOFORDER === 3) ? 'Giá dừng' : 'Giá'}
                                </Col>
                                <Col span={16} className="labelRight">
                                    {common.convertTextDecimal(setting.PRICE_ORDER || 0)}
                                </Col>
                            </List.Item>
                            {
                                setting.TYPEOFORDER === 3 ? 
                                <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                    <Col span={8} className="labelLeft">
                                        Giá giới hạn
                                    </Col>
                                    <Col span={16} className="labelRight">
                                        {common.convertTextDecimal(setting.PRICEORDER_LIMIT || 0)}
                                    </Col>
                                </List.Item>
                                : null
                            }
                            {(setting.TYPEOFORDER === 2 || setting.TYPEOFORDER === 3) ? 
                                <div>
                                    <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                        <Col span={8} className="labelLeft">
                                            Từ ngày
                                        </Col>
                                        <Col span={16} className="labelRight">
                                            {common.convertDDMMYYYY(setting.FROMDATE)}
                                        </Col>
                                    </List.Item>
                                    <List.Item style={{paddingLeft: 5, paddingRight: 5}}>
                                        <Col span={8} className="labelLeft">
                                            Đến ngày
                                        </Col>
                                        <Col span={16} className="labelRight">
                                            {common.convertDDMMYYYY(setting.TODATE)}
                                        </Col>
                                    </List.Item>
                                </div>
                            : null}
                        </List>
                        <div className="footerRoot p-top10">
                            <div className="border-line"></div>
                            <div style={{paddingBottom: 15, textAlign: 'center'}} className="footerOrder p-top15">Quý khách có muốn đặt lệnh {setting.COMMAND === 1 ? 'Mua' : 'Bán'} không?</div>
                            <Row gutter={15} justify="center">
                                <Col md={8} xs={12}>
                                    <Button key="back" onClick={handleCancel} className="btnReject">
                                        HỦY BỎ
                                    </Button>
                                </Col>
                                <Col md={8} xs={12}>
                                    <Button key="submit" onClick={()=> onActionBuy(setting.TYPEOFORDER)} className="btnOrder" loading={setting.isLoading}>
                                        ĐẶT LỆNH
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
    numberOtp: {
        fontSize: 14,
        color: '#67666e',
        fontWeight: 500
    },
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