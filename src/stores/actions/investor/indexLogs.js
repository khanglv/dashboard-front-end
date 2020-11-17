import * as api from '../../../api/api';
import * as common from '../../../components/Common/Common';

export const indexLogs = fetchData => async (dispatch) => {
    try {
        const res = await api.indexLogs(fetchData);
        if (res && res.success) {
            return dispatch({
                type: 'INDEX.LOGS',
                data: res.data
            })
        } else {
            // common.notify('error', 'Không thể cập nhật logs investor :( , ' + res.message);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}