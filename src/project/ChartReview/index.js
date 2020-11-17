import React from 'react';
import {Tabs} from 'antd';
import ChartHistory from './ChartHistory';
import ChartDaily from './ChartDaily';
import {css} from 'emotion';

const { TabPane } = Tabs;
let color = window['colors'];

const rootChart = css`
    display: flex;
    justify-content: center;
    .rootMain{
        height: calc(100vh - 50px);
        padding-top: 10px;
        padding-bottom: 1em;
        max-width: 1400px;
        width: 100%;
        @media only screen and (max-width: 1200px) {
            height: calc(100vh - 100px);
            padding-top: 10px;
            padding-bottom: 1em;
            max-width: 1200px;
        }
        
        @media only screen and (max-width: 992px) {
            padding-right: 0.5rem;
            padding-left: 0.5rem;
            padding-bottom: 1em;
            height: auto;
            overflow: hidden;
            width: 100%;
        }
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
    }
`

function ChartReview (){
    return(
        <div style={{overflow: 'auto'}}>
            <div className={rootChart}>
                <div className="rootMain p-top20">
                    <Tabs defaultActiveKey="1" animated={false}>
                        <TabPane tab={`Lãi lỗ hàng ngày`} key="1">
                            <ChartDaily />
                        </TabPane>
                        <TabPane tab={`Lịch sử giao dịch`} key="2">
                            <ChartHistory/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default ChartReview;
