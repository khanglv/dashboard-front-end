import * as api from '../../../api/apiCore';
import * as common from '../../../components/Common/Common';
import {errorVbos} from '../../../error/errorVbos';

export const equityOrder = (fetchData, isNotify = true) => async (dispatch) => {
    try {
        const res = await api.equityOrder(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'EQUITY_ORDER.LIST',
                data: res
            })
        } else {
            if(isNotify){
                common.notify('error', 'Thao tác thất bại :(' + errorVbos(res.code));
            }
            // return dispatch({
            //     type: 'EQUITY_ORDER.FAIL',
            //     message: res.code,
            // })
        }
    } catch (er) {
        common.notify("error", er);
        // return dispatch({
        //     message: er,
        // })
    }
}

export const getEquityOrderHistory = (fetchData, isProgress) => async (dispatch) => {
    try {
        const res = await api.getEquityOrderHistory(fetchData, isProgress);
        if (res && !res.error) {
            return dispatch({
                type: 'EQUITY_ORDER.HISTORY',
                data: res
            })
        } else {
            common.notify('error', 'Thao tác thất bại :(' + errorVbos(res.code));
        }
    } catch (er) {
        common.notify("error", er);
    }
}

export const equityOrderCancel = fetchData => async (dispatch) => {
    try {
        const res = await api.equityOrderCancel(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'EQUITY_ORDER.CANCEL',
                data: res
            })
        } else {
            common.notify('error', 'Thao tác thất bại :(' + errorVbos(res.code));
        }
    } catch (er) {
        common.notify("error", er);
    }
}

export const equityOrderModify = fetchData => async (dispatch) => {
    try {
        const res = await api.equityOrderModify(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'EQUITY_ORDER.MODIFY',
                data: res
            })
        } else {
            common.notify('error', 'Thao tác thất bại :(' + errorVbos(res.code));
        }
    } catch (er) {
        common.notify("error", er);
    }
}