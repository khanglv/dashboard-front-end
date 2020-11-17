import React from 'react';
import {Button, Row, Col, Tooltip} from 'antd';
import {DeleteOutlined, FormOutlined } from '@ant-design/icons';
import * as common from '../../../components/Common/Common';
import Confirm from '../../../components/Dialog/Confirm';
import {css} from 'emotion';

// const BASE_URL = process.env.REACT_APP_BASE_URL_INVEST;
// const BASE_URL_N = `${BASE_URL}/uploads/icon`;

let color = window['colors'];

const rootCard = css`
    width: 100%;
    height: auto;
    border-radius: 0.6em;
    background-color: ${color._WHITE};
    position: relative;
    cursor: pointer;
    transition: top ease 0.5s;
    top: 0;
    cursor: pointer;
    &:hover{
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
        top: -10px;
    }
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
        .date{
            font-size: 14px;
            font-weight: 500;
            color: ${color._BLACK}
        }
        .btnFooter{
            .btnEdit{
                border-radius: 0.3em;
                background-color: #fff2cf;
                color: ${color._ORANGE};
                width: 100%;
                padding: 0.5em;
                height: auto;
                font-weight: 600;
                border: 0;
                &:hover{
                    background-color: #faecc7;
                }
            }
            .btnDelete{
                border-radius: 0.3em;
                background-color: #f89e9e;
                color: ${color._RED_VCSC};
                width: 100%;
                padding: 0.5em;
                height: auto;
                font-weight: 600;
                border: 0;
                &:hover{
                    background-color: #f39696;
                }
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
    }
`

export function CardItemFortfolio(props){
    const [isOpenConfirm, setOpenConfirm] = React.useState(false);
    const data = props.data;

    if(props.isCloseConfirm){
        setOpenConfirm(false);
    }

    const onDeletePortfolio = e =>{
        if(data.status === 0){
            setOpenConfirm(true);
        }else{
            common.notify("warning", "Danh mục này đã được đầu tư, không thể xóa !!!");
        }
        e.stopPropagation(); //stop action
    }

    const _onCloseConfirm = (e)=>{
        e.stopPropagation(); //stop action
        e.preventDefault();
        setOpenConfirm(false);
    }

    const _onActionOk = async(id)=>{
        const res = await props.onActionDeleteIndex(id);
        if(res === true){
            setOpenConfirm(false);
        }
    }

    const _onEditPortfolio = (data) => e =>{
        props.onEditPortfolio(data);
        e.stopPropagation(); //stop action
    }

    const onInvestPortfolio = (id)=>{
        props._onDetailPortfolio(id);
    }

    const tabPosition = props.tabPortfolio;

    return(
        <div className={rootCard} onClick={()=> onInvestPortfolio(data.id)}>
            <Confirm 
                configs={
                    {
                        isOpen: isOpenConfirm,
                        title: 'Xác nhận',
                        message: <span>Quý khách có muốn xóa danh mục <span style={{fontWeight: 600}}>{data.indexsName}</span> này không?</span>
                    }} 
                onClose={_onCloseConfirm}
                onActionOk={()=> _onActionOk(data.id)}
            />
            <div className="bodyRoot">
                <img alt="" height="100%" width="100%" className="imgCover" src={tabPosition === '1' ? data.icon : `${data.icon}`} />
            </div>
            <div className="footerRoot">
                <div className="content">
                    {data ? `${common.padWithZeroes(data.id, 3)} - ${data.indexsName}` : null}
                </div>
                <div className="p-top20">
                    {tabPosition === '2' ?
                        <div>
                            {/* <div>
                                Tạo ngày <span className="date">{common.convertDDMMYYYY(data.createDate)}</span>
                            </div> */}
                            <Row gutter={15} className="btnFooter">
                                <Col span={12}>
                                    <Button
                                        onClick={_onEditPortfolio(data)}
                                        className="btnEdit"
                                        icon={<FormOutlined />}
                                    >
                                        SỬA
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button
                                        onClick={onDeletePortfolio}
                                        className="btnDelete"
                                        icon={<DeleteOutlined />}
                                    >
                                        XÓA
                                    </Button>
                                </Col>
                            </Row>
                        </div>    
                    : <div className="btnFooter">
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
                            {common.convertTextDecimal(data.moneyInvestMin)}
                        </div>
                        <div className="clearBoth"></div>
                    </div>}
                </div>
            </div>
        </div>
    )
}
