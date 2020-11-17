import React, {Component} from 'react';
// import * as socket from '../../project/Socket/Socket';
import {Row, Col} from 'antd';
import {actionCheckToken} from '../../api/api';
import { withRouter } from "react-router";
import * as storage from '../../api/storage';
import {connectBonds} from '../../api/api';
import * as common from '../Common/Common';
import {css} from 'emotion';

let color = window['colors'];
const BASE_URL_BOND = process.env.REACT_APP_BASE_URL_BONDS;

const rootMain = css`
    height: calc(100vh - 45px);
    padding-top: 10px;
    padding-bottom: 1em;
    max-width: 1400px;
    width: 100%;
    @media only screen and (max-width: 1600px) {
        max-width: 1200px;
        padding: 10px;
    }

    @media only screen and (max-width: 1200px) {
        max-width: 1000px;
        padding: 10px;
    }
    
    @media only screen and (max-width: 992px) {
        padding-right: 0.5rem;
        padding-left: 0.5rem;
        padding-bottom: 1em;
        height: auto;
        width: 100%;
    }
    .body_1{
        padding-top: 20px;
        .label{
            font-size: 24px;
            font-weight: 500;
            color: ${color._GREY_666}
        }
    }
`

const rootCard = css`
    background-color: ${color._WHITE};
    border-radius: 0.4em;
    height: auto;
    font-size: 16px;
    cursor: pointer;
    /* position: relative;
    transition: top ease 0.5s;
    top: 0; */
    &:hover{
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
        /* top: -10px; */
    }
    .body{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 10em;
    }
    .content{
        display: flex;
        justify-content: center;
        height: 3.5em;
        color: ${color._BLACK};
        font-weight: 600;
    }
`

export default withRouter(class Home extends Component{

    componentWillMount(){
        this.loadData();
    }

    loadData = async()=>{
        try {
            await actionCheckToken();
        } catch (error) {
            
        }
    }

    componentDidMount(){
        // const accountInfo = JSON.parse(localStorage.getItem('accountInfoKey'));
        // if(accountInfo){
        //     socket.connectNotify(accountInfo, ()=>{});
        // }
    }

    onConnectionBonds = async()=>{
        try {
            const accessTokenAuth = storage.accessTokenAuth(); //token for invest
            const res = await connectBonds({TOKEN: accessTokenAuth});
            if(res && res.token){
                return res.token;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    onDirection = async(key)=>{
        let props = this.props;
        // const accessToken = storage.accessTokenCore();
        
        switch(key){
            //Tài khoản
            case "/order-stock":
                props.history.push('/order-stock');
                break;
            case "/web-trading":
                props.history.push('/web-trading');
                break;
            case "/chart-review":
                props.history.push('/chart-review');
                break;
            case "orderBonds":
                // window.open("https://bond.vcsc.com.vn/login")
                let tokenConnect = await this.onConnectionBonds();
                if(tokenConnect){
                    window.open(`${BASE_URL_BOND}/main?token=${tokenConnect}`)
                }else{
                    common.notify("warning", "Không thể chuyển hướng tới https://bond.vcsc.com.vn/login");
                }
                break;
            //Danh mục
            case "/portfolio-create":
                props.history.push('/portfolio-create');
                break;
            case "/list-portfolio":
                props.history.push('/list-portfolio');
                break;
            case "/history-portfolio":
                props.history.push('/history-portfolio');
                break;
            case "/account-balance":
                props.history.push('/account-balance');
                break;
            case "/account-balance-detail":
                props.history.push('/account-balance-detail');
                break;
            //Alert
            case "/alert-configs":
                props.history.push('/alert-configs');
                break;
            default:
                break;
        }
    }

    render(){
        const arrDataAccount = [
            {
                key: '/web-trading',
                path: '/ic_web_trading.svg',
                contents: 'Tradingview'
            },
            {
                key: '/order-stock',
                path: '/ic_dat_lenh_cp.svg',
                contents: 'Đặt lệnh'
            },
            {
                key: '/account-balance-detail',
                path: '/ic_tai_san_cua_toi.svg',
                contents: 'Số dư CK chi tiết'
            },
            {
                key: '/chart-review',
                path: '/ic_review.svg',
                contents: 'Hiệu quả đầu tư'
            }
        ]

        const arrDataPortfolio = [
            {
                key: '/list-portfolio',
                path: '/ic_dskhuyennghidautu.svg',
                contents: 'Quản lý DMĐT'
            },
            {
                key: '/history-portfolio',
                path: '/ic_tra_cuu_lich_su.svg',
                contents: 'Lịch sử DMĐT'
            },
            {
                key: '/account-balance',
                path: '/ic_tai_san_cua_toi.svg',
                contents: 'Số dư DMĐT'
            }
        ]

        const arrDataAlert = [
            {
                key: '/alert-configs',
                path: '/ic_setting.svg',
                contents: 'Configs Alert'
            }
        ]

        const arrDataAnother = [
            {
                key: 'orderBonds',
                path: '/ic_dat_lenh_trai_phieu.svg',
                contents: 'Trái phiếu'
            },
            {
                key: 'test',
                path: '/ic_phan_tich_co_ban.svg',
                contents: 'Phân tích cơ bản'
            },
        ]
        return(
            <div style={{display: 'flex', justifyContent: 'center', overflowY: 'auto', overflowX: 'hidden'}}>
                <div className={rootMain}>
                    <div className="body_1">
                        <div className="label">
                            TÀI KHOẢN
                        </div>
                        <div className="p-top15">
                            <Row gutter={[30, 30]}>
                                {
                                    arrDataAccount.map((item, idx)=>{
                                        return(
                                            <Col xxl={4} xl={5} lg={6} md={6} xs={12} key={idx} onClick={()=>this.onDirection(item.key)}>
                                                <Card
                                                    path={item.path} 
                                                    contents={item.contents}
                                                />
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </div>
                    </div>

                    <div className="body_1">
                        <div className="label">
                            DANH MỤC
                        </div>
                        <div className="p-top15">
                            <Row gutter={[30, 30]}>
                                {
                                    arrDataPortfolio.map((item, idx)=>{
                                        return(
                                            <Col xxl={4} xl={5} lg={6} md={6} xs={12} key={idx} onClick={()=>this.onDirection(item.key)}>
                                                <Card
                                                    path={item.path} 
                                                    contents={item.contents}
                                                />
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </div>
                    </div>

                    <div className="body_1">
                        <div className="label">
                            ALERT
                        </div>
                        <div className="p-top15">
                            <Row gutter={[30, 30]}>
                                {
                                    arrDataAlert.map((item, idx)=>{
                                        return(
                                            <Col xxl={4} xl={5} lg={6} md={6} xs={12} key={idx} onClick={()=>this.onDirection(item.key)}>
                                                <Card
                                                    path={item.path} 
                                                    contents={item.contents}
                                                />
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </div>
                    </div>

                    <div className="body_1">
                        <div className="label">
                            SẢN PHẨM KHÁC
                        </div>
                        <div className="p-top15">
                            <Row gutter={[30, 30]}>
                                {
                                    arrDataAnother.map((item, idx)=>{
                                        return(
                                            <Col xxl={4} xl={5} lg={6} md={6} xs={12} key={idx} onClick={()=>this.onDirection(item.key)}>
                                                <Card
                                                    path={item.path} 
                                                    contents={item.contents}
                                                />
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

function Card (props){
    return(
        <div className={rootCard}>
            <div className="body">
                <img alt="" src={`./images/icons/home/${props.path}`}/>
            </div>
            <div className="content">
                {props.contents}
            </div>
        </div>
    )
}
