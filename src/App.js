import React, { useEffect, useState } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './stores/configureStore';
import InitData from './initData';
import * as socket from '../src/project/Socket/Socket';
// import {socketIoInit} from '../src/project/Alert/socketIo/socketIo';

function App() {
    let [state] = useState("READY");
    useEffect(()=>{
        socket.initSocket();
        // socketIoInit();
        // onListenEvent("demo-socketIO");
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
