import React from 'react';
import {Form, Modal, Button, Row, Col} from 'antd';
import {css} from 'emotion';

let color = window['colors'];

const rootModalOTP = css`
    .ant-modal-content{
        border-radius: 8px;
    }
    .ant-modal-content > .ant-modal-header{
        border-radius: 8px;
    }
    .content{
        font-size: 1.2em;
        font-weight: 500;
        color: ${color._BLACK};
    }
    .btnOrder{
        font-size: 13px;
        font-weight: 600;
        color: ${color._WHITE};
        height: auto;
        width: 10em;
        border-radius: 4px;
        padding: 8px 0;
        background-color: ${color._BLUE_VCSC}!important;
        border: 1px solid ${color._BLUE_VCSC}!important;
        &:hover{
            background-color: ${color._BLUE_VCSC_HOVER}!important;
            border: 1px solid ${color._BLUE_VCSC_HOVER}!important;
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
            border: 1px solid ${color._RED_VCSC};
            color: ${color._RED_VCSC};
        }
    }
`

export default function Confirm(props) {
    const initConfigs = {
        isOpen: false,
        title: '',
        otp: 0,
        message: '',
        loading: false
    }

    const handleCancel = (e) => {
        props.onClose(e);
    };

    const _actionOk = ()=>{
        props.onActionOk();
    }

    let setting = {
        ...initConfigs,
        ...props.configs
    }

    return (
        <div>
            <Modal
                className={rootModalOTP}
                visible={setting.isOpen}
                centered={true}
                title={<div style={{fontSize: '1em', color: color._BLACK, fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Row>
                            <Col span={24} type="flex" align="middle">
                                {setting.title} 
                            </Col>
                        </Row>
                    </div>}
                onOk={_actionOk}
                onCancel={handleCancel}
                footer={null}
                bodyStyle={styles.bodyModal}
                maskStyle={styles.modalCss}
                width='30rem'
                closable={false}
            >
                <Form style={styles.bodyMain}>
                    <Form.Item style={{textAlign: 'center'}}>
                        <span className="content">{setting.message}</span>
                    </Form.Item>
                    <Form.Item>
                        <Row gutter={20}>
                            <Col span={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button key="back" onClick={handleCancel} className="btnReject">
                                    HỦY BỎ
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button key="submit" type="primary" loading={setting.isLoading} onClick={_actionOk} className="btnOrder">
                                    XÁC NHẬN
                                </Button>
                            </Col>
                        </Row>
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
    bodyMain:{
        width: '100%',
        paddingRight: 25,
        paddingLeft: 25,
        borderRadius: 8
    },
    modalCss: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    }
}