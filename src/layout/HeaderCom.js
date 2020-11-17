import React, {Component} from 'react';
import { Link } from "react-router-dom";
import { Layout, Avatar, Card, List, Select } from 'antd';
import { UserOutlined, LogoutOutlined, QuestionOutlined } from '@ant-design/icons';
import * as storage from '../api/storage';
import {connect} from 'react-redux';
import "./styles.css"
import {css} from 'emotion';

let color = window['colors'];
const { Option } = Select;
const { Header } = Layout;

const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
// const windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

const customSelect = css`
    width: 17em;
    color: #333333;
    font-size: 12px!important;
    .ant-select-selector{
        border: 0!important;
        border-radius: 4px!important;
        background-color: rgba(0, 0, 0, 0.2)!important;
        color: ${color._WHITE};
    }
    svg{
        color: ${color._WHITE};
    }
`

// const notify = css`
//     margin-right: 2em;
//     position: relative;
//     cursor: pointer;
//     display: inline-block;
//     &:hover{
//         background-color: #264d87;
//     }
//     .numberNotify{
//         position: absolute;
//         color: ${color._WHITE};
//         top: -8px;
//         right: -8px;
//         border-radius: 50%;
//         background-color: ${color._RED_VCSC};
//         padding: 8px 5px;
//         font-size: 8px;
//     }
// `

// const formNotify = css`
//     position: absolute;
//     top: 30px;
//     width: 350px;
//     height: 500px;
//     background-color: ${color._WHITE};
//     box-shadow: 0 4px 10px 0 rgba(0, 55, 123, 0.05);
//     border-radius: 4px;
//     padding: 10px;
//     padding-top: 15px;
// `

// function FormNoify(){
//     return (
//         <div className={formNotify}>
//             <div>
//                 Thông báo
//             </div>
//         </div>
//     )
// }

class HeaderCom extends Component{
    constructor(props){
        super(props);
        this.wrapperRef = React.createRef();
        this.state = {
            dataTesst: [],
            isNotify: false,
            userInfo: JSON.parse(localStorage.getItem('userInfoKey')),
            accountInfo: JSON.parse(localStorage.getItem('accountInfoKey')),
            subNumber: ''
        }

        // props.componentEvent.on("changeSubNumber", (subNumber)=>{
        //     this.setState({subNumber: subNumber});
        // });

        // this.props_master = props;

    }

    componentDidUpdate(prev){
        if(this.props.subNumberChange && prev.subNumberChange !== this.props.subNumberChange){
            this.setState({subNumber: this.props.subNumberChange});
        }
    }

    componentWillMount(){
        const {
            accountInfo
        } = this.state;
        let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
        if(obj){
            this.setState({ subNumber: obj.SUB_NUMBER });
        }else{
            if(accountInfo){
                if(Object.keys(accountInfo).length > 0){
                    this.setState({subNumber: accountInfo.userInfo.accounts[0].accountSubs[0].subNumber});
                }
            }
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick);
    }
    
    onHome = ()=>{
        window.location.href = "/home";
    }

    handleClick = (event) => {
        if(this.wrapperRef.current){
            const { target } = event;
            if (!this.wrapperRef.current.contains(target)) {
                this.setState({isShowInfoAccount: false});
            }
        }
    }

    showInfoAccount = ()=>{
        this.setState(previousState => (
            { isShowInfoAccount: !previousState.isShowInfoAccount }
        ))
    }

    showNotifyDisplay = async()=>{
        this.setState(previousState => (
            { isShowNotifyDisplay: !previousState.isShowNotifyDisplay }
        ));
    }

    run (event) {
        // this.props_master.componentEvent.fire("changeSubNumber", true, event);
        this.props.dispatch({
            type: 'SUB_NUMBER',
            data: event
        });
    }

    updateSubNumberValue = name => async(event)=>{
        let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
        let code = null;
        if(obj){
            code = obj.CODE_STOCK || null;
            if(obj.SUB_NUMBER === '00' || obj.SUB_NUMBER === '01' || obj.SUB_NUMBER === '02'){
                if(event === '80'){
                    code = null;
                }
            }
            if(obj.SUB_NUMBER === '80'){
                if(event === '00' || event === '01' || event === '02'){
                    code = null;
                }
            }
        }
        
        await storage.rememberSectionOrder(JSON.stringify({CODE_STOCK: code, SUB_NUMBER: event}));
        this.run(event);
        // this.setState({[name]: event});
    }

