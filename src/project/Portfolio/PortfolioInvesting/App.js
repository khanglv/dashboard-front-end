import React, {Component} from 'react';
import FirstHeaderChil from '../../FirstHeaderChil';

import {connect} from 'react-redux';

import PortfolioInvesting from './PortfolioInvesting';
import SalePortfolio from './SalePortfolio';
import RebalancePortfolio from './RebalancePortfolio';
import MoveStockToPortfolio from './MoveStockToPortfolio';

import {css} from 'emotion';

const mainTrading = css`
    height: calc(100vh - 85px);
    padding-top: 10px;
    padding-bottom: 1em;
    max-width: 1400px;
    width: 100%;
    @media only screen and (max-width: 1600px) {
        height: calc(100vh - 100px);
        padding-top: 10px;
        max-width: 1200px;
        padding-bottom: 1em;
    }

    @media only screen and (max-width: 1200px) {
        height: calc(100vh - 100px);
        padding-top: 10px;
        max-width: 1000px;
        padding-bottom: 1em;
    }
    
    @media only screen and (max-width: 992px) {
        padding-right: 0.5rem;
        padding-left: 0.5rem;
        padding-bottom: 1em;
        width: 100%;
    }
`

class AppPortfolioInvesting extends Component{
    constructor(props){
        super(props);
        this.state= {
            
        }

        this.props_master = props;
    }

    componentWillMount(){
        this.props.setDefaultNumberPage();
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
                                    return <PortfolioInvesting subNumberChange={this.props.subNumberChange}/>;
                                case 2:
                                    return <SalePortfolio subNumberChange={this.props.subNumberChange}/>;
                                case 3:
                                    return <RebalancePortfolio subNumberChange={this.props.subNumberChange}/>;
                                case 4:
                                    return <MoveStockToPortfolio subNumberChange={this.props.subNumberChange}/>;
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
        numberDetailPage: state.portFolio['NUMBER.PORTFOLIO_INVESTING.PAGE']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        setDefaultNumberPage: ()=> dispatch({
            type: 'NUMBER.PORTFOLIO_INVESTING.PAGE',
            data: 1
        }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AppPortfolioInvesting);