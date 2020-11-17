import React, {useState} from 'react';
import {css} from 'emotion';
import {Col, Row, InputNumber } from 'antd';
import CheckBox from '../../components/Control/CheckBox';
import * as common from '../../components/Common/Common';

let color = window['colors'];

const rootMain = css`
    .bodyMain{
        .label{
            font-weight: 500;
            color: ${color._BLACK};
            font-size: 20px;
        }
        .title{
            font-weight: 500;
            color: ${color._BLACK};
            font-size: 14px;
        }
        .text{
            font-weight: 500;
            color: ${color._BLACK};
        }
        
        .ant-input-number{
            width: 4em;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            border: 1px solid #e3e5ec;
        }
    }
    .footer{
        display: flex;
        justify-content: center;
        .left{
            .btnCancel{
                font-size: 13px;
                font-weight: 600;
                color: ${color._RED_VCSC};
                height: auto;
                border-radius: 4px;
                padding: 10px 1.5em;
                width: 10em;
                cursor: pointer;
                background-color: ${color._RED_LIGHT_2};
                border: 1px solid ${color._RED_VCSC};
                outline: none;
                &:hover{
                    background-color: ${color._RED_VCSC_HOVER};
                }
            }
        }
        .right{
            .btnOrder{
                font-size: 13px;
                font-weight: 600;
                color: ${color._WHITE};
                height: auto;
                border-radius: 4px;
                padding: 10px 1.5em;
                width: 10em;
                cursor: pointer;
                background-color: ${color._BLUE_VCSC};
                border: 1px solid ${color._BLUE_VCSC};
                outline: none;
                &:hover{
                    background-color: ${color._BLUE_VCSC_HOVER};
                    border: 1px solid ${color._BLUE_VCSC_HOVER};
                }
            }
        }
    }
`

