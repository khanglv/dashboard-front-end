import * as api from '../../../api/apiCore';
import * as common from '../../../components/Common/Common';
import {errorVbos} from '../../../error/errorVbos';

export const getBankAccount = fetchData => async (dispatch) => {
    try {
        const res = await api.getBankAccount(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'BANK_ACCOUNT.LIST',
                data: res
            })
        } else {
            common.notify("error", errorVbos(res.code));
        }
    } catch (er) {
        common.notify("error", er);
        // return dispatch({
        //     message: er,
        // })
    }
}