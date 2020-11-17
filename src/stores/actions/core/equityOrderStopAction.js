import * as api from '../../../api/apiCore';
import * as common from '../../../components/Common/Common';
import {errorVbos} from '../../../error/errorVbos';

export const equityOrderStop = (fetchData, isNotify = true) => async (dispatch) => {
    try {
        const res = await api.equityOrderStop(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'EQUITY_ORDER_STOP.POST',
                data: res
            })
        } else {
            if(isNotify){
                common.notify('error', 'Thao tác thất bại :(' + errorVbos(res.code));
            }
        }
    } catch (er) {
        common.notify("error", er);
    }
}

export const getEquityOrderStopHistory = (fetchData, isNotify = true) => async (dispatch) => {
    try {
        const res = await api.getEquityOrderStopHistory(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'EQUITY_ORDER_STOP.HISTORY',
                data: res
            })
        } else {
            if(isNotify){
                common.notify('error', 'Thao tác thất bại :(' + errorVbos(res.code));
            }
        }
    } catch (er) {
        common.notify("error", er);
    }
}

export const equityOrderStopCancel = (fetchData, isNotify = true) => async (dispatch) => {
    try {
        const res = await api.equityOrderStopCancel(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'EQUITY_ORDER_STOP.CANCEL',
                data: res
            })
        } else {
            if(isNotify){
                common.notify('error', 'Thao tác thất bại :(' + errorVbos(res.code));
            }
        }
    } catch (er) {
        common.notify("error", er);
    }
}