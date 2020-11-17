import React, {Component, useState} from 'react';
import {Row, Col, Input, Modal} from 'antd';
import {CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';
import {css} from 'emotion';
import * as storage from '../../api/storage';
import * as common from '../Common/Common';
import Confirm from '../Dialog/Confirm';
import {connect} from 'react-redux';
import {changeHTSPassword} from '../../stores/actions/core/equityAccountAction';

let color = window['colors'];

const rootMain = css`
    display: grid;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 10em;
    padding-bottom: 1em;
    .body{
        max-width: 500px;
        width: 100%;
        height: auto;
        background-color: ${color._WHITE};
        border-radius: 0.7em;
        position: relative;
        .imgAvatar{
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .content{
            padding: 2em;
            padding-bottom: 1em;
            padding-top: 7em;
            .title{
                font-weight: 600;
                font-size: 24px;
                text-align: center;
                color: ${color._BLACK};
            }
            .mainContent{
                padding-top: 1em;
                font-size: 13px;
                font-weight: 500;
                color: ${color._GREY_666};
                .ant-col{
                    padding: 0.5em 0.3em;
                }
                .right{
                    text-align: right;
                    color: ${color._BLACK};
                }
                .radiusCustom{
                    width: 100%;
                    border-bottom: 1px solid ${color._GREY_LIGHT_2}
                }
            }
        }
    }
    .footer{
        padding-top: 20px;
        .btnChangePassword{
            background-color: ${color._BLUE_VCSC};
            color: ${color._WHITE};
            font-size: 13px;
            font-weight: 600;
            outline: none;
            border: 1px solid ${color._BLUE_VCSC};
            width: 100%;
            padding: 0.6em;
            border-radius: 0.3em;
            cursor: pointer;
            &:hover{
                background-color: ${color._BLUE_VCSC_HOVER};
                border: 1px solid ${color._BLUE_VCSC};
            }
        }
        .btnLogout{
            background-color: ${color._RED_VCSC};
            color: ${color._WHITE};
            font-size: 13px;
            font-weight: 600;
            outline: none;
            border: 1px solid ${color._RED_VCSC};
            width: 100%;
            padding: 0.6em;
            border-radius: 0.3em;
            cursor: pointer;
            &:hover{
                background-color: ${color._RED_VCSC_MY_HOVER};
                border: 1px solid ${color._RED_VCSC};
            }
        }
    }
`

const rootChangePassword = css`
    display: grid;
    justify-content: center;
    padding-top: 4em;
    .header{
        text-align: center;
        width: 100%;
        font-size: 24px;
        font-weight: 600;
        color: ${color._BLACK};
    }
    .bodyChangePassword{
        width: 450px;
        height: auto;
        position: relative;
        background-color: ${color._WHITE};
        border-radius: 0.7em;
        padding: 2em;
        .item{
            display: flex;
            align-items: center;
            .left{
                float: left;
                width: 40%;
                font-size: 13px;
                font-weight: 600;
                color: ${color._BLACK};
            }
            .right{
                float: right;
                width: 60%;
                .customInput{
                    border-radius: 4px;
                    &:hover{
                        border: 1px solid ${color._BLUE_VCSC_LIGHT};
                    }
                    &:focus{
                        border: 1px solid ${color._BLUE_VCSC_LIGHT};
                    }
                }
                .isWarning{
                    border: 1px solid ${color._RED_VCSC};
                }
                .iconCheck{
                    font-size: 16px;
                    color: ${color._GREY_CCC};
                }
                .isActiveIcon{
                    color: ${color._GREEN};
                }
                .title{
                    font-size: 12px;
                    font-weight: 500;
                    color: ${color._BLACK};
                }
                .itemCheck{
                    &:hover{
                        .title{
                            color: ${color._BLUE_VCSC};
                        }
                    }
                }
            }
        }
    }
    .footer{
        .btnUpdate{
            background-color: ${color._BLUE_VCSC};
            color: ${color._WHITE};
            font-size: 13px;
            font-weight: 600;
            outline: none;
            border: 1px solid ${color._BLUE_VCSC};
            width: 100%;
            padding: 0.6em;
            border-radius: 0.3em;
            cursor: pointer;
            &:hover{
                background-color: ${color._BLUE_VCSC_HOVER};
                border: 1px solid ${color._BLUE_VCSC};
            }
        }
        .btnCancel{
            color: ${color._RED_VCSC};
            font-size: 13px;
            font-weight: 600;
            outline: none;
            border: 1px solid ${color._RED_VCSC};
            width: 100%;
            padding: 0.6em;
            border-radius: 0.3em;
            cursor: pointer;
            &:hover{
                border: 1px solid ${color._RED_VCSC};
                background-color: ${color._RED_VCSC_HOVER};
            }
        }
    }
`

class InfoAccount extends Component{
    constructor(props){
        super(props);
        this.state = {
            isChangePassword: false,
            isOpenConfirm: false,
            userInfo: JSON.parse(localStorage.getItem('userInfoKey')),
            accountInfo: JSON.parse(localStorage.getItem('accountInfoKey')),
        }
    }

    _handleBackToInfo = ()=>{
        this.setState({isChangePassword: false});
    }

    _handleChangePassWord = ()=>{
        this.setState({isChangePassword: true});
    }

    _onLogout = ()=>{
        this.setState({isOpenConfirm: true});
    }

    _onActionOk = async()=>{
        await storage.removeStorageToken();
        window.location.href = "/login";
    }

    _onCloseConfirm = ()=>{
        this.setState({isOpenConfirm: false});
    }

    render(){
        const {
            isChangePassword,
            isOpenConfirm,
            userInfo,
            accountInfo
        } = this.state;

        return(
            <div style={{overflow: 'auto'}}>
                <Confirm 
                    configs={
                        {
                            isOpen: isOpenConfirm,
                            title: 'Xác nhận',
                            message: <span>Quý khách có muốn đăng xuất không?</span>
                        }} 
                    onClose={this._onCloseConfirm}
                    onActionOk={this._onActionOk}
                />
                {
                    isChangePassword ? 
                    <ChangePassword 
                        handleBackToInfo={this._handleBackToInfo}
                        accountInfo={accountInfo}
                        changeHTSPassword={this.props.changeHTSPassword}
                    /> 
                    : <Infomation 
                        handleChangePassWord={this._handleChangePassWord}
                        onLogout={this._onLogout}
                        infoAccount={{
                            userInfo: userInfo,
                            accountInfo: accountInfo
                        }}
                    />
                }
            </div>
        )
    }
}

function Infomation(props){
    const handleChangPassWord = ()=>{
        props.handleChangePassWord();
    }

    const onLogout = ()=>{
        props.onLogout();
    }

    let userInfo = props.infoAccount.userInfo || {};
    let accountInfo = props.infoAccount.accountInfo.userInfo || {};

    return(
        <div className={rootMain}>
            <div className="body">
                <div className="imgAvatar">
                    <img alt="" src="./images/icons/another/ic_avatar.svg" />
                </div>
                <div className="content">
                    <div className="title">
                        {userInfo.customerName.toUpperCase()}
                    </div>
                    <div className="mainContent">
                        <Row gutter={5}>
                            <Col span={12}>
                                Số Tài Khoản
                            </Col>
                            <Col span={12} className="right">
                                {accountInfo.username}
                            </Col>
                            {/* <Col span={14}>
                                Thiết lập Tiểu khoản mặc định
                            </Col>
                            <Col span={10} className="right">
                                068C000717
                            </Col> */}
                            <div className="p-top10 radiusCustom"></div>
                            <div className="p-top10" style={{width: '100%'}}></div>
                            <Col span={8}>
                                Họ và tên
                            </Col>
                            <Col span={16} className="right">
                                {userInfo.customerName}
                            </Col>
                            <Col span={12}>
                                Ngày sinh
                            </Col>
                            <Col span={12} className="right">
                                {common.convertDDMMYYYY(common.splitStringDate(userInfo.dateOfBirth))}
                            </Col>
                            <Col span={12}>
                                CMND/Hộ Chiếu
                            </Col>
                            <Col span={12} className="right">
                                {userInfo.identifierNumber}
                            </Col>
                            <Col span={12}>
                                Ngày cấp
                            </Col>
                            <Col span={12} className="right">
                                {common.convertDDMMYYYY(common.splitStringDate(userInfo.identifierIssueDate))}
                            </Col>
                            <Col span={12}>
                                Cấp Tại
                            </Col>
                            <Col span={12} className="right">
                               {userInfo.identifierIssuePlace}
                            </Col>
                            <Col span={6}>
                                Địa Chỉ
                            </Col>
                            <Col span={18} className="right">
                                {userInfo.address}
                            </Col>
                            <Col span={12}>
                                Email
                            </Col>
                            <Col span={12} className="right">
                                {userInfo.email}
                            </Col>
                            <Col span={12}>
                                Số Điện Thoại
                            </Col>
                            <Col span={12} className="right">
                                {userInfo.phoneNumber}
                            </Col>
                            <Col span={10}>
                                Phòng giao dịch
                            </Col>
                            <Col span={14} className="right">
                                {userInfo.agencyBranch}
                            </Col>
                            <Col span={12}>
                                Nhân Viên Chăm Sóc
                            </Col>
                            <Col span={12} className="right">
                                {userInfo.agencyName}
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <div className="footer">
                <Row gutter={30}>
                    <Col span={16}>
                        <button className="btnChangePassword" onClick={handleChangPassWord}>ĐỔI MẬT KHẨU ĐĂNG NHẬP</button>
                    </Col>
                    <Col span={8}>
                        <button className="btnLogout" onClick={onLogout}>ĐĂNG XUẤT</button>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

const rootModalOTP = css`
    .ant-modal-content{
        border-radius: 8px;
    }
`

function ChangePassword(props){
    const [currentPass, setCurrentPass] = useState('');
    const [expectPass, setExpectPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [isWarning, setWarning] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const backToInfo = ()=>{
        props.handleBackToInfo();
    }

    const updateInputValue = name => (event)=>{
        try {
            setWarning(0);
            let ev = event.target.value;
            switch(name){
                case 'currentPass':
                    setCurrentPass(ev);
                    break;
                case 'expectPass':
                    setExpectPass(ev);
                    break;
                case 'confirmPass':
                    setConfirmPass(ev);
                    break;
                default:
                    break;
            }
        } catch (error) {
            
        }
    }

    const logoutAfterChange = async()=>{
        await storage.removeStorageToken();
        window.location.href = "/login";
    }

    const ChangeHTSPassword = async()=>{
        try {
            if(confirmPass.length === 0){
                setWarning(3);
            }
            if(expectPass.length === 0){
                setWarning(2);
            }
            if(currentPass.length === 0){
                setWarning(1);
            }
            
            if(currentPass.length > 0 && expectPass.length > 0 && confirmPass.length > 0){
                if(expectPass.indexOf(' ') === -1 && expectPass === confirmPass && expectPass.length === 8){
                    setLoading(true);
                    const res = await props.changeHTSPassword({
                        username: props.accountInfo.userInfo.accounts[0].accountNumber || '',
                        oldPassword: currentPass,
                        newPassword: confirmPass
                    });
                    setLoading(false);
                    if(res.type === 'EQUITY_ACCOUNT.HTSPassword'){
                        Modal.info({
                            title: 'Thông báo',
                            content: (
                                <div style={{fontWeight: 500, color: color._BLACK, fontSize: 13}}>
                                    Thay đổi mật khẩu thành công. <br />
                                    Quý khách cần đăng nhập lại để tiếp tục thao tác!
                                </div>
                            ),
                            onOk() {logoutAfterChange()},
                            okText: 'Đồng ý',
                            className: {rootModalOTP},
                            okButtonProps: {
                                style: {
                                    backgroundColor: color._BLUE_VCSC,
                                    borderColor: color._BLUE_VCSC,
                                    borderRadius: 4
                                }
                            }
                        });
                    }else{
                        common.notify("error", "Thay đổi mật khẩu thất bại. Lỗi " + res.message);
                    }
                }
            }else{
                common.notify("warning", "Không được để trống mục này!!!");
            }
        } catch (error) {
            setLoading(false);
        }
    }

    return (
        <div className={rootChangePassword}>
            <div className="header">
                ĐỔI MẬT KHẨU ĐĂNG NHẬP
            </div>
            <div className="p-top20"></div>
            <div className="bodyChangePassword">
                <div className="item">
                    <div className="left">
                        Mật khẩu hiện tại
                    </div>
                    <div className="right">
                        <Input 
                            className={`customInput ${isWarning === 1 ? 'isWarning' : ''}`} 
                            type="password"
                            value={currentPass}
                            onChange={updateInputValue('currentPass')}
                        />
                    </div>
                </div>
                <div className="item p-top15">
                    <div className="left">
                        Mật khẩu mới
                    </div>
                    <div className="right">
                        <Input 
                            className={`customInput ${isWarning === 2 ? 'isWarning' : ''}`}
                            type="password"
                            value={expectPass}
                            onChange={updateInputValue('expectPass')}
                        />
                    </div>
                </div>
                <div className="item p-top15">
                    <div className="left">
                        Xác nhận mật khẩu mới
                    </div>
                    <div className="right">
                        <Input 
                            className={`customInput ${isWarning === 3 ? 'isWarning' : ''}`} 
                            type="password"
                            value={confirmPass}
                            onChange={updateInputValue('confirmPass')}
                        />
                    </div>
                </div>
                <div className="item p-top15">
                    <div className="left" />
                    <div className="right">
                        <div style={{color: color._BLUE_VCSC, fontSize: 12, fontWeight: 500}}>
                            Yêu cầu:
                        </div>
                        <div className='p-top5 itemCheck'>
                            <CheckCircleFilled className={`iconCheck ${expectPass.length === 8 ? 'isActiveIcon' : ''}`}/>&nbsp;&nbsp;<span className="title">Mật khẩu phải có 8 ký tự</span>
                        </div>
                        <div className="itemCheck">
                            <CheckCircleFilled className={`iconCheck ${(expectPass && expectPass.indexOf(' ') === -1) ? 'isActiveIcon' : ''}`}/>&nbsp;&nbsp;<span className="title">Không bao gồm khoảng trắng</span>
                        </div>
                        <div className="itemCheck">
                            <CheckCircleFilled className={`iconCheck ${(confirmPass.length > 0 && expectPass === confirmPass) ? 'isActiveIcon' : ''}`}/>&nbsp;&nbsp;<span className="title">Xác nhận mật khẩu mới hợp lệ</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer p-top20">
                <Row gutter={30}>
                    <Col span={4} />
                    <Col span={8}>
                        <button className="btnCancel" onClick={backToInfo}>HỦY BỎ</button>
                    </Col>
                    <Col span={8}>
                        <button className="btnUpdate" onClick={ChangeHTSPassword}>{isLoading ? <LoadingOutlined /> : null}&nbsp;CẬP NHẬT</button>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch =>{
    return{
        changeHTSPassword: (data)=> dispatch(changeHTSPassword(data))
    }
}

export default connect(null, mapDispatchToProps) (InfoAccount);