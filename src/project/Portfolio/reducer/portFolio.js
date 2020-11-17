let initialState = {
    data: [],
    'STOCKS.LIST': [],
    'NUMBER.PORTFOLIO.PAGE': 1,
    'EQUITY_ACCOUNT.PROFIT_LOSS': {},
    'EQUITY_ACCOUNT.ASSET_INFO': {},
    'BANK_ACCOUNT.LIST': [],
    'PROPORTION.PUT': {},
    'PORTFOLIO.INFO': {},
    'UPLOAD.ICON': {},
    'INDEX.POST': {},
    'INDEX.GET': {},
    'INDEX.ID': {},
    'INDEX.MANAGEMENT': {},
    'INDEX.ASSET_INFO': {},
    'NUMBER.DETAIL.PAGE': 1,
    'INDEX.FILL_MONEY': {},
    'LIST.INDEXS.INVEST': {},
    'INDEX.REFRESH_PRICE': [],
    'NUMBER.LIST_PORTFOLIO.PAGE': 1,
    'NUMBER.HISTORY_EXCHANGE.PAGE': 1,
    'HISTORY.LIST': [],
    'HISTORY.INDEX_TIME': {},
    'NUMBER.ACCOUNT_BALANCE.PAGE': 1,
    'EQUITY_ACCOUNT.STOCK_DETAIL': [],
    'NUMBER.PORTFOLIO_INVESTING.PAGE': 1,
    'INDEX.INVESTING': {},
    'LIST.INDEXS.INVESTING': {},
    'INDEX.FILL_SELL': [],
    'INDEX.QUANTITY_SELL': {},
    'INDEX.BALANCE': {},
    'INDEX_ID_IN_UPDATE': null,
    'EQUITY_ORDER.HISTORY': [],
    'INDEX_ID_IN_DETAIL': null,
    'DATA.REORDER.HISTORY': {},
    'LIST.PORTFOLIO': {},
    'LIST.INDEX.INVEST': {},
    'LIST.INDEXS.MOVE': {},
    'LIST.INDEX.MOVE_ACTION': {},
    'INDEX.ACTION.MOVE_ACTION': {},
    'PORT_FOLIO_INVEST': '1'
}

let reducer = (state = initialState, action) => {
    return { ...state, [action.type]: action.data };
};

export default reducer;