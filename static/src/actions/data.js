import { FETCH_PROTECTED_DATA_REQUEST, RECEIVE_PROTECTED_DATA,ADD_CURRENCY } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { data_about_user,updateSavedCurrencies } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';

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