import io from 'socket.io-client';
import {AlertView} from './AlertView';
import store from '../../../stores/configureStore';
// import * as common from '../../../components/Common/Common';

const socketIo = io('localhost:7001');

const accountInfo = JSON.parse(localStorage.getItem('accountInfoKey'));
let stringMSNDT = '';
if(accountInfo){
    stringMSNDT = accountInfo.userInfo.accounts[0].accountNumber
}

export const socketIoInit =  async () => {
    try {
        let configs = store.getState().indexMasterService['ALERT_CONFIGS.GET'];
        socketIo.on('disconnect', function () {
            console.log('socket disconnected');
            // socketIo.connect();
        });
        // return new Promise(resolve => {
        //     socketIo.on('connect', () => {
        //         console.log("connect sockket io is successfully ", socketIo.id);
        //         resolve(socketIo);
        //     });
        //     socketIo.on('disconnect', function () {
        //         console.log('socket disconnected');
        //     });
        //     onListenEvent(configs);
        // })
        // onListenEvent(configs);
        onListenEventMaster(configs);
    } catch (error) {
        
    }
}

function onListenEventMaster(configs){
    try {
        if(configs && configs.length === 1){
            if(configs[0].isFloorCeiling){ //chạm sàn
                socketIo.on(`isFloorCeiling_${stringMSNDT}`, function (data) {
                    let content = data.content || '';
                    AlertView(content);
                })
            }
        }
    } catch (error) {
        
    }
}

// export const onListenEvent = (configs)=>{  //Chỉ áp dụng khi khách hàng online
//     let marketEvent = 'VNALLShare';
//     if(configs && configs.length === 1){
//         let configUser = configs[0];
//         switch(configs[0].market){
//             case 'VN30':
//                 marketEvent = 'marketVN30';
//                 break;
//             case 'HNX30':
//                 marketEvent = 'marketHNX30';
//                 break; 
//             case 'VNALLShare':
//                 marketEvent = 'VNALLShare';
//                 break;   
//             default:
//                 break;
//         }
//         socketIo.on(marketEvent, function (data) {
//             if(data){
//                 if(configUser.ceilingFloorCross){ //case 1: Đụng trần sàn
//                     if(data.c === data.cl){ //đụng trần
//                         let content = `Mã ${data.s} (sàn: ${data.m}) đụng trần - Giá: ${common.convertTextDecimal(data.c)}`;
//                         AlertView(content);
//                     }
//                     if(data.c === data.fl){ //đụng sàn
//                         let content = `Mã ${data.s} (sàn: ${data.m}) đụng sàn - Giá: ${common.convertTextDecimal(data.c)}`;
//                         AlertView(content);
//                     }
//                 }
//                 if(configUser.upDownReference){ //case 1: Giá tăng giảm so với giá tham chiếu
//                     if(configUser.upDownReferenceValue){
//                         if(data.c > parseInt((configUser.upDownReferenceValue + 100)*data.rp*0.01)){
//                             let content = `Mã ${data.s} (sàn: ${data.m}) - Giá hiện tại: ${common.convertTextDecimal(data.c)} vượt quá giá tham chiếu ${common.convertTextDecimal(data.rp)} ${configUser.upDownReferenceValue}%`;
//                             AlertView(content);
//                         }
//                     }
//                 }
//             }
//         });
//     }
// }


// const data = {
//     s: 'REE',
//     c: 46150,
//     o: 46350,
//     h: 46350,
//     l: 46100,
//     cl: 49600,
//     fl: 43200,
//     vo: 8150,
//     va: 365,
//     rp: 46400,
//     t: '022934',
//     _t: '9296',
//     m: 'HOSE',
//     channelSubscribe: 'ceilingCrossChannel',
//     market: 'marketVN30'
// }
