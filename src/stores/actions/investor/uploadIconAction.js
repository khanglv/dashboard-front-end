import * as api from '../../../api/api';
import * as common from '../../../components/Common/Common';

export const actionUploadIcon = fetchData => async (dispatch) => {
    try {
        const res = await api.actionUploadIcon(fetchData);
        if (res && !res.error) {
            return dispatch({
                type: 'UPLOAD.ICON',
                data: res
            })
        } else {
            common.notify('error', 'Thao tác thất bại :( , ' + res.code);
        }
    } catch (er) {
        common.notify("error", "Thao tác thất bại" + er);
    }
}