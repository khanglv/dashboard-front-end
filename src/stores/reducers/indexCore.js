let initialState = {
    data: [],
    'STOCKS.LIST': [],
    'BUY_ABLE.LIST': {},
    'SELL_ABLE.LIST': [],
    'EQUITY_ORDER.LIST': [],
    'EQUITY_ORDER.HISTORY': [],
    'EQUITY_ORDER.CANCEL': [],
    'EQUITY_ORDER.MODIFY': [],
    'BANK_ACCOUNT.LIST': {},
    'MARKET_STOCK.OBJ': {},
    'MARKET_FUTURES.OBJ': {},
    'EQUITY_ORDER_STOP.POST': {},
    'EQUITY_ORDER_STOP.HISTORY': [],
    'EQUITY_ORDER_STOP.CANCEL': {},
    'EQUITY_ORDER_ADVANCE.POST': {},
    'EQUITY_ORDER_ADVANCE.HISTORY': [],
    'EQUITY_ORDER_ADVANCE.CANCEL': {},
    'EQUITY_ACCOUNT.STOCK_DETAIL': [],
    'STOCKS.QUOTE': [],
    'EQUITY_ACCOUNT.HTSPassword': {},
    'TRADING.HISTORY': {},
    'DAILY.PROFIT': []
}

let reducer = (state = initialState, action) => {
    return { ...state, [action.type]: action.data };
};

export default reducer;