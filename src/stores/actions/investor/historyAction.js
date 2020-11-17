import * as api from '../../../api/api';
import * as common from '../../../components/Common/Common';

export const getHistory = fetchData => async (dispatch) => {
    try {
        const res = await api.getHistory(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'HISTORY.LIST',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.code);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const getHistoryIndexTime = fetchData => async (dispatch) => {
    try {
        const res = await api.getHistoryIndexTime(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'HISTORY.INDEX_TIME',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.code);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const refreshSetAgain = fetchData => async (dispatch) => {
    try {
        const res = await api.refreshSetAgain(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'REFRESH.SET.AGAIN',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.code);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}