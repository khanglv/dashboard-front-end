import React, { Component } from 'react';
import RouteURL from './routers/Router';
import {getStockList} from '../src/stores/actions/core/stockListAction';
import {connect} from 'react-redux';

class InitData extends Component {
    componentWillMount(){
        this.loadData();
    }

    loadData = async()=>{
        try {
            await this.props.getStockList();
        } catch (error) {
            
        }
    }

    render(){
        return (
            <div>
                <RouteURL />
            </div>
        )
    }
    
}


const mapDispatchToProps = dispatch =>{
    return{
        getStockList: () => dispatch(getStockList())
    }
}

export default connect(null, mapDispatchToProps) (InitData);
