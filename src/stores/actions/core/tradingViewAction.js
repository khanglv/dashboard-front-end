import * as api from '../../../api/apiCore';
import * as common from '../../../components/Common/Common';
import {errorVbos} from '../../../error/errorVbos';

export const loadTradingHistory = (fetchData, isProgress = true) => async (dispatch) => {
    try {
        const res = await api.loadTradingHistory(fetchData, isProgress);
        if (res && !res.error) {
            return dispatch({
                type: 'TRADING.HISTORY',
                data: res
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + errorVbos(res.code));
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}