import React, { useEffect, useState } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './stores/configureStore';
import InitData from './initData';
import * as socket from '../src/project/Socket/Socket';
// import io from 'socket.io-client';
// import * as common from './components/Common/Common';

function App() {
    let [state] = useState("READY");
    // const socketIo = io('localhost:7001');
    // socketIo.emit("newMessage", {header: 'Thông báo 1', body: "this is body"});
    // socketIo.on('priceStock', function(data) {
    //     console.log('Got priceStock:', data);
    //     common.notify("info", `Thông báo: ${data}`);
    // });
    useEffect(()=>{
        socket.initSocket();
        return () => {

        }
    },[state]); //chỉ render lại khi state thay đổi

    return (
        <Provider store={store} >
            {<InitData />}
        </Provider>
    );
}

export default App;
