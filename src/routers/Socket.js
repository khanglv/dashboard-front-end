import io from 'socket.io-client';

const BASE_URL = process.env.REACT_APP_BASE_URL_INVEST;
const socket = io(BASE_URL);

export const emitEvent = (name, mes)=>{
    try {
        let message = '';
        if(mes){
            message = mes;
        }
        socket.emit(name, {status: 200, message: message});
    } catch (error) {
        
    }
}

export const onEvent = (name, callback)=>{
    socket.on(name, callback);
}