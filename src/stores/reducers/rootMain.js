let initialState = {
    data: [],
    'SUB_NUMBER': null,
    'EXCHANGE_ONLINE': {},
    'STOCK_CODE_TRADING': null
}

let reducer = (state = initialState, action) => {
    return { ...state, [action.type]: action.data };
};

export default reducer;