function WarningPrice(){
    const [surpassTopBot, setSurpassTopBot] = useState(0);
    const [upDownReference, setUpDownReference] = useState(0);
    const [upDownCapital, setUpDownCapital] = useState(0);
    const [quantityExchange, setQuantityExchange] = useState(5000);
    const [surpass30Day, setSurpass30Day] = useState(0);
    const [frequencyNotice, setFrequencyNotice] = useState(0);
    const [receivedAlert, setReceivedAlert] = useState(60);

    const _handleInputNumber = name => (e) => {
        switch(name){
            case 'surpassTopBot': 
                setSurpassTopBot(e);
                return;
            case 'upDownReference': 
                setUpDownReference(e);
                return;
            case 'upDownCapital':
                setUpDownCapital(e);
                return;
            case 'quantityExchange':
                setQuantityExchange(e);
                return;
            case 'surpass30Day':
                setSurpass30Day(e);
                return;
            case 'frequencyNotice':
                setFrequencyNotice(e);
                return;
            case 'receivedAlert':
                setReceivedAlert(e);
                return;
            default:
                return;
        }
    }

    return(
        <div className={rootMain}>
            <div className="bodyMain">
                <div className="label">Cổ phiếu</div>
                <Row className="p-top10">
                    <Col span={4}>
                        <div className="title">Nội dung</div>
                    </Col>
                    <Col span={20}>
                        <Row>
                            <Col xl={8} lg={24}>
                                <CheckBox value={"Vượt đỉnh/chạm đáy trong"} isChecked={true}/>&nbsp;
                                <InputNumber 
                                    className="inputNumberCss"
                                    min={1}
                                    max={12}
                                    value={surpassTopBot}
                                    onChange={_handleInputNumber('surpassTopBot')}
                                />&nbsp;
                                <span className="text">tuần</span>
                            </Col>
                            <Col xl={16} lg={24}>
                                <CheckBox value={"Chạm trần/sàn"}/>
                            </Col>
                        </Row>
                        <Row className="p-top10">
                            <Col xl={8} lg={24}>
                                <CheckBox value={"Giá tăng/giảm "}/>&nbsp;
                                <InputNumber 
                                    className="inputNumberCss"
                                    min={1}
                                    max={12}
                                    value={upDownReference}
                                    onChange={_handleInputNumber('upDownReference')}
                                />&nbsp;
                                <span className="text">% so với giá tham chiếu</span>
                            </Col>
                            <Col xl={16} lg={24}>
                                <CheckBox value={"Chạm trần/sàn"}/>
                            </Col>
                        </Row>
                        <Row className="p-top10">
                            <Col xl={8} lg={24}>
                                <CheckBox value={"Giá tăng/giảm "}/>&nbsp;
                                <InputNumber 
                                    className="inputNumberCss"
                                    min={1}
                                    max={12}
                                    value={upDownCapital}
                                    onChange={_handleInputNumber('upDownCapital')}
                                />&nbsp;
                                <span className="text">% so với giá vốn</span>
                            </Col>
                            <Col xl={16} lg={24}>
                                <CheckBox value={"KL giao dịch trên "}/>&nbsp;
                                <InputNumber 
                                    className="inputNumberCss" 
                                    style={{width: '6em'}}
                                    min={1}
                                    max={10000000}
                                    step={100}
                                    value={quantityExchange}
                                    onChange={_handleInputNumber('quantityExchange')}
                                    formatter={value => common.formatterNumber(value)}
                                    parser={value => common.parserNumber(value)}
                                />
                                &nbsp;<span className="text">cổ phiếu</span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="p-top20">
                    <Col span={4}>
                        <div className="title">Liên quan</div>
                    </Col>
                    <Col span={20}>
                        <div className="p-top10">
                            <CheckBox value={"Toàn thị trường"}/>
                        </div>
                        <div className="p-top10">
                            <CheckBox value={"VN30"}/>
                        </div>
                        <div className="p-top10">
                            <CheckBox value={"HNX30"}/>
                        </div>
                        <div className="p-top10">
                            <CheckBox value={"Danh mục sở hữu"}/>
                        </div>
                        <div className="p-top10">
                            <CheckBox value={"Danh mục quan tâm"}/>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="bodyMain p-top20">
                <div className="label">Chỉ số</div>
                <Row className="p-top10">
                    <Col span={4}>
                        <div className="title">Nội dung</div>
                    </Col>
                    <Col span={20}>
                        <div className="p-top10">
                            <CheckBox value={"Vượt đỉnh/chạm đáy trong 30 ngày"}/>
                        </div>
                        <div className="p-top10">
                            <CheckBox value={"Vượt đỉnh/chạm đáy trong 30 ngày"}/>&nbsp;
                            <InputNumber 
                                className="inputNumberCss"
                                min={1}
                                max={30}
                                value={surpass30Day}
                                onChange={_handleInputNumber('surpass30Day')}
                            />&nbsp;
                            <span className="text">% so với đầu ngày</span>
                        </div>
                    </Col>
                </Row>
                <Row className="p-top20">
                    <Col span={4}>
                        <div className="title">Liên quan</div>
                    </Col>
                    <Col span={20}>
                        <div className="p-top10">
                            <CheckBox value={"Toàn thị trường"}/>
                        </div>
                        <div className="p-top10">
                            <CheckBox value={"VN30"}/>
                        </div>
                        <div className="p-top10">
                            <CheckBox value={"HNX30"}/>
                        </div>
                        <div className="p-top10">
                            <CheckBox value={"VNAIIShare"}/>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="bodyMain p-top20">
                <div className="label">Thiết lập</div>
                <Row className="p-top10">
                    <Col span={4}>
                        <div className="title">Tần suất cảnh báo</div>
                    </Col>
                    <Col span={20}>
                        <div className="p-top10">
                            <CheckBox value={"Báo 1 lần"}/>
                        </div>
                        <div className="p-top10">
                            <CheckBox value={"Báo liên tục tối đa"}/>&nbsp;
                            <InputNumber 
                                className="inputNumberCss"
                                min={1}
                                max={5}
                                value={frequencyNotice}
                                onChange={_handleInputNumber('frequencyNotice')}
                            />&nbsp;
                            <span className="text">lần/phút</span>
                        </div>
                    </Col>
                </Row>
                <Row className="p-top20">
                    <Col span={4}>
                        <div className="title">Hết hạn cảnh báo</div>
                    </Col>
                    <Col span={20}>
                        <div className="p-top10">
                            <CheckBox value={"Không hết hạn"}/>
                        </div>
                        <div className="p-top10">
                            <CheckBox value={"Báo"}/>&nbsp;
                            <InputNumber 
                                className="inputNumberCss"
                                min={30}
                                max={100}
                                step={10}
                                value={receivedAlert}
                                onChange={_handleInputNumber('receivedAlert')}
                            />&nbsp;
                            <span className="text">phút sau khi nhận cảnh báo</span>
                        </div>
                    </Col>
                </Row>
                <Row className="p-top20">
                    <Col span={4}>
                        <div className="title">Cảnh báo cho</div>
                    </Col>
                    <Col span={20}>
                        <div className="p-top10">
                            <CheckBox value={"Trình duyệt"}/>
                        </div>
                        <div className="p-top10">
                            <CheckBox value={"Ứng dụng di động"}/>
                        </div>
                        <div className="p-top10">
                            <CheckBox value={"Email"}/>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="footer p-top20">
                <div className="left">
                    <button className="btnCancel">HỦY BỎ</button>
                </div>
                <div className="right" style={{paddingLeft: 10}}>
                    <button className="btnOrder">LƯU</button>
                </div>
            </div>
        </div>
    )
}

export default WarningPrice;