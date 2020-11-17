import React from 'react';
import {Form, Modal, Button, Input, Row, Col} from 'antd';
import './styles.css';

export default function DialogOTP(props) {
    const [otpNumber, setOTPNumber] = React.useState('');

    const initConfigs = {
        isOpen: false,
        title: '',
        otp: 0,
        message: '',
        loading: false
    }

    const handleCancel = () => {
        props.onClose();
    };

    const handleChange = (event)=>{
        setOTPNumber(event.target.value);
    }

    const _confirmOTP = ()=>{
        props.confirmOTP(otpNumber);
    }

    const handleKeyPress = (event)=>{
        if(event.key === 'Enter'){
            _confirmOTP();
        }
    }

    let setting = {
        ...initConfigs,
        ...props.configs
    }

    return (
        <div>
            <Modal
                className="rootModalOTP"
                visible={setting.isOpen}
                centered={true}
                title={<div style={{fontSize: 16, color: '#333333', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Row>
                            <Col span={24} type="flex" align="middle">
                                {setting.title} 
                            </Col>
                            <Col span={24} type="flex" align="middle">
                                <span style={styles.numberOtp}>Số OTP: <span style={{color: '#333333', fontWeight: 600}}>{setting.otp}</span></span>
                            </Col>
                        </Row>
                    </div>}
                onOk={_confirmOTP}
                onCancel={handleCancel}
                footer={null}
                bodyStyle={styles.bodyModal}
                maskStyle={styles.modalCss}
                width='25rem'
                closable={false}
            >
                <Form style={styles.bodyMain}>
                    <Form.Item>
                        <Input 
                            placeholder="Số OTP"
                            onKeyPress={handleKeyPress}
                            onChange={handleChange}
                            size={'large'}
                            style={styles.inputType}
                            autoFocus={true}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Row>
                            <Col span={14} style={{paddingRight: 10}}>
                                <Button key="back" onClick={handleCancel} className="btnOptionLeft">
                                    Chế độ chỉ xem
                                </Button>
                            </Col>
                            <Col span={10}>
                                <Button key="submit" type="primary" loading={setting.loading} onClick={_confirmOTP} className="btnOptionRight">
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
    bodyMain:{
        width: '100%',
        paddingRight: 25,
        paddingLeft: 25,
        borderRadius: 8
    },
    modalCss: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    inputType:{
        borderRadius: 5, 
        border: '1px solid #c6dfff',
        fontSize: 14
    }
}