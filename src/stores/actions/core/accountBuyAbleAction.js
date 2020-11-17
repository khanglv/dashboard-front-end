import * as api from '../../../api/apiCore';
import * as common from '../../../components/Common/Common';

import {errorVbos} from '../../../error/errorVbos';

export const getAccountBuyAble = fetchData => async (dispatch) => {
    try {
        const res = await api.getAccountBuyAble(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'BUY_ABLE.LIST',
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
        return dispatch({
            message: er,
        })
    }
}