import React, {useEffect, useState} from 'react';
import {Col, Row} from 'antd';
// import * as common from '../../components/Common/Common';

import {getStockList} from '../../stores/actions/core/stockListAction';
import {connect} from 'react-redux';

import OrderBuy from './OrderBuy';
import DetailOrder from './DetailOrder';
import FirstHeaderChil from '../FirstHeaderChil';

import {css} from 'emotion';

const mainTrading = css`
    height: calc(100vh - 100px);
    padding-top: 10px;
    /* padding-right: 13vw;
    padding-left: 13vw; */
    max-width: 1300px;
    width: 100%;
    @media only screen and (max-width: 1600px) {
        height: calc(100vh - 100px);
        padding-top: 10px;
    }

    @media only screen and (max-width: 1200px) {
        height: calc(100vh - 100px);
        padding-top: 10px;
        padding-right: 5vw;
        padding-left: 5vw
    }
    
    @media only screen and (max-width: 992px) {
        padding-right: 0.5rem;
        padding-left: 0.5rem;
        width: 100%;
        overflow: auto;
    }
`

function OrderMain (props){
    const [codeStock, setCodeStock] = useState('');
    const [lstStockIndex, setLstStockIndex] = useState([]);
    const [isReloadOrderHistory, setIsReloadOrderHistory] = useState(false);

    useEffect(() => {
        function loadData() {
            try {
                // const res = await this.props.getStockList();
                const res = props.lstStock;
                if(res.length > 0){
                    let lstStockTmp = res.filter(item => item.t === 'STOCK');
                    let codeStockTmp = lstStockTmp[0].s;
                    let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
                    if (obj) {
                        if(obj.SUB_NUMBER && obj.SUB_NUMBER === '80'){
                            lstStockTmp = res.filter(item => item.t === 'FUTURES');
                        }
                        if(obj.CODE_STOCK){
                            codeStockTmp = obj.CODE_STOCK;
                        }else{
                            codeStockTmp = lstStockTmp[0].s;
                        }
                    }
                    if(lstStockTmp.length > 0){
                        setCodeStock(codeStockTmp);
                        setLstStockIndex(lstStockTmp);
                    }
                }
            } catch (error) {
                
            }
        }
      
        loadData();
    }, [props.lstStock]);

    const onChangeCodeStock = (codeStock)=>{
        setCodeStock(codeStock);
    }

    const onChangeListStock = (lstStock)=>{
        setLstStockIndex(lstStock);
    }
    
    const onReloadOrderHistory = ()=>{
        setIsReloadOrderHistory(true);
    }

    const reloadedComponent = ()=>{
        setIsReloadOrderHistory(false);
    }

    return(
        <div>
            <FirstHeaderChil />
            <div style={{display: 'flex', justifyContent: 'center', overflowY: 'auto'}}>
                <Row className={mainTrading}>
                    <Col lg={16} md={24} sm={24} xs={24}>
                        <DetailOrder 
                            codeStock={codeStock} 
                            lstStockIndex={lstStockIndex} 
                            _isReloadOrderHistory={isReloadOrderHistory} 
                            _onChangeCodeStock={onChangeCodeStock}
                            _reloadedComponent={reloadedComponent}
                            componentEvent={props.componentEvent}
                        />
                    </Col>
                    <Col lg={8} md={24} sm={24} xs={24}>
                        <OrderBuy 
                            codeStock={codeStock} 
                            lstStockIndex={lstStockIndex} 
                            _onChangeCodeStock={onChangeCodeStock} 
                            _onChangeListStock={onChangeListStock}
                            _onReloadOrderHistory={onReloadOrderHistory}
                            componentEvent={props.componentEvent}
                        />
                    </Col>
                </Row>
            </div>
            
        </div>
    )
}

// class OrderMain extends Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             codeStock: '',
//             lstStockIndex: [],
//             isReloadOrderHistory: false
//         }
//     }

//     componentWillMount(){
//         console.log("vào");
//         this.loadData();
//     }

//     loadData = async ()=>{
//         try {
//             // const res = await this.props.getStockList();
//             const res = this.props.lstStock;
//             if(res.length > 0){
//                 let lstStockTmp = res.filter(item => item.t === 'STOCK');
//                 let codeStockTmp = lstStockTmp[0].s;
//                 let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
//                 if (obj) {
//                     if(obj.SUB_NUMBER && obj.SUB_NUMBER === '80'){
//                         lstStockTmp = res.filter(item => item.t === 'FUTURES');
//                     }
//                     if(obj.CODE_STOCK){
//                         codeStockTmp = obj.CODE_STOCK;
//                     }else{
//                         codeStockTmp = lstStockTmp[0].s;
//                     }
//                 }
//                 if(lstStockTmp.length > 0){
//                     this.setState({codeStock: codeStockTmp, lstStockIndex: lstStockTmp});
//                 }
//             }
//         } catch (error) {
            
//         }
//     }

//     onChangeCodeStock = (codeStock)=>{
//         this.setState({codeStock: codeStock});
//     }

//     onChangeListStock = (lstStock)=>{
//         this.setState({lstStockIndex: lstStock});
//         // if(lstStock.length > 0){
//         //     this.setState({codeStock: lstStock[0].s});
//         // }
//     }
    
//     onReloadOrderHistory = ()=>{
//         this.setState({isReloadOrderHistory: true});
//     }

//     reloadedComponent = ()=>{
//         this.setState({isReloadOrderHistory: false});
//     }

//     render(){
//         const {
//             codeStock,
//             lstStockIndex,
//             isReloadOrderHistory
//         } = this.state;

//         return(
//             <div>
//                 <FirstHeaderChil />
//                 <div style={{display: 'flex', justifyContent: 'center', overflowY: 'auto'}}>
//                     <Row className={mainTrading}>
//                         <Col lg={16} md={24} sm={24} xs={24}>
//                             <DetailOrder 
//                                 codeStock={codeStock} 
//                                 lstStockIndex={lstStockIndex} 
//                                 _isReloadOrderHistory={isReloadOrderHistory} 
//                                 _onChangeCodeStock={this.onChangeCodeStock}
//                                 _reloadedComponent={this.reloadedComponent}
//                                 componentEvent={this.props.componentEvent}
//                             />
//                         </Col>
//                         <Col lg={8} md={24} sm={24} xs={24}>
//                             <OrderBuy 
//                                 codeStock={codeStock} 
//                                 lstStockIndex={lstStockIndex} 
//                                 _onChangeCodeStock={this.onChangeCodeStock} 
//                                 _onChangeListStock={this.onChangeListStock}
//                                 _onReloadOrderHistory={this.onReloadOrderHistory}
//                                 componentEvent={this.props.componentEvent}
//                             />
//                         </Col>
//                     </Row>
//                 </div>
                
//             </div>
//         )
//     }
// }

const mapStateToProps = state =>{
    return{
        lstStock: state.indexCore['STOCKS.LIST']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getStockList: () => dispatch(getStockList())
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (OrderMain);