import moment from 'moment';
import { notification } from 'antd';

let color = window['colors'];

export const notify = (type, data, duration = 4.5) => {
    notification[type]({
        message: 'Thông báo',
        description: data,
        duration: duration
    });
};

export const warningConsole = ()=>{
    console.log("%cStop!!! You are unauthorized acces", "color: red; font-size: 40px; font-weight: bold;");
}

export const compareTwoDate = (dataF, dateS)=>{
    try {
        let moment1 = new Date(dateTimeToDate(dataF)).getTime();
        let moment2 = new Date(dateTimeToDate(dateS)).getTime();
        if(moment1 === moment2) // Date First = date Second
            return 1;
        if(moment1 > moment2) // Date First > date Second
            return 2;
        return 0;   // Date First < date Second
    } catch (error) {
        
    }
}

const dateTimeToDate = (date)=>{
    try {
        return moment(new Date(date)).format('YYYY-MM-DD');
    } catch (error) {
        
    }
}

export const dateDDMMYYYYtoISO = (date)=>{
    try {
        return new Date(moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm')).toISOString();
    } catch (error) {
        
    }
}

export const convertTextDecimal = (number)=>{
    if(typeof number === 'number'){
        number = number.toFixed(0);
        return parseInt(number).toLocaleString(undefined, {maximumFractionDigits:2});
    }
    return number;
}

export const convertDDMMYYYY = (date)=>{
    if(typeof date === 'string' && date.length <= 10){
        return date;
    }else{
        const time = moment(date);
        if(time.format('DD/MM/YYYY') === 'Invalid date'){
            return date;
        }
        return time.format('DD/MM/YYYY');
    }
}

export const convertTime = (date)=>{
    return moment(new Date(date)).format('HH:mm');
}

//Suggestion number quantity
export const suggestionNumberQuantity = (value)=>{
    try {
        let arrData = JSON.parse(localStorage.getItem('rememberQuantitySuggestion'));
        let arrNumber = [];
        let number = 1;
        if(value){
            number = parseInt(value);
            if(!number){
                number = 1;
            }
            arrNumber = [number * 10, number * 100, number * 1000, number * 10000];
        }else{
            let isArr = false;
            if(arrData){
                if(arrData.length > 0){
                    isArr = true;
                }
            }
            if(isArr){
                arrNumber = arrData;
            }else{
                arrNumber = [number * 10, number * 100, number * 1000, number * 10000];
            }
        }
        return arrNumber;
    } catch (error) {
        
    }
}

//remember suggest quantity
export const rememberSuggestQuantity = (value)=>{
    try {
        let arrData = JSON.parse(localStorage.getItem('rememberQuantitySuggestion'));
        let newArr = [];
        if(arrData){
            if(arrData.includes(value) === false){
                if(arrData.length < 4 && arrData.length > 0){
                    newArr = [ value, ...arrData];
                }else{
                    arrData.pop();
                    newArr = [value, ...arrData];
                }
            }else{
                newArr = arrData;
            }
        }else{
            newArr = [value];
        }
        return newArr;
    } catch (error) {
        return [];
    }
}

//rounding(HOSE: 10 (ex: 913 -> 910), HXN, UPCOM: 100 (ex: 913 -> 900))
export const roundingNumber = (exchanges, number)=>{
    try {
        if(exchanges === 'HOSE'){
            return Math.floor(number/10)*10 || 0;
        }
        if(exchanges === 'HNX' || exchanges === 'UPCOM'){
            return Math.floor(number/100)*100 || 0;
        }
    } catch (error) {
        
    }
    
}

//set color 
//floor: sàn, ref: tham chiếu, ceiling: trần
export const setColor = (obj)=>{
    try {
        let cl = color._BLACK;
        if(obj.type !== 'ATO' && obj.type !== 'ATC'){
            if(obj.current === obj.ceiling){
                cl = color._PURPLE;
            }
            if(obj.current > obj.ref && obj.current < obj.ceiling){
                cl = color._GREEN;
            }
            if(obj.current === obj.ref){
                cl = color._ORANGE;
            }
            if(obj.current > obj.floor && obj.current < obj.ref){
                cl = color._RED_VCSC;
            }
            if(obj.current === obj.floor){
                cl = color._BLUE;
            }
        }
        return cl;
    } catch (error) {
        
    }
}

export const setColorRatio = (current)=>{
    let cl = color._BLACK;
    if(current > 0){
        cl = color._GREEN;
    }
    if(current < 0){
        cl = color._RED_VCSC;
    }
    return cl;
}

//Tự thêm mã thành 3 kí tự
export const padWithZeroes = (n, width, z) => {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;          
}

//Định dạng input number ngăn cách dấu phẩy
export const formatterNumber = (value)=>{
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const parserNumber = (value)=>{
    return value.replace(/\$\s?|(,*)/g, '');
}

//tách chuỗi ngày convert qua date
export const splitStringDate = (a)=>{
    try {
        let dateConvert = a.slice(0, 8);
        let b = "/";
        let tmp1 = [dateConvert.slice(0, 4), b, dateConvert.slice(4)].join('');
        let tmp2 = [tmp1.slice(0, 7), b, tmp1.slice(7)].join('');
        return new Date(tmp2).toISOString();
    } catch (error) {
        
    }
}

//convert date to format yyyyMMdd
export const dateToYYYYMMDD = (fromDate)=>{
    try {
        let d = new Date(fromDate),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('');
    } catch (error) {
        
    }
}

//convert string to time
export const stringToTimeHHMMSS = (time)=>{
    try {
        return moment(time, 'HH:mm:ss').add(7, 'hours').format("hh:mm:ss"); //convert fomat time zone, after add 7h
    } catch (error) {
        
    }
}

export const statusOrderHistory = (obj)=>{
    if(obj.orderStatus === 'PARTIAL_FILLED'){
        return {status: 'Khớp 1p', color: color._GREEN};
    }else{
        if(obj.unmatchedQuantity === 0){
            if(obj.orderStatus === 'FULL_FILLED')
                return {status: 'Khớp hết', color: color._GREEN};
            if(obj.orderStatus === 'REJECT')
                return {status: 'Từ chối', color: color._GREY_999};
            return {status: 'Hủy', color: color._GREY_999};
        }else{
            if(obj.orderStatus === 'RECEIPT')
                return {status: 'Tiếp nhận', color: color._ORANGE};
            return {status: 'Chờ khớp', color: color._ORANGE};
        }
    }
}

export const statusOrderHistoryStop = (obj)=>{
    switch(obj.status){
        case 'PENDING':
            return {status: 'Chờ kích hoạt', color: color._ORANGE};
        case 'COMPLETED':
            return {status: 'Đã kích hoạt', color: color._GREEN};
        case 'CANCELLED':
            return {status: 'Đã hủy', color: color._GREY_999};
        case 'FAILED':
            return {status: 'Kích hoạt lỗi', color: color._RED_VCSC};
        default:
            return;    
    }
}

//Công thức tăng giảm bước giá
//1: tăng, 0: giảm
export const valueStepPrice = (obj, type = 1)=>{
    try {
        if(obj.market === 'HOSE'){
            if(obj.last){
                if(obj.last < 10000){
                    return valueStepHose(obj, type, 10);
                }
                if(obj.last >= 10000 && obj.last < 50000){
                    return valueStepHose(obj, type, 50);
                }
                if(obj.last >= 50000){
                    return valueStepHose(obj, type, 100);
                }
            }
        }else{
            if(obj.market === 'UPCOM' || obj.market === 'HNX'){
                return valueStepHose(obj, type, 100);
            }
        }
    } catch (error) {
        
    }
}

const valueStepHose = (obj, type = 1, numberPrice = 10)=>{
    let priceStep = 0;
    if(type === 1){
        priceStep = obj.ceilingPrice;
        if(obj.last + numberPrice <= obj.ceilingPrice){
            priceStep = obj.last + numberPrice;
        }
        return priceStep;
    }
    if(type === 0){
        priceStep = obj.floorPrice;
        if(obj.last - numberPrice > obj.floorPrice){
            priceStep = obj.last - numberPrice;
        }
        return priceStep;
    }
    return 0;
}

//Step price for exchanges
export const stepPriceForExchanges = (obj)=>{
    let step = 0;
    if(obj.market === 'HOSE'){
        if(obj.last < 10000){
            step = 10;
        }
        if(obj.last >= 10000 && obj.last < 50000){
            step = 50;
        }
        if(obj.last >= 50000){
            step = 100;
        }
    }
    if(obj.market === 'UPCOM' || obj.market === 'HNX'){
        step = 100;
    }
    return step;
}

//render price suggestion
export const renderPriceSuggestion = (obj)=>{
    try {
        let step = 0; //Bước giá
        let arrDataUp = [];
        
        if(obj.last){
            step = stepPriceForExchanges({...obj, last: obj.floorPrice});
            if(obj.last <= obj.ceilingPrice && obj.last >= obj.floorPrice){
                let nextStep = obj.floorPrice + step;
                let newNextLast = obj.floorPrice;
                while (nextStep <= obj.ceilingPrice) {
                    arrDataUp.push({value: nextStep, color: nextStep < obj.last ? color._RED_VCSC : (nextStep > obj.last ? color._GREEN : color._ORANGE), ratio: ((nextStep-obj.last)*100/obj.last).toFixed(2)});
                    newNextLast = newNextLast + step;
                    step = stepPriceForExchanges({
                        ...obj,
                        last: newNextLast
                    });
                    nextStep = nextStep + step;
                }
            }
            return [...arrDataUp.sort((a, b)=> b.value - a.value), {value: obj.floorPrice, color: color._RED_VCSC, ratio: (( obj.floorPrice-obj.last)*100/obj.last).toFixed(2)}];

            // step = stepPriceForExchanges(obj);
            // if(obj.last <= obj.ceilingPrice && obj.last >= obj.floorPrice){
            //     let nextStep = obj.last + step;
            //     let newNextLast = obj.last;
            //     while (nextStep <= obj.ceilingPrice) {
            //         arrDataUp.push({value: nextStep, color: color._GREEN, ratio: ((nextStep-obj.last)*100/obj.last).toFixed(2)});
            //         newNextLast = newNextLast + step;
            //         step = stepPriceForExchanges({
            //             ...obj,
            //             last: newNextLast
            //         });
            //         nextStep = nextStep + step;
            //     }
            //     let prevStep = obj.last - step;
            //     let newPrevLast = obj.last;
            //     while (prevStep >= obj.floorPrice) {
            //         arrDataDown.push({value: prevStep, color: color._RED_VCSC, ratio: ((prevStep-obj.last)*100/obj.last).toFixed(2)});
            //         newPrevLast = newPrevLast - step;
            //         step = stepPriceForExchanges({
            //             ...obj,
            //             last: newPrevLast
            //         });
            //         prevStep = prevStep - step;
            //     }
            // }
            // return [...arrDataUp.sort((a, b)=> b.value - a.value), {value: obj.last, color: color._ORANGE, ratio: (0).toFixed(2)}, ...arrDataDown];
        }
        return [];
    } catch (error){

    }
}

//compare time current with time trade (2h30)
export const compareTimeTradeValid = ()=>{
    let timeCurrent = new Date().getTime(); //Time hiện tại
    let timeValidPM = new Date().setHours(18,30,0,0); //Thời gian 14h30
    let timeValidAM = new Date().setHours(9,0,0,0); //Thời gian 9h00
    if(timeCurrent > timeValidAM && timeCurrent < timeValidPM)
        return true;
    return false;
}

//check time type
export const compareTimeTradeType = (value, masterRelative)=>{
    try {
        let timeCurrent = new Date().getTime(); //Time hiện tại
        let timeValidPM1430 = new Date().setHours(14,30,0,0); //Thời gian 14h30
        let timeValidPM1445 = new Date().setHours(14,45,0,0); //Thời gian 14h45
        let timeValidAM0900 = new Date().setHours(9,0,0,0); //Thời gian 9h00
        let timeValidAM09015 = new Date().setHours(9,15,0,0); //Thời gian 9h15
        if(value === 0 && masterRelative > 0){
            if(timeCurrent > timeValidAM0900 && timeCurrent < timeValidAM09015)
                return 'ATO'; //mua (màu trần), bán (màu sàn)
            if(timeCurrent > timeValidPM1430 && timeCurrent < timeValidPM1445)
                return 'ATC'; //mua (màu trần), bán (màu sàn)
        }
        return value ? convertTextDecimal(value) : 0;
    } catch (error) {
        
    }
    
}