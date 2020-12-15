import React, {useEffect, useState} from 'react';
import {css} from 'emotion';
import {Col, Row, InputNumber } from 'antd';
import {getConfigs, updateConfigs} from '../../stores/actions/masterService/alertAction';
import {LoadingOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';
import CheckBox from '../../components/Control/CheckBox';
import * as common from '../../components/Common/Common';
// import * as socketIO from './socketIo/socketIo';

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
        .centerDiv{
            display: flex;
            align-items: center;
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

function WarningPrice(props){
    const accountInfo = JSON.parse(localStorage.getItem('accountInfoKey'));
    let msndtCode = '';
    if(accountInfo){
        msndtCode = accountInfo.userInfo.accounts[0].accountNumber;
    }

    const [isLoading, setLoading] = useState(false);
    const [surpassTopBot, setSurpassTopBot] = useState(0);
    const [upDownReferenceValue, setUpDownReferenceValue] = useState(0);
    const [upDownCapital, setUpDownCapital] = useState(0);
    const [quantityExchange, setQuantityExchange] = useState(5000);
    const [surpass30Day, setSurpass30Day] = useState(0);
    const [frequencyNotice, setFrequencyNotice] = useState(0);
    const [receivedAlert, setReceivedAlert] = useState(60);

    const [lstCheckBox, setLstCheckBox] = useState({
        surpassTopBot: false,
        isFloorCeiling: false,
        upDownReference: false,
        volumSellBuyMutation: false,
        upDownCapital: false,
        quantityExchange: false,
        market: ['vnallshare']
    });

    const { getConfigs, updateConfigs } = props;

    useEffect(loadData, []);

    function loadData(){
        loadGetConfigs();
    }

    async function loadGetConfigs(){
        try {
            const res = await getConfigs({msndt: msndtCode});
            if(res.data.length > 0){
                let data = res.data[0];
                let marketConfig = [];
                if(data.market){
                    marketConfig = JSON.parse(data.market);
                }
                
                setLstCheckBox({
                    ...res.data[0],
                    surpassTopBot: false,
                    market: marketConfig
                });
                //check value
                if(data.upDownReference){
                    setUpDownReferenceValue(data.upDownReferenceValue);
                }
            }
        } catch (error) {
            
        }
    }

    const onActiveNotify = async()=>{
        try {
            let data = {
                ...lstCheckBox,
                market: JSON.stringify(lstCheckBox.market),
                upDownReferenceValue: upDownReferenceValue,
                msndt: msndtCode
            }
            delete data._id; //remove _id
            setLoading(true);
            const res = await updateConfigs(data);
            setLoading(false);
            if(res.type === 'ALERT_CONFIGS.UPDATE'){
                common.notify("success", "Cập nhật thiết lập thành công!!!");
                loadGetConfigs();
            }
        } catch (error) {
            setLoading(false);
        }
    }

    const onChangeCheckbox = name => (e)=>{
        if(name){
            setLstCheckBox({
                ...lstCheckBox,
                [name]: e.target.checked
            });
        }
    }

    const onChangeCheckboxMarket = name => (e)=>{
        try {
            if(name){
                let { market } = lstCheckBox;
                let marketSet = [];
                let checked = e.target.checked;

                if(name === 'vnallshare'){
                    if(checked){
                        marketSet = [
                            'vnallshare'
                        ]
                    }
                }else{
                    let index = market.indexOf('vnallshare');
                    let arrMarketRemove = market;
                    if(index > -1){
                        market.splice(index, 1);
                        arrMarketRemove = market;
                    }
                    if(checked){
                        marketSet = [
                            ...arrMarketRemove,
                            ...[name]
                        ]
                    }else{
                        let index = market.indexOf(name);
                        if(index > -1){
                            arrMarketRemove.splice(index, 1);
                        }
                        marketSet = arrMarketRemove;
                    }
                }
                setLstCheckBox({
                    ...lstCheckBox,
                    market: marketSet
                });
            }
        } catch (error) {
            
        }
    }

    const _handleInputNumber = name => (e) => {
        switch(name){
            case 'surpassTopBot': 
                setSurpassTopBot(e);
                return;
            case 'upDownReference': 
                upDownReferenceValue(e);
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
                                <CheckBox 
                                    value={"Vượt đỉnh/chạm đáy trong"} 
                                    isChecked={lstCheckBox.surpassTopBot}
                                    _onChangeCheckbox={onChangeCheckbox('surpassTopBot')}
                                />&nbsp;
                                <InputNumber 
                                    className="inputNumberCss"
                                    min={1}
                                    max={12}
                                    value={surpassTopBot}
                                    onChange={_handleInputNumber('surpassTopBot')}
                                />&nbsp;
                                <span className="text">tuần</span>
                            </Col>
                            <Col xl={16} lg={24} className="centerDiv">
                                <CheckBox 
                                    value={"Chạm trần/sàn"}
                                    isChecked={lstCheckBox.isFloorCeiling}
                                    _onChangeCheckbox={onChangeCheckbox('isFloorCeiling')}
                                />
                            </Col>
                        </Row>
                        <Row className="p-top10">
                            <Col xl={8} lg={24}>
                                <CheckBox 
                                    value={"Giá tăng/giảm "}
                                    isChecked={lstCheckBox.upDownReference}
                                    _onChangeCheckbox={onChangeCheckbox('upDownReference')}
                                />&nbsp;
                                <InputNumber 
                                    className="inputNumberCss"
                                    min={1}
                                    max={12}
                                    value={upDownReferenceValue}
                                    onChange={_handleInputNumber('upDownReferenceValue')}
                                />&nbsp;
                                <span className="text">% so với giá tham chiếu</span>
                            </Col>
                            <Col xl={16} lg={24} className="centerDiv">
                                <CheckBox 
                                    value={"KL Mua/Bán đột biến"}
                                    // isChecked={lstCheckBox.isFloorCeiling}
                                    _onChangeCheckbox={onChangeCheckbox('isFloorCeiling')}
                                />
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
                                <CheckBox 
                                    value={"KL giao dịch trên "}
                                    // isChecked={lstCheckBox.quantityExchange}
                                    _onChangeCheckbox={onChangeCheckbox('quantityExchange')}
                                />&nbsp;
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
                            <CheckBox 
                                value={"Toàn thị trường"}
                                isChecked={lstCheckBox.market.includes('vnallshare') === true ? true : false}
                                _onChangeCheckbox={onChangeCheckboxMarket('vnallshare')}
                            />
                        </div>
                        <div className="p-top10">
                            <CheckBox 
                                value={"VN30"}
                                isChecked={lstCheckBox.market.includes('vn30') === true ? true : false}
                                _onChangeCheckbox={onChangeCheckboxMarket('vn30')}
                            />
                        </div>
                        <div className="p-top10">
                            <CheckBox 
                                value={"HNX30"}
                                isChecked={lstCheckBox.market.includes('hnx30') === true ? true : false}
                                _onChangeCheckbox={onChangeCheckboxMarket('hnx30')}
                            />
                        </div>
                        <div className="p-top10">
                            <CheckBox 
                                value={"Danh mục sở hữu"}
                                isChecked={lstCheckBox.market.includes('asset') === true ? true : false}
                                _onChangeCheckbox={onChangeCheckboxMarket('asset')}
                            />
                        </div>
                        <div className="p-top10">
                            <CheckBox 
                                value={"Danh mục quan tâm"}
                                isChecked={lstCheckBox.market.includes('favorite') === true ? true : false}
                                _onChangeCheckbox={onChangeCheckboxMarket('favorite')}
                            />
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
                            <CheckBox 
                                value={"Toàn thị trường"}
                            />
                        </div>
                        <div className="p-top10">
                            <CheckBox 
                                value={"VN30"}
                            />
                        </div>
                        <div className="p-top10">
                            <CheckBox 
                                value={"HNX30"}
                            />
                        </div>
                        <div className="p-top10">
                            <CheckBox 
                                value={"VNAIIShare"}
                            />
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
                    <button className="btnOrder" onClick={onActiveNotify}> {isLoading ? <LoadingOutlined /> : null}&nbsp;LƯU</button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state =>{
    return{
        objAlertConfigs: state.indexMasterService['ALERT_CONFIGS.GET']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getConfigs: (data)=> dispatch(getConfigs(data)),
        updateConfigs: (data)=> dispatch(updateConfigs(data)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (WarningPrice);