import React, {Component} from 'react';
import { Form, Input, Button, Checkbox, Radio, Row, Col } from 'antd';
import DialogOTP from '../Dialog/DialogOTP';
import * as common from '../Common/Common';

import {connect} from 'react-redux';
import {login, loginRequest, loginWithCore} from '../../stores/actions/investor/loginAction';
import {LOGIN_SUCCESS, LOGIN_FAILED} from '../../stores/actions/investor/actionTypes';
import {loginCore, loginCoreOTP, getBanks, getUser, getAccountBank} from '../../stores/actions/core/loginCoreAction';
import {sendOTPMobile} from '../../api/apiCore';
// import * as socket from '../../project/Socket/Socket';
import Loading from '../Loading/Loading';

import {css} from 'emotion';

let color = window['colors'];

const loginForm = css`
    @media only screen and (max-width: 768px) {
        margin-left: 10px;
        margin-right: 10px;
    }
    .btnLogin{
        border-radius: 4px;
        background-color: ${color._BLUE_VCSC}!important;
        color: #fff!important;
        border: none;
        padding-top: 12px;
        padding-bottom: 12px;
        padding-left: 28px;
        padding-right: 28px;
        height: auto;
        font-size: 13px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        &:hover{
            background-color: #094794!important;
            color: #fff;
        }
        @media only screen and (max-width: 768px) {
            padding-left: 20px;
            padding-right: 20px;
        }
    }
`

class Login extends Component{

    constructor(props) {
        super(props);

        this.state = {
            userName: "",
            password: "",
            selectedStock: 1,
            isRememberAccount: false,
            isOpenDialog: false,
            isSpinning: false,
            loadingOtp: false
        };
    }

    componentDidMount() {
        let obj = JSON.parse(localStorage.getItem('keyConfigLogin'));
        if (obj) {
            this.setState({ userName: obj.userName, selectedStock: obj.stock, isRememberAccount: true });
        }
        // TODOconsole.log(socket);
    }
    
    onChangeAccount = (event)=>{
        this.setState({userName: (event.target.value).toUpperCase()});
    }

    onChangePassword = (event)=>{
        this.setState({password: event.target.value});
    }

    handleRememberAccount = ()=>{
        this.setState((prev)=>({isRememberAccount: !prev.isRememberAccount}));
    }

    _onCloseDialog = ()=>{
        this.setState({
            isOpenDialog: false
        });
    }

    onChangeSlect = (event)=>{
        if(event.target.value === 1) {
            this.setState({ 
                userName: '068C',
                selectedStock: event.target.value,
                password: ''
            });
        } else {
            this.setState({ 
                userName: '',
                selectedStock: event.target.value,
                password: ''
            });

        }
    }

    onSubmit = async()=>{
        try {
            const { 
                selectedStock, 
                userName, 
                password,
                isRememberAccount
            } = this.state;
            if(password && userName) {
                this.setState({isSpinning: true});
                let configLogin = {userName: '', stock: ''};
                if(isRememberAccount) {
                    configLogin.userName = userName;
                    configLogin.stock = selectedStock;
                }
                localStorage.setItem("keyConfigLogin", JSON.stringify(configLogin));
                if(selectedStock === 2) { // TK admin
                    try {
                        const res = await this.props.onLogin(userName, password);
                        this.setState({isSpinning: false});
                        switch(res.type) {
                            case LOGIN_SUCCESS:
                                this.props.history.push('/home');
                                break;
                            case LOGIN_FAILED:
                                common.notify("error", 'Đăng nhập thất bại. Vui lòng kiểm tra lại hoặc liên hệ quản trị viên!!!');
                                break;
                            default:
                                break;
                        }
                    } catch (error) {
                        common.notify("error", 'Đăng nhập thất bại. Vui lòng kiểm tra lại hoặc liên hệ quản trị viên!!!');
                        this.setState({isSpinning: false});
                    }
                } else { // TK chứng khoán
                    const res = await this.props.loginCore({userName, password});
                    this.setState({isSpinning: false});
                    if(res.type === 'LOGIN_CORE_FAILED'){
                        common.notify("error", 'Đăng nhập thất bại. Vui lòng kiểm tra lại hoặc liên hệ quản trị viên!!!');
                    }else{
                        if(res.data.registerMobileOtp){ //TK đăng kí gửi OTP mobile
                            try {
                                sendOTPMobile(res.data.accessToken);
                            } catch (error) {
                                
                            }
                        }
                        this.setState({isOpenDialog: true});
                    }
                }
            } else {
                common.notify("error", "Bạn chưa nhập tài khoản hoặc mật khẩu, vui lòng kiểm tra lại.");
            }
        } catch (error) {
            this.setState({isSpinning: false});
        }
    }

