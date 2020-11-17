import React from 'react';
import {css} from 'emotion';
import {Tooltip} from 'antd';
import * as common from '../../../components/Common/Common';

// const BASE_URL = 'http://10.11.0.113:4002/uploads/icon';
let color = window['colors'];

const rootCard = css`
    width: 100%;
    height: auto;
    border-radius: 0.6em;
    background-color: ${color._WHITE};
    position: relative;
    transition: top ease 0.5s;
    top: 0;
    cursor: pointer;
    .bodyRoot{
        height: 18em;
        .imgCover{
            border-top-left-radius: 0.6em;
            border-top-right-radius: 0.6em;
        }
    }
    .footerRoot{
        height: auto;
        padding: 1em 1.5em;
        .content{
            color: ${color._BLACK};
            font-size: 1.3em;
            font-weight: 600
        }
        .lablelLeft{
            color: ${color._GREY_666};
            font-size: 13px;
            float: left;
        }
        .lablelRight{
            color: ${color._GREY_666};
            float: right;
            font-weight: 500
        }
        .clearBoth{
            clear: both;
        }
    }
    &:hover{
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
        top: -10px;
    }
`

export function CardFortfolio(props){
    let infoIndex = props.infoIndex;
    const _onDetailPortfolio = ()=>{
        props._onDetailPortfolio();
    }

    return(
        <div className={rootCard} onClick={_onDetailPortfolio}>
            <div className="bodyRoot">
                <img alt="" height="100%" width="100%" className="imgCover" src={`${infoIndex.icon}`} />
            </div>
            <div className="footerRoot">
                <div className="content">
                    {`${common.padWithZeroes(infoIndex.id, 3)} - ${infoIndex.indexsName}`}
                </div>
                <div className="p-top10">
                    <div>
                        <div className="lablelLeft">
                            Số tiền đầu tư tối thiểu&nbsp;
                            <Tooltip
                                title={<span style={{fontSize: '0.8em', lineHeight: 1}}>
                                    Đây là số dư tối thiểu cần thiết để đầu tư vào danh mục này dựa trên quy mô lô tối thiểu của các cổ phiếu cấu thành. 
                                    Số tiền này sẽ được tính thêm 10% tổng giá trị vì sự biến động trong ngày của giá cổ phiếu.
                                </span>}
                            >
                                <img alt="" width="16px" src="/icon/ic_information.svg"/>
                            </Tooltip>
                        </div>
                        <div className="lablelRight">
                            {common.convertTextDecimal(infoIndex.moneyInvestMin)}
                        </div>
                        <div className="clearBoth"></div>
                    </div>
                    <div>
                        <div className="lablelLeft">
                            Lợi nhuận kì vọng&nbsp;
                            <Tooltip
                                title={<span style={{fontSize: '0.8em', lineHeight: 1}}>
                                    Lãi/Lỗ kỳ vọng của danh mục đầu tư căn cứ trên dữ liệu lịch sử biến động giá của các cổ phiếu trong danh mục.
                                    Lưu ý số liệu quá khứ có thể không phản ánh biến động tương lai.
                                </span>}
                            >
                                <img alt="" width="16px" src="/icon/ic_information.svg"/>
                            </Tooltip>
                        </div>
                        <div className="lablelRight">
                            -
                        </div>
                        <div className="clearBoth"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
