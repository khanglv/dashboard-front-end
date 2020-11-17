import * as api from '../../../api/api';
import * as common from '../../../components/Common/Common';

export const actionIndex = fetchData => async (dispatch) => {
    try {
        const res = await api.actionIndex(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.POST',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const getListIndex = fetchData => async (dispatch) => {
    try {
        const res = await api.getListIndex(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.GET',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const getIndexsId = fetchData => async (dispatch) => {
    try {
        const res = await api.getIndexsId(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.ID',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
            return dispatch({
                type: 'INDEX.ID.ERROR',
                data: res
            })
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const getFillMoney = fetchData => async (dispatch) => {
    try {
        const res = await api.getFillMoney(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.FILL_MONEY',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const onRefreshPrice = fetchData => async (dispatch) => {
    try {
        const res = await api.onRefreshPrice(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.REFRESH_PRICE',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const getIndexsManagement = fetchData => async (dispatch) => {
    try {
        const res = await api.getIndexsManagement(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.MANAGEMENT',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const getAssetInfoIndex = fetchData => async (dispatch) => {
    try {
        const res = await api.getAssetInfoIndex(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.ASSET_INFO',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const deleteIndex = fetchData => async (dispatch) => {
    try {
        const res = await api.deleteIndex(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.DELETE',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const getIndexInvesting = fetchData => async (dispatch) => {
    try {
        const res = await api.getIndexInvesting(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.INVESTING',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
            return dispatch({
                type: 'INDEX.INVESTING',
                data: {}
            })
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
} 

export const indexQuantityForSell = fetchData => async (dispatch) => {
    try {
        const res = await api.indexQuantityForSell(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.QUANTITY_SELL',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
} 

export const actionEditIndex = fetchData => async (dispatch) => {
    try {
        const res = await api.actionEditIndex(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.EDIT',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const indexFillMoneySell = fetchData => async (dispatch) => {
    try {
        const res = await api.indexFillMoneySell(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.FILL_SELL',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const indexReblance = fetchData => async (dispatch) => {
    try {
        const res = await api.indexReblance(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.BALANCE',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const getListPortfolio = fetchData => async (dispatch) => {
    try {
        const res = await api.getListPortfolio(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'LIST.PORTFOLIO',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const getListIndexInvest = fetchData => async (dispatch) => {
    try {
        const res = await api.getListIndexInvest(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'LIST.INDEX.INVEST',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const listIndexMove = fetchData => async (dispatch) => {
    try {
        const res = await api.listIndexMove(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'LIST.INDEX.MOVE_ACTION',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const actionIndexMove = fetchData => async (dispatch) => {
    try {
        const res = await api.actionIndexMove(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.ACTION.MOVE_ACTION',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}