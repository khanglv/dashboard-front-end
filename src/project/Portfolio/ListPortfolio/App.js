import React, {Component} from 'react';
import FirstHeaderChil from '../../FirstHeaderChil';

import {connect} from 'react-redux';

import ListPortfolio from './ListPortfolio';
import FormCreate from '../Create/FormCreate';
import Proportion from '../Create/Proportion';

import {css} from 'emotion';

const mainTrading = css`
    height: calc(100vh - 100px);
    padding-top: 10px;
    padding-bottom: 1em!important;
    max-width: 1400px;
    width: 100%;
    @media only screen and (max-width: 1600px) {
        height: calc(100vh - 100px);
        padding-top: 10px;
        max-width: 1200px;
    }

    @media only screen and (max-width: 1200px) {
        height: calc(100vh - 100px);
        padding-top: 10px;
        max-width: 1000px;
    }
    
    @media only screen and (max-width: 992px) {
        padding-right: 0.5rem;
        padding-left: 0.5rem;
        width: 100%;
    }
`

class AppListPortfolio extends Component{
    constructor(props){
        super(props);
        this.state= {
            
        }
    }

    componentWillMount(){
        // this.props.setDefaultNumberPage();
    }

    componentWillUnmount(){
        this.removeStores();
    }

    removeStores = ()=>{
        try {
            let arrData = ['PORTFOLIO.INFO', 'PORTFOLIO.DATA', 'UPLOAD.ICON'];
            this.props.dispatch({
                type: 'UPLOAD.ICON',
                data: {}
            });
            this.props.dispatch({
                type: 'NUMBER.PORTFOLIO.PAGE',
                data: 1
            });
            arrData.map(item => {
                let data = {};
                if(item === 'PORTFOLIO.DATA'){
                    data = [];
                }
                return this.props.dispatch({
                    type: item,
                    data: data
                });
            });
        } catch (error) {
            
        }
    }

    render(){

        return(
            <div>
                <FirstHeaderChil />
                <div style={{display: 'flex', justifyContent: 'center', overflow: 'auto'}}>
                    <div className={mainTrading}>
                        {(() => {
                            switch (this.props.numberDetailPage) {
                                case 1:
                                    return <ListPortfolio subNumberChange={this.props.subNumberChange}/>;
                                case 2:
                                    return <FormCreate subNumberChange={this.props.subNumberChange}/>
                                case 3:
                                    return <Proportion subNumberChange={this.props.subNumberChange}/>;
                                default:
                                    return ;
                            }
                        })()}  
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        numberDetailPage: state.portFolio['NUMBER.PORTFOLIO.PAGE'],
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        setDefaultNumberPage: ()=> dispatch({
            type: 'NUMBER.PORTFOLIO.PAGE',
            data: 1
        }),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AppListPortfolio);