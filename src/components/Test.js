import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {equityOrder} from '../stores/actions/core/equityOrderAction';
import {getBankAccount} from '../stores/actions/core/bankAccountAction';

function Test(props){
    const [arrData, setArr] = useState([]);
    useEffect(()=>{
        
    },[arrData]);
    const testOrder = async()=>{
        try {
            const data = {
                accountNumber: "068C000009",
                bankAccount: "9999999999",
                bankCode: "9999",
                bankName: "VCSC",
                orderPrice: 2500,
                orderQuantity: 10,
                orderType: "LO",
                securitiesType: "STOCK",
                sellBuyType: "BUY",
                stockCode: "HUT",
                subNumber: "00"
            }
            let arr = [];
            for(let i = 0; i < 1000; i++){
                setTimeout(()=>{
                    props.equityOrder(data);
                }, 100);
                // props.equityOrder(data);
                arr = [...arr, i];
            }
            setArr(arr);
        } catch (error) {
            
        }
    }

    return(
        <div className="p-top20">
            <button onClick={testOrder}>Test api</button>
            <div style={{width: '100%', borderBottom: '1px solid red', paddingTop: 100}}></div>
            <div style={{paddingTop: 20, paddingLeft: 20}}>
                pass: {arrData.length > 0 ? arrData.map((item, idx)=> {return <div key={idx}>{item} </div>}) : null}
            </div>
        </div>
    )
}

const mapStateToProps = state =>{
    return{
        bankAccount: state.indexCore['BANK_ACCOUNT.LIST']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        equityOrder: (data)=> dispatch(equityOrder(data)),
        getBankAccount: (data)=> dispatch(getBankAccount(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Test);