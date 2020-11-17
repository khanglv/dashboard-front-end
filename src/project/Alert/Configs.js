import React from 'react';
import {Tabs} from 'antd';
import {css} from 'emotion';
import WarningPrice from './WarningPrice';

let color = window['colors'];
const { TabPane } = Tabs;

const rootMain = css`
    height: calc(100vh - 45px);
    padding-top: 10px;
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
    .labelHeader{
        font-size: 24px;
        font-weight: 500;
        color: ${color._BLACK};
    }
    .rootBody{
        padding-bottom: 20px;
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
`

function AlertConfigs (){
    return(
        <div style={{display: 'flex', justifyContent: 'center', overflowY: 'auto', overflowX: 'hidden'}}>    
            <div className={rootMain}>
                <div className="labelHeader p-top10">Cài đặt cảnh báo</div>
                <div className="rootBody p-top10">
                    <Tabs 
                        defaultActiveKey="1"
                        animated={false}
                    >
                        <TabPane tab="Cảnh báo giá" key="1">
                            <WarningPrice />
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

export default AlertConfigs;