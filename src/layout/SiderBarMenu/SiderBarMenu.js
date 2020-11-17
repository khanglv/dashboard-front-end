import React from 'react';
import './style.css';
import { Menu, Drawer } from 'antd';
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

// const LIST_ROUTE_EXTENTION = ['/web-trading', '/order-stock', '/portfolio-create']
// const LIST_ROUTE_ANALYSIS = ['/analysis_technical', '/analysis_normal', 'analysis_report'];
// const LIST_ROUTE_NEWS = ['/news_market', 'news_companys', '/news_other'];

// const checkRouteOpenDefaultKey = ()=> {
//     for(let i = 0; i < LIST_ROUTE_EXTENTION.length; i++){
//         if(LIST_ROUTE_EXTENTION[i] === window.location.pathname){
//             return 'openExtention';
//         }
//     }
//     for(let i = 0; i < LIST_ROUTE_ANALYSIS.length; i++){
//         if(LIST_ROUTE_ANALYSIS[i] === window.location.pathname){
//             return 'openAnalysis';
//         }
//     }
//     for(let i = 0; i < LIST_ROUTE_NEWS.length; i++){
//         if(LIST_ROUTE_NEWS[i] === window.location.pathname){
//             return 'openNews';
//         }
//     }
// }

function SiderBarMenu(props){
    const [current, setStateCurrent] = React.useState(window.location.pathname);
    // const [openDefaultKey] = React.useState(checkRouteOpenDefaultKey());

    const handleClick = (e) => {
        setStateCurrent(e.key);
        switch(e.key){
            //Tài khoản
            case "/order-stock":
                props.history.push('/order-stock');
                break;
            case "/web-trading":
                props.history.push('/web-trading');
                break;
            case "orderBonds":
                window.open("https://bond.vcsc.com.vn/login")
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

            default:
                break;
        }
    };

    const onClose = ()=>{
        props.onCloseMenu();
    }
    
    return(
        <Drawer
            placement="left"
            closable={false}
            visible={props.isOpen}
            style={styles.drawerRoot}
            bodyStyle={styles.drawerBody}
            maskStyle={{background: 'none'}}
            onClose={onClose}
        >
            <Menu
                onClick={handleClick}
                // defaultSelectedKeys={[current]}
                defaultOpenKeys={['openAccount', 'openPortfolio']}
                selectedKeys={[current]}
                mode="inline"
                theme="dark"
            >
                <SubMenu
                    key="openAccount"
                    title={
                        <span>
                            <span style={{fontSize: 13, color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600}}>TÀI KHOẢN</span>
                        </span>
                    }
                >
                    {/* <Menu.Item key="/web-trading">
                        <Link to="/web-trading"></Link>
                        <img alt='' className='svg' src='/images/icons/side-bar/ic_web_trading_small.svg' />
                        <span style={{paddingLeft: 10}}>Web Trading</span>
                    </Menu.Item> */}
                    <Menu.Item key="/order-stock">
                        <Link to="/order-stock"></Link>
                        <img alt='' className='svg' src='/images/icons/side-bar/ic_dat_lenh_cp_small.svg' />
                        <span style={{paddingLeft: 10}}>Đặt lệnh cổ phiếu</span>
                    </Menu.Item>
                    <Menu.Item key="orderBonds">
                        <img alt='' className='svg' src='/images/icons/side-bar/ic_dat_lenh_trai_phieu.svg' />
                        <span style={{paddingLeft: 10}}>Đặt lệnh trái phiếu</span>
                    </Menu.Item>
                    <Menu.Item key="/account-balance-detail">
                        <Link to="/account-balance-detail"></Link>
                        <img alt='' className='svg' src='/images/icons/side-bar/ic_tai_san_cua_toi_small.svg' />
                        <span style={{paddingLeft: 10}}>Số dư CK chi tiết</span>
                    </Menu.Item>
                </SubMenu>

                <SubMenu
                    key="openPortfolio"
                    title={
                        <span>
                            <span style={{fontSize: 13, color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600}}>DANH MỤC</span>
                        </span>
                    }
                >
                    <Menu.Item key="/portfolio-create">
                        <Link to="/portfolio-create"></Link>
                        <img alt='' className='svg' src='/images/icons/side-bar/ic_module_small.svg' />
                        <span style={{paddingLeft: 10}}>Tổng quan</span>
                    </Menu.Item>
                    <Menu.Item key="/list-portfolio">
                        <Link to="/list-portfolio"></Link>
                        <img alt='' className='svg' src='/images/icons/side-bar/ic_dskhuyennghi_small.svg' />
                        <span style={{paddingLeft: 10}}>Quản lý danh mục</span>
                    </Menu.Item>
                    <Menu.Item key="/history-portfolio">
                        <Link to="/history-portfolio"></Link>
                        <img alt='' className='svg' src='/images/icons/side-bar/ic_tra_cuu_lich_su_small.svg' />
                        <span style={{paddingLeft: 10}}>Lịch sử giao dịch</span>
                    </Menu.Item>
                    <Menu.Item key="/account-balance">
                        <Link to="/account-balance"></Link>
                        <img alt='' className='svg' src='/images/icons/side-bar/ic_tai_san_cua_toi_small.svg' />
                        <span style={{paddingLeft: 10}}>Số dư CK</span>
                    </Menu.Item>
                </SubMenu>

                {/* <SubMenu
                    key="openAnalysis"
                    title={
                        <span>
                            <span style={{fontSize: 13, color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600}}>PHÂN TÍCH</span>
                        </span>
                    }
                >
                    <Menu.Item key="/acb">
                        <Link to="/home"></Link>
                        <img alt='' className='svg' src='/images/icons/side-bar/ic_phan_tich_ky_thuat_small.svg' />
                        <span style={{paddingLeft: 10}}>Phân tích kỹ thuật</span>
                    </Menu.Item>
                    <Menu.Item key="/side-bar">
                        <Link to="/side-bar"></Link>
                        <img alt='' className='svg' src='/images/icons/side-bar/_ic_phan_tich_co_ban_small.svg' />
                        <span style={{paddingLeft: 10}}>Phân tích cơ bản</span>
                    </Menu.Item>
                    <Menu.Item key="/trading-view'">
                        <Link to="/trading-view'"></Link>
                        <img alt='' className='svg' src='/images/icons/side-bar/_ic_phan_tich_bao_cao.svg' />
                        <span style={{paddingLeft: 10}}>Phân tích báo cáo</span>
                    </Menu.Item>
                </SubMenu>

                <SubMenu
                    key="openNews"
                    title={
                        <span>
                            <span style={{fontSize: 13, color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600}}>TIN TỨC</span>
                        </span>
                    }
                >
                    <Menu.Item key="/abc">
                        <Link to="/home"></Link>
                        <img alt='' className='svg' src='/images/icons/side-bar/ic_tin_thi_truong_small.svg' />
                        <span style={{paddingLeft: 10}}>Tin thị trường</span>
                    </Menu.Item>
                    <Menu.Item key="/side-bar">
                        <Link to="/side-bar"></Link>
                        <img alt='' className='svg' src='/images/icons/side-bar/ic_tin_doanh_nghiep.svg' />
                        <span style={{paddingLeft: 10}}>Tin doanh nghiệp</span>
                    </Menu.Item>
                    <Menu.Item key="/trading-view'">
                        <Link to="/trading-view'"></Link>
                        <img alt='' className='svg' src='/images/icons/side-bar/ic_tin_khac.svg' />
                        <span style={{paddingLeft: 10}}>Tin khác</span>
                    </Menu.Item>
                </SubMenu> */}
            </Menu>
        </Drawer>
    )
}

export default withRouter(SiderBarMenu);

const styles = {
    drawerRoot: {
        top: 40,
    },
    drawerBody: {
        backgroundColor: '#3b6195',
        color: 'rgba(255, 255, 255, 0.6)',
        padding: 0
    }
}