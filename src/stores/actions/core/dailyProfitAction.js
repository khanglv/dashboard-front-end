import * as api from '../../../api/apiCore';
import * as common from '../../../components/Common/Common';
import {errorVbos} from '../../../error/errorVbos';

export const getDailyProfit = (fetchData, isProgress) => async (dispatch) => {
    try {
        const res = await api.getDailyProfit(fetchData, isProgress);
        if (res && !res.error) {
            return dispatch({
                type: 'DAILY.PROFIT',
                data: res
            })
        } else {
            common.notify('error', 'Thao tác thất bại :(' + errorVbos(res.code));
        }
    } catch (er) {
        common.notify("error", er);
    }
}
