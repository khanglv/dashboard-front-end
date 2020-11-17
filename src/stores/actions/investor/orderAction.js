import * as api from '../../../api/api';
import * as common from '../../../components/Common/Common';

export const onOrderPortfolio = fetchData => async (dispatch) => {
    try {
        const res = await api.onOrderPortfolio(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'ORDER.POST',
                data: res.data
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}