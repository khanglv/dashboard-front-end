let initialState = {
    data: [],
    'PROPORTION.PUT': {},
    'UPLOAD.ICON': {},
    'INDEX.LOGS': {}
}

let reducer = (state = initialState, action) => {
    return { ...state, [action.type]: action.data };
};

export default reducer;