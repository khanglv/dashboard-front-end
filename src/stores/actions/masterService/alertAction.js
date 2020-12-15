import * as api from '../../../api/apiMaster';
import * as common from '../../../components/Common/Common';

export const getConfigs = fetchData => async (dispatch) => {
    try {
        const res = await api.getConfigs(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'ALERT_CONFIGS.GET',
                data: res.data
            })
        } else {
            common.notify('error', 'Load danh sách thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const updateConfigs = fetchData => async (dispatch) => {
    try {
        const res = await api.updateConfigs(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'ALERT_CONFIGS.UPDATE',
                data: res.data
            })
        } else {
            common.notify('error', 'Cập nhật configs thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const getAlertSubContent = fetchData => async (dispatch) => {
    try {
        const res = await api.getAlertSubContent(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'ALERT_SUB_CONTENT.GET',
                data: res.data
            })
        } else {
            common.notify('error', 'Cập nhật configs thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}

export const getAlertMainContent = fetchData => async (dispatch) => {
    try {
        const res = await api.getAlertMainContent(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'ALERT_MAIN_CONTENT.GET',
                data: res.data
            })
        } else {
            common.notify('error', 'Cập nhật configs thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}