    confirmOTP = async(event)=>{
        try {
            if(this.props.loginCoreData && event){
                const {
                    userName
                } = this.state;

                this.setState({loadingOtp: true});
                const res = await this.props.loginCoreOTP({otp: event, token: this.props.loginCoreData.accessToken});
                
                if(res.type === 'LOGIN_OTP_FAILED'){
                    this.setState({loadingOtp: false});
                    common.notify("error", 'Xác nhận OTP thất bại. Vui lòng thử lại hoặc liên hệ quản trị viên!!!');
                }else{
                    await this.props.getUser({"accountNumber": res.data.userInfo.accounts[0].accountNumber || userName});
                    await this.props.getBanks({"accountNumber": res.data.userInfo.accounts[0].accountNumber || userName});
                    await this.props.getAccountBank({"accountNumber": res.data.userInfo.accounts[0].accountNumber || userName});
                    const data = {
                        "MSNDT": res.data.userInfo.accounts[0].accountNumber || userName,
                        "TENNDT": this.props.infoUser.customerName,
                        "LOAINDT": this.props.infoUser.accountType,
                        "CMND_GPKD": this.props.infoUser.identifierNumber,
                        "NOICAP": this.props.infoUser.identifierIssuePlace,
                        "TK_BOND": res.data.userInfo.accounts[0].accountNumber || userName,
                        "MS_NGUOIGIOITHIEU": this.props.infoUser.agencyCode,
                        "TEN_NGUOIGIOITHIEU": this.props.infoUser.agencyName,
                        "EMAIL": this.props.infoUser.email,
                        "DIACHI": this.props.infoUser.address,
                        "NGAYCAP": common.splitStringDate(this.props.infoUser.identifierIssueDate),
                        "PHANLOAINDT": this.props.infoUser.groupType || null,
                        "TK_NGANHANG": this.props.infoBank.length > 0 ? this.props.infoBank[0].bankAccountNumber : null,
                        "CHU_TK": this.props.infoBank.length > 0 ? this.props.infoBank[0].bankAccountName : null,
                        "CN_NGANHANG": this.props.infoBank.length > 0 ? this.props.infoBank[0].bankName : null,
                        "SDT": this.props.infoUser.phoneNumber || null,
                        "PHONGBAN_MOIGIOI": this.props.infoUser.agencyBranch || null,
                        "DD_CMND": this.props.infoUser.representativeIdentifierNumber || null,
                        "DD_HOTEN": this.props.infoUser.representativeName || null,
                        "DD_SDT": this.props.infoUser.representativePhoneNumber || null,
                        "DD_EMAIL": this.props.infoUser.representativeEmail || null,
                        "NOICAP_TKCK": this.props.infoUser.openBranchName || null,
                        "TOKEN_CORE": this.props.loginCoreOTPData.accessToken || ''
                    }

                    // console.log(data);
                    // this.setState({isOpenDialog: false});
                    // this.props.history.push('/home');
                    const nextAuth =  await this.props.loginWithCore(data);
                    
                    // socket.initSocket();
                    // socket.emitLogin(this.props.loginCoreData.accessToken);
                    this.setState({loadingOtp: false});
                    if(nextAuth.type === 'LOGIN_WITH_CORE_FAILED'){
                        common.notify("error", 'Đăng nhập thất bại. Vui lòng kiểm tra lại hoặc liên hệ quản trị viên!!!');
                    }else{
                        this.setState({isOpenDialog: false});
                        this.props.history.push('/home');
                    }
                }
            }
        } catch (error) {
            this.setState({loadingOtp: false});
            common.notify("error", 'Đăng nhập thất bại. Vui lòng kiểm tra lại hoặc liên hệ quản trị viên!!!');
        }
    }

