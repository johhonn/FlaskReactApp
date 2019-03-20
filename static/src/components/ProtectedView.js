import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/data';
import {updateSavedCurrencies } from '../utils/http_functions';
import axios from 'axios';
function mapStateToProps(state) {
    return {
        data: state.data,
        tokens:state.tokens,
        token: state.auth.token,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProtectedView extends React.Component {
    componentDidMount() {
        this.fetchData()
        
    }
   
   constructor(props){
    super(props);
     this.state={
        selectedCurrency:'',
        allCurrencies:{"currencies":[]},
        stateset:false
        }
    
   }
    fetchData()  {
        
        const token = this.props.token;
        
       this.props.fetchProtectedData(token);
       console.log(this.props)
       
        
    }
    handleChange=(value,event)=>{
       let State={...this.state}
        State[value]=event.target.value
        this.setState(State)
    }
    update=()=>{
        let list=this.state.allCurrencies
        list.currencies.push(this.state.selectedCurrency)
        console.log(JSON.stringify(list) +"stringified")
        updateSavedCurrencies(this.props.token,JSON.stringify(list),1)
        this.setState({allCurrencies:list})
        console.log(list+"original list")
        this.props.updateCurrencies(list)
        
    }
    setCurrencies=()=>{
        this.setState({allCurrencies:this.props.data.tokens,stateset:true},()=>console.log(this.state))
    }
    render() {
       //console.log(typeof(this.props.data.data.currency))
        //let object=JSON.parse(this.props.data.data.currency)
        
        //JSON.parse(this.props.data.tokens).currencies.length
       console.log(this.state)
       console.log(this.props)
       let prices=true
       let tokenlist=null
       let x=this.state.allCurrencies==null ? 0:this.state.allCurrencies.currencies.length
       if(this.props.loaded){
           x=this.props.data.tokens
           let y=this.props.data.tokens.currencies
           
           console.log(x)
            if(typeof(x)==='string'){    
             x=JSON.parse(this.props.data.tokens).currencies.length
             y=JSON.parse(this.props.data.tokens)
            }else{
              x=this.props.data.tokens.currencies.length
            }
            if(x>1){
                let ylist=y.join()
              let  url='https://min-api.cryptocompare.com/data/price?fsym=USD'+ '&tsyms='+ylist
                axios.get(url)
                 .then( (response)=> {
    
                    console.log(response.data);
                    tokenlist=(y.map(item=>(
                        <li>{item} </li>
                     )))
                    prices=false
                    console.log(prices)
                    })
                 .catch(function (error) {
    
                 console.log(error);
                 })
                console.log('rendering')
                
           
        }
        
       console.log(x+"tokens are set")
       }
        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        <h1>Welcome back,
                            {this.props.userName}!</h1>
                        <h1>your are following {x} CryptoCurrencies</h1>
                        <input type="text" placeholder="add new currency" onChange={this.handleChange.bind(this,'selectedCurrency')}></input>
                        <button onClick={this.update}>Add Currency</button>
                        {tokenlist}
                    </div>
                }{!this.prices

                }
            </div>
        );
    }
}

ProtectedView.propTypes = {
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
