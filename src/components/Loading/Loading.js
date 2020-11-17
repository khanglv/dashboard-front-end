import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import LoadingLayer from './loading.json';

export default function Loading(props){
    // const player = React.createRef();
    return(
        <div style={styles.root}>
            {props.isLoading ? <div>
                <div style={styles.customLoading}>
                    <Player
                        autoplay={true}
                        loop={true}
                        controls={true}
                        src={LoadingLayer}
                        style={styles.isLoading}
                    ></Player>
                </div>
            </div> : null}
            <div style={{...styles.children, ...{opacity: props.isLoading ? 0.5 : 1}}}>{props.children}</div>
        </div>
    )
}

const styles = {
    root: {
        position: 'relative'
    },
    customLoading: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 10000,
        top: 0, 
        left: 0
    },
    isLoading: {
        width: '3em'
    },
    children: {
        clear: 'both'
    }
}