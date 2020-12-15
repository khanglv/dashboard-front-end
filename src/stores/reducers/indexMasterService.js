let initialState = {
    data: [],
    'ALERT_CONFIGS.GET': {},
    'ALERT_CONFIGS.UPDATE': {},
    'ALERT_SUB_CONTENT.GET': [],
    'ALERT_MAIN_CONTENT.GET': []
}

let reducer = (state = initialState, action) => {
    return { ...state, [action.type]: action.data };
};

export default reducer;