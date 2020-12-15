import React, { useEffect } from 'react';
import {Tabs} from 'antd';
import {css} from 'emotion';
import {connect} from 'react-redux';
import {getAlertMainContent} from '../../stores/actions/masterService/alertAction';
import * as common from '../../components/Common/Common';

const color = window['colors'];
const { TabPane } = Tabs;

const rootMain = css`
    display: flex;
    justify-content: center;
    height: calc(100vh - 50px);
    overflow-y: auto;
    .main{
        padding-top: 10px;
        padding-bottom: 1em!important;
        max-width: 1400px;
        width: 100%;
        @media only screen and (max-width: 1600px) {
            height: calc(100vh - 100px);
            padding-top: 10px;
            max-width: 1200px;
        }

        @media only screen and (max-width: 1200px) {
            height: calc(100vh - 100px);
            padding-top: 10px;
            max-width: 1000px;
        }
        
        @media only screen and (max-width: 992px) {
            padding-right: 0.5rem;
            padding-left: 0.5rem;
            width: 100%;
        }
        .header{
            .title{
                font-size: 24px;
                font-weight: 500;
                color: ${color._BLACK};
            }
        }
        .rootBody{
            .ant-tabs-ink-bar{
                background-color: ${color._BLUE_VCSC};
            }
            .ant-tabs-tab{
                color: ${color._GREY_999};
                font-weight: 500;
                font-size: 1.3em;
                &:hover{
                    color: ${color._BLUE_VCSC};
                }
            }
            .ant-tabs-tab-active{
                font-weight: 600;
                color: ${color._BLUE_VCSC};
            }
            .ant-tabs-content{
                
            }
        }
    }
`

const notifyOfDay = css `
    .ofDay{
        font-weight: 600;
        color: ${color._BLACK};
    }
    .component{
        padding: 10px;
        border-radius: 4px;
        background-color: ${color._WHITE};
        cursor: pointer;
        .rootMain{
            padding-left: 10px;
            .content{
                font-weight: 500;
                color: ${color._BLACK};
            }
            .time{
                font-size: 11px;
                color: ${color._GREY_999};
            }
        }
        .isNew{
            border-left: 3px solid ${color._BLUE};
        }
        .isOld{
            border-left: 3px solid ${color._PURPLE};
        }
    }
`

function ManagementAlert (props){
    return(
        <div className={rootMain}>
            <div className="main">
                <div className="header">
                    <div className="title">
                        Cảnh báo
                    </div>
                </div>
                <div className="rootBody p-top10">
                    <Tabs 
                        defaultActiveKey="0"
                        animated={false}
                    >
                        <TabPane tab="Tất cả" key="0">
                            <NotifyOfDay {...props}/>
                        </TabPane>
                        <TabPane tab="Cảnh báo giá" key="1">
                            hahaha
                        </TabPane>
                        <TabPane tab="Khuyến nghị" key="2">
                            Khuyến nghị
                        </TabPane>
                        <TabPane tab="Tin tức & Sự kiện" key="3">
                            Tin tức & Sự kiện
                        </TabPane>
                        <TabPane tab="Báo cáo phân tích" key="4">
                            Báo cáo phân tích
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

function NotifyOfDay (props){
    const {getAlertMainContent, arrContents} = props;
    const accountInfo = JSON.parse(localStorage.getItem('accountInfoKey'));
    let msndtCode = '';
    if(accountInfo){
        msndtCode = accountInfo.userInfo.accounts[0].accountNumber;
    }
    useEffect(()=>{
        try {
            async function loadData(){
                await getAlertMainContent({
                    msndt: msndtCode
                });
            }
            loadData();
        } catch (error) {
            
        }
    }, [getAlertMainContent, msndtCode]);
    return(
        <div className={notifyOfDay}>
            {
                arrContents.length > 0 ? 
                arrContents.map((item, idx)=>{
                    return(
                        <div key={idx}>
                            <div className="ofDay">
                                {common.convertDDMMYYYY(item.createDate)}
                            </div>
                            {
                                (item.data && item.data.length > 0) ?
                                    item.data.map((item_t, idx)=>{
                                        return(
                                            <div className="component m-top5" key={idx}>
                                                <div className={`rootMain ${item_t.status === 0 ? 'isNew' : 'isOld'}`}>
                                                    <div className="content">
                                                        {item_t.content}
                                                    </div>
                                                    <div>
                                                        <span className="time">
                                                            {common.convertDDMMYYYY(item_t.createDate)}
                                                            <i> lúc </i>
                                                            {common.stringToTimeHHMMSS(item_t.createDate)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                : null
                            }
                        </div>
                    )
                }) : null
            }
        </div>
    )
}

const mapStateToProps = state =>{
    return{
        arrContents: state.indexMasterService['ALERT_MAIN_CONTENT.GET']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getAlertMainContent: (data)=> dispatch(getAlertMainContent(data)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (ManagementAlert);