    render(){
        const {
            selectedStock,
            userName,
            password,
            isOpenDialog,
            isSpinning,
            loadingOtp
        } = this.state;

        const infoCore = this.props.loginCoreData;

        return(
            <div style={styles.root}>
                
                <DialogOTP 
                    configs={
                        {
                            isOpen: isOpenDialog,
                            title: 'Vui lòng nhập mã OTP để truy cập',
                            otp: infoCore.otpIndex,
                            loading: loadingOtp
                        }} 
                    onClose={this._onCloseDialog}
                    confirmOTP={this.confirmOTP}
                />
                <div>
                    <div type="flex" align="middle">
                        <img alt="" src="logos/logo.svg" style={{ width: '70%' }} />
                    </div>
                    <Loading isLoading={isSpinning}>
                        <Form onSubmit={this.handleSubmit} style={styles.MloginForm} className={loginForm}>
                            <Form.Item>
                                <div type="flex" align="middle" style={{fontSize: 26, color: '#67666e', fontWeight: 500}}>
                                    Đăng Nhập
                                </div>
                            </Form.Item>
                            <Form.Item>
                                <Radio.Group onChange={this.onChangeSlect} value={selectedStock}>
                                    <Radio value={1} style={styles.btnSelect}>TK Chứng khoán</Radio>
                                    <Radio value={2} style={styles.btnSelect}>TK Khác</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    size={'large'}
                                    value={userName} onChange={this.onChangeAccount}
                                    placeholder="Tài khoản"
                                    style={styles.inputLogin}
                                />
                            </Form.Item>
                            <Form.Item>    
                                <Input
                                    // prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    size={'large'}
                                    value={password} onChange={this.onChangePassword}
                                    placeholder="Mật khẩu"
                                    style={styles.inputLogin}
                                />
                            </Form.Item>
                            <Form.Item>    
                                <Row>
                                    <Col span={12} style={{display: 'flex', alignItems: 'center'}}>
                                        <Checkbox onChange={this.handleRememberAccount} checked={this.state.isRememberAccount} style={styles.rememberAccount}>Ghi nhớ tài khoản?</Checkbox>                                
                                    </Col>
                                    <Col span={12} type="flex" align="end" >
                                        <Button loading={isSpinning} htmlType="submit" className="btnLogin" onClick={this.onSubmit}>
                                            ĐĂNG NHẬP
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                            {/* <Divider style={{color: color._GREY_999, fontSize: 11, fontStyle: 'normal'}}>Hoặc bằng tài khoản</Divider> */}
                        </Form>
                    </Loading>
                </div>
            </div>
        )
    } 
}

const mapStateToProps = state =>{
    return{
        messageAlert: state.login.message,
        token: state.login.accessToken,
        isFetching: state.login.isFetching,
        isAuthenticated: state.login.isAuthenticated,
        loginCoreData: state.loginCore.data,
        loginCoreOTPData: state.loginCore.dataOTP,
        infoUser: state.loginCore.dataUser,
        infoCore: state.loginCore.data,
        coreBank: state.loginCore.coreBank,
        infoBank: state.loginCore.databank,
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onLogin: (userName, password)=> dispatch(login(userName, password)),
        onLoginRequest: (userName)=> dispatch(loginRequest(userName)),
        loginCore: (data)=> dispatch(loginCore(data)),
        loginCoreOTP: (data)=> dispatch(loginCoreOTP(data)),
        getBanks: (data)=> dispatch(getBanks(data)),
        getUser: (data)=> dispatch(getUser(data)),
        getAccountBank: (data)=> dispatch(getAccountBank(data)),
        loginWithCore: (data)=> dispatch(loginWithCore(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Login);

const styles = {
    root: {
        width: '100vw',
        height: '100vh',
        background: `url(${'images/background/bg_dashboard.jpg'})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    MloginForm:{
        marginTop: '2rem',
        display: 'block',
        backgroundColor: color._WHITE,
        padding: 40,
        paddingTop: 35,
        borderRadius: 8,
    },
    inputLogin:{
        borderRadius: 5, 
        border: `1px solid ${color._STROKE}`,
        fontSize: 14
    },
    rememberAccount:{
        fontSize: 12,
        color: color._GREY_666,
        fontWeight: 500,
        fontStyle: 'normal',
        fontStretch: 'normal'
    },
    btnSelect: {
        fontSize: 13,
        color: color._GREY_666,
        fontWeight: 'normal',
        fontStretch: 'normal',
        fontStyle: 'normal'
    }
}