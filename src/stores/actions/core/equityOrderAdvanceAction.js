import * as api from '../../../api/apiCore';
import * as common from '../../../components/Common/Common';
import {errorVbos} from '../../../error/errorVbos';

export const equityOrderAdvance = (fetchData, isNotify = true) => async (dispatch) => {
    try {
        const res = await api.equityOrderAdvance(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'EQUITY_ORDER_ADVANCE.POST',
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

export const equityOrderAdvanceHistory = (fetchData, isNotify = true) => async (dispatch) => {
    try {
        const res = await api.equityOrderAdvanceHistory(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'EQUITY_ORDER_ADVANCE.HISTORY',
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

export const equityOrderAdvanceCancel = (fetchData, isNotify = true) => async (dispatch) => {
    try {
        const res = await api.equityOrderAdvanceCancel(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'EQUITY_ORDER_ADVANCE.CANCEL',
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
