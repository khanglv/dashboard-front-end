
import * as common from '../../components/Common/Common';

let options = {
    port: 8000,
    hostname: 'trading.vcsc.com.vn',
    secure: true,
    codecEngine: window.scCodecMinBin
};

let socket = window.socketCluster.create(options);

export function initSocket(){
    socket = window.socketCluster.create(options);
    console.log(socket + " socket");
    socket.on('error', function (err) {
        console.error(err);
    });

    socket.on('connect', function () {
        console.log('Socket is connected');
    });
}

export function disconectChanel(stockCode){
    socket.unsubscribe(`market.stock.quote.${stockCode}`);
    socket.unsubscribe(`market.stock.bidoffer.${stockCode}`);
}

export async function connectStockQuote(stockCode, callback) {
    let quote = socket.subscribe(`market.stock.quote.${stockCode}`);
    quote.watch(callback);
}

export function connectStockBidoffer(stockCode, callback) {
    let quote = socket.subscribe(`market.stock.bidoffer.${stockCode}`);
    quote.watch(callback);
}
// {
//     "method":"MATCH_ORDER",
//     "payload":
//     {
//         "username":"602801",
//         "orderNumber":"1234",
//         "originalOrderNumber":"1234",
//         "accountNumber":"068C602801",
//         "subNumber":"00",
//         "stockCode":"CVNM1901",
//         "orderQuantity":10,
//         "matchQuantity":10,
//         "totalMatchQuantity":10,
//         "unmatchQuantity":0,
//         "matchPrice":1070,
//         "orderPrice":1070,
//         "sellBuyType":"BUY",
//         "time":"075446",
//         "marketType":"",
//         "tradingType":""
//     }
// }

export function connectNotify(accountInfo, callback) {
    let quote = socket.subscribe(`domain.notify.account.${accountInfo.userInfo.accounts[0].accountNumber}01`);
    quote.watch((res) => {
        if(res.method === 'MATCH_ORDER'){
            common.notify(
                "success", 
                `Khớp lệnh 
                TK ${res.payload.accountNumber} mua ${res.payload.code} 
                KL ${common.convertTextDecimal(res.payload.matchQuantity)} 
                Giá ${common.convertTextDecimal(res.payload.matchPrice)} 
                Lúc ${common.stringToTimeHHMMSS(res.payload.time)}`, 8
            );
        } else if (res.method === 'STOP_ORDER_ACTIVATION') {
            common.notify("success", `Dừng lệnh`, 8);
        } else if (res.method === 'REPORT_FINISH') {
            common.notify("success", `SAO KÊ GIAO DỊCH THANH TOÁN`, 8);

        }
    });    
}

export function emitLogin(accessToken) {
    socket.emit('login', {
        body: {
            grant_type: 'access_token',
            access_token: accessToken,
            client_id: 'vcsc-rest',
            client_secret: 'YRSfIzjbQgUaunSAolSjEWnaAAsRZUmzvzdcblbcrBqqzRGYyckXJKrEciCDWKTP',
        },
        headers: {
            "accept-language": "en"
        }
    }, function (err, data) {
        if (err) {
            console.error(err.code, err);
        } else {
            console.log('login access token success with notify', data);
        }
    });
}
