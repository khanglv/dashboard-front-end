import React, {Component} from 'react';
// import * as common from '../../components/Common/Common';
import { Provider } from 'react-redux';
import store from '../reducer/configStorePortfolio';

import {connect} from 'react-redux';

import FirstHeaderChil from '../../FirstHeaderChil';
// import Portfolio from './Portfolio';
// import FormCreate from './FormCreate';
// import Proportion from './Proportion';

import {css} from 'emotion';

// let color = window['colors'];

const mainTrading = css`
    height: calc(100vh - 85px);
    padding-top: 10px;
    padding-bottom: 1em;
    padding-right: 12vw;
    padding-left: 12vw;
    overflow: auto;
    @media only screen and (max-width: 1600px) {
        height: calc(100vh - 100px);
        padding-top: 10px;
        padding-right: 10vw;
        padding-left: 10vw;
        padding-bottom: 1em;
    }

    @media only screen and (max-width: 1200px) {
        height: calc(100vh - 100px);
        padding-top: 10px;
        padding-right: 5vw;
        padding-left: 5vw;
        padding-bottom: 1em;
    }
    
    @media only screen and (max-width: 992px) {
        padding-right: 0.5rem;
        padding-left: 0.5rem;
        padding-bottom: 1em;
    }
`

class AppPortfolio extends Component{
    constructor(props){
        super(props);
        this.state = {
            numberPage: 1
        }
    }

    componentWillUnmount(){
        this.props.getOutPortfolio();
    }
    
    render(){
        return(
            <Provider store={store}>
                <div>
                    <FirstHeaderChil />
                    <div className={mainTrading}>
                        {(() => {
                            // switch (this.props.numberpage) {
                            //     case 1:
                            //         return <Portfolio subNumberChange={this.props.subNumberChange}/>;
                            //     case 2:
                            //         return <FormCreate />
                            //     case 3:
                            //         return <Proportion />;
                            //     default :
                            //         return <Portfolio />;
                            // }
                        })()}  
                    </div>
                </div>
            </Provider>
            
        )
    }
}

const mapStateToProps = state =>{
    return{
        numberpage: state.portFolio['NUMBER.PORTFOLIO.PAGE']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        getOutPortfolio: ()=> dispatch({
            type: 'NUMBER.PORTFOLIO.PAGE',
            data: 1
        }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AppPortfolio);