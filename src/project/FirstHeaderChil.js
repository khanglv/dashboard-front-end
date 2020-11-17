import React, {Component} from 'react';
import {Menu} from 'antd';
import {CaretDownOutlined} from '@ant-design/icons';
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { css } from 'emotion';

const { SubMenu } = Menu;
let color = window['colors'];

const rootMenu = css`
    .ant-menu{
        box-shadow: 0 4px 10px 0 rgba(0, 55, 123, 0.05);
        height: 40px;
        line-height: 40px;
        margin-bottom: 5px;
        padding-left: 3.5em;
        .ant-menu-item-selected{
            color: ${color._BLUE_VCSC}!important;
            border-bottom: 2px solid ${color._BLUE_VCSC};
        }
        .ant-menu-submenu-selected{
            color: ${color._BLUE_VCSC}!important;
            border-bottom: 2px solid ${color._BLUE_VCSC}!important;
        }
        .ant-menu-item{
            height: 40px;
            font-weight: 600;
            color: ${color._BLUE_VCSC_06};
            margin-right: 1.5em!important;
            padding: 0!important;
            &:hover{
                color: ${color._BLUE_VCSC};
                border-bottom: 2px solid ${color._BLUE_VCSC};
                background-color: ${color._WHITE}!important;
            }
        }
        .ant-menu-submenu{
            height: 40px;
            font-size: 13px;
            font-weight: 600;
            color: ${color._BLUE_VCSC_06};
            .ant-menu-submenu-title{
                padding: 0!important;
            }
            &:hover{
                .ant-menu-submenu-title{
                    color: ${color._BLUE_VCSC}!important;
                }
                border-bottom: 2px solid ${color._BLUE_VCSC};
            }
        }
    }
`

const subMenu = css`
    .ant-menu-vertical{
        .ant-menu-submenu{
            .ant-menu{
                background-color: aliceblue!important;
            }
        }
    }
`

class FirstHeaderChil extends Component{
    constructor(props) {
        super(props);
        this.state = {
            activeKey: window.location.pathname,
        };
    }

    componentWillMount(){
        const {activeKey} = this.state;
        let activeKeyCut = activeKey.slice(0, 17);
        let activeKeyCutSecond = activeKey.slice(0, 27);
        if(activeKeyCut === '/detail-portfolio'){
            this.setState({activeKey: '/list-portfolio'});
        }
        if(activeKeyCutSecond === '/detail-portfolio-investing'){
            this.setState({activeKey: '/list-portfolio'});
        }
    }

    _onClickHeaderAction = async e => {
        this.setState({
            activeKey: e.key,
        });
        this.props.history.push(e.key);
    };

    render(){
        const {
            activeKey
        } = this.state;

        return(
            <div className={rootMenu}>
                <Menu 
                    onClick={this._onClickHeaderAction} 
                    selectedKeys={[activeKey]}
                    mode="horizontal"
                >
                    <Menu.Item key="/web-trading">
                        <Link to="/web-trading"></Link>
                        BIỂU ĐỒ
                    </Menu.Item>
                    <Menu.Item key="/order-stock">
                        <Link to="/order-stock"></Link>
                        ĐẶT LỆNH
                    </Menu.Item>
                    <SubMenu title={<span>DANH MỤC ĐẦU TƯ &nbsp;<CaretDownOutlined style={{fontSize: '0.9em', marginRight: 0}}/></span>} className={subMenu}>
                        {/* <Menu.Item key="/portfolio-create"><Link to="/portfolio-create"></Link>TỔNG QUAN</Menu.Item> */}
                        <Menu.Item key="/list-portfolio"><Link to="/list-portfolio"></Link>QUẢN LÝ DANH MỤC</Menu.Item>
                        <Menu.Item key="/history-portfolio"><Link to="/history-portfolio"></Link>LỊCH SỬ GIAO DỊCH</Menu.Item>
                        <Menu.Item key="/account-balance"><Link to="/account-balance"></Link>SỐ DƯ TK</Menu.Item>
                        <Menu.Item key="/account-balance-detail"><Link to="/account-balance-detail"></Link>SỐ DƯ CK CHI TIẾT</Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
            
        )
    }
}

export default withRouter(FirstHeaderChil);

// import React, {Component} from 'react';
// import {Tabs} from 'antd';
// import { withRouter } from "react-router";

// const { TabPane } = Tabs;

// class FirstHeaderChil extends Component{
//     constructor(props) {
//         super(props);
//         this.state = {
//             activeKey: window.location.pathname,
//         };
//     }

//     _onClickHeaderAction = activeKey => {
//         this.setState({ activeKey });
//         this.props.history.push(activeKey);
//     };

//     render(){
//         const {
//             activeKey
//         } = this.state;

//         return(
//             <Tabs 
//                 activeKey={activeKey}
//                 tabBarStyle={styles.rootTabs}
//                 size="small"
//                 className="headerTabTrading"
//                 animated={false}
//                 onChange={this._onClickHeaderAction}
//             >
//                 <TabPane tab="BIỂU ĐỒ" key="/web-trading" />
//                 <TabPane tab="ĐẶT LỆNH" key="/order-stock" />
//                 <TabPane tab="DANH MỤC" key="/portfolio-create" />
//             </Tabs>
//         )
//     }
// }

// export default withRouter(FirstHeaderChil);

// const styles = {
//     rootTabs: {
//         backgroundColor: '#fff',
//         padding: 0,
//         paddingLeft: 53,
//         margin: 0,
//         marginBottom: 5,
//         boxShadow: '0 4px 10px 0 rgba(0, 55, 123, 0.05)'
//     }
// }
