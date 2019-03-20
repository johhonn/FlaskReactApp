import { FETCH_PROTECTED_DATA_REQUEST, RECEIVE_PROTECTED_DATA,ADD_CURRENCY,GET_PRICES } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { data_about_user,updateSavedCurrencies } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';
import axios from 'axios';
export function receiveProtectedData(data) {
    return {
        type: RECEIVE_PROTECTED_DATA,
        payload: {
            data,
        },
    };
}

export function fetchProtectedDataRequest() {
    return {
        type: FETCH_PROTECTED_DATA_REQUEST,
    };
}

export function fetchProtectedData(token) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        data_about_user(token)
            .then(parseJSON)
            .then(response => {
                console.log(response.result.currency+"this is my response")
                dispatch(receiveProtectedData(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    
    };
}

export function updateCurrencies(data) {
    console.log(data +"sending data")
    return {
        type: ADD_CURRENCY,
        payload: {
            data,
        },
    };
}
export function updatePrices(data) {
    console.log(data +"sending data")
    return {
        type: GET_PRICES,
        payload: {
            data,
        },
    };
}
  
export function getCryptoPrices(array){
    return (dispatch) => {
    array=array.join()
    console.log(array)
    let  url='https://min-api.cryptocompare.com/data/price?fsym=USD'+ '&tsyms='+array
      axios.get(url)
       .then( (response)=> {

          console.log(response.data);
          dispatch(updatePrices(response.data));
          
          })
       .catch(function (error) {

       console.log(error);
       })
    }
}