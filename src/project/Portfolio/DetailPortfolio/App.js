import React, {Component} from 'react';
import FirstHeaderChil from '../../FirstHeaderChil';

import {connect} from 'react-redux';

import DetailPortfolio from './DetailPortfolio';
import DetailExchange from './DetailExchange';
import MoveStockToPortfolio from './MoveStockToPortfolio';

import {css} from 'emotion';

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

class AppDetailPortfolio extends Component{
    constructor(props){
        super(props);
        this.state= {
            indexID: null
        }
    }

    componentWillMount(){
        const { match: { params } } = this.props;
        this.setState({indexID: params.indexID});
        // this.props.setDefaultNumberPage();
    }

    render(){
        const {
            indexID
        } = this.state;

        return(
            <div>
                <FirstHeaderChil />
                <div className={mainTrading}>
                    {(() => {
                        switch (this.props.numberDetailPage) {
                            case 1:
                                return <DetailPortfolio _indexID={indexID} subNumberChange={this.props.subNumberChange}/>;
                            case 2:
                                return <DetailExchange subNumberChange={this.props.subNumberChange}/>;
                            case 3:
                                return <MoveStockToPortfolio subNumberChange={this.props.subNumberChange}/>;
                            default:
                                return ;
                        }
                    })()}  
                </div>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        numberDetailPage: state.portFolio['NUMBER.DETAIL.PAGE']
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        setDefaultNumberPage: ()=> dispatch({
            type: 'NUMBER.DETAIL.PAGE',
            data: 1
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AppDetailPortfolio);