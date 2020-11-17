import * as api from '../../../api/apiCore';
import * as common from '../../../components/Common/Common';
import {errorVbos} from '../../../error/errorVbos';

export const equityAccountProfitLoss = fetchData => async (dispatch) => {
    try {
        const res = await api.equityAccountProfitLoss(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'EQUITY_ACCOUNT.PROFIT_LOSS',
                data: res
            })
        } else {
            common.notify('error', 'Thao tác thất bại :(' + errorVbos(res.code));
        }
    } catch (er) {
        common.notify("error", er);
    }
}

export const equityAccountAssetInfo = fetchData => async (dispatch) => {
    try {
        const res = await api.equityAccountAssetInfo(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'EQUITY_ACCOUNT.ASSET_INFO',
                data: res
            })
        } else {
            common.notify('error', 'Thao tác thất bại :(' + errorVbos(res.code));
        }
    } catch (er) {
        common.notify("error", er);
    }
}

export const equityAccountStockDetail = fetchData => async (dispatch) => {
    try {
        const res = await api.equityAccountStockDetail(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'EQUITY_ACCOUNT.STOCK_DETAIL',
                data: res
            })
        } else {
            common.notify('error', 'Thao tác thất bại :(' + errorVbos(res.code));
        }
    } catch (er) {
        common.notify("error", er);
    }
}

export const changeHTSPassword = fetchData => async (dispatch) => {
    try {
        const res = await api.changeHTSPassword(fetchData);
        if (!res.error) {
            return dispatch({
                type: 'EQUITY_ACCOUNT.HTSPassword',
                data: "SUCCESS"
            })
        } else {
            common.notify('error', 'Thao tác thất bại :(' + errorVbos(res.code));
        }
    } catch (er) {
        common.notify("error", er);
    }
}