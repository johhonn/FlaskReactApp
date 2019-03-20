import { RECEIVE_PROTECTED_DATA, FETCH_PROTECTED_DATA_REQUEST,ADD_CURRENCY } from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    data: null,
    tokens:null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_PROTECTED_DATA]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            tokens:payload.data.currency,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_PROTECTED_DATA_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
    [ADD_CURRENCY] : (state,payload)=>  
    Object.assign({}, state, {
         tokens:payload.data,
    })
});
