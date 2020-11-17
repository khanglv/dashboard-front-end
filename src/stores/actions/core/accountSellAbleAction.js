import * as api from '../../../api/apiCore';
import * as common from '../../../components/Common/Common';
import {errorVbos} from '../../../error/errorVbos';

export const getAccountSellAble = fetchData => async (dispatch) => {
    try {
        const res = await api.getAccountSellAble(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'SELL_ABLE.LIST',
                data: res
            })
        } else {
            common.notify("error", "Không thể load thông tin :( , " + errorVbos(res.code));
            // return dispatch({
            //     message: res.message,
            // })
        }
    } catch (er) {
        common.notify("error", er);
    }
}