    render(){
        const {
            isShowInfoAccount,
            userInfo,
            accountInfo,
            subNumber
        } = this.state;

        const lstSubNumber = accountInfo ? accountInfo.userInfo.accounts[0].accountSubs : [];

        // console.log(isShowNotifyDisplay);
        return (  
            <Header style={styles.rootHeader}>
                <span style={{display: 'flex'}}>
                    <span style={styles.gridNone}></span>
                    <span style={styles.gridLeft}>
                        <Link to="/home">
                            <img alt="" src='/images/logos/logos-layout/logo.svg' />
                        </Link>
                    </span>
                    <div style={styles.separator}>
                        <div style={styles.triangleArrow}></div>
                        <div style={styles.logo_arrow}></div>
                    </div>
                    <span style={styles.gridRight}>
                        {/* <div style={{marginRight: '20px'}}>
                            <div className="midle-icon-ant pointer" style={{position: 'relative', cursor: 'pointer'}} onClick={this.showNotifyDisplay}>
                                <BellOutlined style={{fontSize: 20, color: '#ffffff'}} />
                                <span className="badge">3</span>
                            </div>
                        </div> */}
                        {/* <span className={notify}>
                            <img width="16" alt="" src="/images/icons/notify/ic_speaker.svg"/>
                            <span className="numberNotify">6</span>
                        </span>
                        <span className={notify}>
                            <img width="16" alt="" src="/images/icons/notify/ic_notification.svg"/>
                            <span className="numberNotify">9</span>
                            <FormNoify />
                        </span> */}
                        <span style={{marginRight: '1em'}}>
                            <Select
                                className={customSelect}
                                showSearch
                                value={subNumber}
                                onChange={this.updateSubNumberValue('subNumber')}
                                size={'small'}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {lstSubNumber.length > 0 ? lstSubNumber.map((item, idx)=>{
                                    return(
                                        <Option key={idx} value={item.subNumber}>
                                            {`${accountInfo.userInfo.accounts[0].accountNumber} - ${item.subNumber} (${item.subNumber === '00' ? 'Thường' : (item.subNumber === '01' ? 'Margin' : 'Phái sinh')})`}
                                        </Option>
                                    )
                                }) 
                                : null}
                            </Select>
                        </span>
                        <span className="rightUser" ref={this.wrapperRef} onClick={this.showInfoAccount}>
                            <Avatar
                                style={{
                                    backgroundColor: '#fff',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 5
                                }}
                                size={'small'}
                                icon={<UserOutlined style={{color: '#00377b'}}/>}
                            />
                            <span style={styles.nameUser}>{userInfo ? userInfo.customerName : null}</span>
                        </span>
                    </span>
                    {/* {isShowNotifyDisplay ? <NotifyDisplay /> : null} */}
                    {isShowInfoAccount ? <CardAccount/> : null}
                </span>
            </Header>
        )
    }
}

// class NotifyDisplay extends Component{
//     render() {
//         const data = [
//             {
//                 title: 'Ant Design Title 1',
//             },
//             {
//                 title: 'Ant Design Title 2',
//             },
//             {
//                 title: 'Ant Design Title 3',
//             },
//             {
//                 title: 'Ant Design Title 4',
//             },
//         ];
//         return (
//             <List
//                 class="notify"
//                 itemLayout="horizontal"
//                 header={<b style={{paddingLeft: '1rem'}}>Thông báo</b>}
//                 dataSource={data}
//                 renderItem={item => (
//                 <List.Item style={{cursor: 'pointer'}}>
//                     <List.Item.Meta
//                     avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
//                     title={<a href="https://ant.design">{item.title}</a>}
//                     description="Ant Design, a design language for background applications, is refined by Ant UED Team"
//                     />
//                 </List.Item>
//                 )}
//             />
//         )
//     }
// }

class CardAccount extends Component {
    constructor(props){
        super(props);
        this.state = {
            openModal: false,
            accountInfo: JSON.parse(localStorage.getItem('accountInfoKey'))
        };
    }
    onLogout = async()=>{
        await storage.removeStorageToken();
        window.location.href = "/login";
    }
    
    onInfoAccount = ()=>{
        window.location.href = '/info-account';
    }

    editAccount = ()=>{
        this.setState({openModal: true});
    }

    handleReloadData = ()=>{
        this.setState({openModal: false});
        this.loadData();
    }

    handleCloseModal = ()=>{
        this.setState({openModal: false});
    }

    render(){
        return(
            <Card size="small" className="animate slideIn" style={styles.customFormAccount}>
                <List size="small" className="itemFormLogout">
                    <List.Item onClick={this.onInfoAccount}>
                        <QuestionOutlined style={{fontSize: 16, color: '#00377b'}}/> <span style={{paddingLeft: 10}}>Tài khoản</span>
                    </List.Item>
                </List>
                <List size="small" className="itemFormLogout">
                    <List.Item onClick={this.onLogout}>
                        <LogoutOutlined style={{fontSize: 16, color: '#00377b'}}/> <span style={{paddingLeft: 10}}>Đăng xuất</span>
                    </List.Item>
                </List>
            </Card>
        )
    }
}

const mapStateToProps = state =>{
    return{
        subNumberChange: state.rootMain['SUB_NUMBER']
    }
}

export default connect(mapStateToProps) (HeaderCom);

const styles = {
    rootHeader:{
        flexGrow: 1,
        width: '100vw',
        boxShadow: '0 4px 10px 0 rgba(0, 55, 123, 0.05)',
    },
    gridNone: {
        backgroundColor: '#fff',
        width: 25
    },
    gridLeft: {
        backgroundColor: '#fff',
        padding: 0,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 190
    },
    gridRight: {
        backgroundColor: '#00377b',
        padding: 0,
        height: 40,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 'calc(100% - 200px)',
        position: 'relative'
    },
    separator: {
        position: 'relative',
        backgroundColor: '#00377b',
    },
    triangleArrow: {
        position: 'relative',
        borderTop: '40px solid #fff',
        borderRight: '40px solid #00000000'
    },
    logo_arrow: {
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundImage: `url(${'/images/logos/logos-layout/arrow.svg'})`,
        width: 40,
        height: 40
    },
    numberUser: {
        fontSize: 11,
        color: '#fff',
        borderRadius: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        marginRight: 10,
        padding: '12px 15px',
        display: windowWidth < 768 ? 'none' : 'block'
    },
    customFormAccount: {
        width: '17rem',
        position: 'absolute', 
        right: '1rem', 
        top: 40,
        zIndex: 10000,
        boxShadow: '0 5px 6px rgba(0,0,0,0.23)'
    },
    nameUser: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        paddingRight: 50,
        fontStretch: 'normal',
        fontStyle: 'normal',
        display: windowWidth < 768 ? 'none' : 'block'
    },
}