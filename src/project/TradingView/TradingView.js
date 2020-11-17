import * as React from 'react';
import * as storage from '../../api/storage';
import {connect} from 'react-redux';
import { Alert } from 'antd';
import './styles.css';

const BASE_URL_CORE = process.env.REACT_APP_BASE_URL;

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

class TVChartContainer extends React.PureComponent {
	static defaultProps = {
		symbol: 'VNM',
		interval: 'D',
		containerId: 'tv_chart_container',
		// datafeedUrl: 'https://demo_feed.tradingview.com',
		datafeedUrl: `${BASE_URL_CORE}/tradingview`,
		libraryPath: '/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		userId: 'public_user_id',
		timezone: "Asia/Ho_Chi_Minh",
		fullscreen: false,
		autosize: true,
		studiesOverrides: {}
	};

	tvWidget = null;

	token = storage.accessTokenCore();

	componentDidUpdate(prev){
		if(this.props.codeStock && prev.codeStock !== this.props.codeStock){
			// let objExchange = this.props.exchangeOnline;
			// if(Object.keys(objExchange.changeStockCode).length > 0){
			// 	this.loadStockCode(objExchange.changeStockCode.stockCode);
			// }
			this.loadStockCode(this.props.codeStock);
		}
	}

	loadStockCode = (stockCode) =>{
		if(this.tvWidget){
			this.tvWidget.setSymbol(stockCode, 'D', () => {
				//todo
			});
		}
	}

	componentDidMount() {
		let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
		let code = this.props.symbol;
        if (obj) {
            if(obj.CODE_STOCK){
                code = obj.CODE_STOCK;
            }
        }
		this.loadTradingView(code);
	}

	loadTradingView = (codeStock)=>{
		try {
			if(this.token){
				const widgetOptions = {
					symbol: codeStock,
					// BEWARE: no trailing slash is expected in feed URL
					datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl, this.token),
					interval: this.props.interval,
					container_id: this.props.containerId,
					library_path: this.props.libraryPath,
					timezone: this.props.timezone,
					locale: getLanguageFromURL() || 'vi',
					disabled_features: ['use_localstorage_for_settings'],
					enabled_features: ['study_templates'],
					charts_storage_url: this.props.chartsStorageUrl,
					charts_storage_api_version: this.props.chartsStorageApiVersion,
					client_id: this.props.clientId,
					user_id: this.props.userId,
					fullscreen: this.props.fullscreen,
					autosize: this.props.autosize,
					studies_overrides: this.props.studiesOverrides,
				};
				const tvWidget = new window.TradingView.widget(widgetOptions);
				this.tvWidget = tvWidget;
				tvWidget.onChartReady(() => {
					tvWidget.headerReady().then(() => {
						const button = tvWidget.createButton();
						button.setAttribute('title', 'Click to show a notification popup');
						button.classList.add('apply-common-tooltip');
						button.addEventListener('click', () => tvWidget.showNoticeDialog({
							title: 'Notification',
							body: 'TradingView Charting Library API works correctly',
							callback: () => {
								console.log('Noticed!');
							},
						}));
		
						button.innerHTML = 'Check API';
					});
					tvWidget
					.chart()
					.onSymbolChanged()
					.subscribe(null, (item) => {
						console.log(item + " item");
						if(item.name){
							let rememberSectionOrder = JSON.parse(localStorage.getItem('rememberSectionOrder'));
							let subNumber = rememberSectionOrder ? rememberSectionOrder.SUB_NUMBER : '00';
							storage.rememberSectionOrder(JSON.stringify({CODE_STOCK: item.name, SUB_NUMBER: subNumber}));
							this.props.dispatch({
								type: 'STOCK_CODE_TRADING',
								data: item.name
							});
						}
					});
				});
			}
		} catch (error) {
			
		}
	}

	componentWillUnmount() {
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	render() {
		return (
			this.token ? 
					<div
						id={ this.props.containerId }
						className={ 'TVChartContainer' }
					/> 
				: 
					<div style={{display: 'flex', justifyContent: 'center', paddingTop: 50}}>
                        <Alert 
                            type="warning" 
                            showIcon
                            message="Đăng nhập bằng tài khoản chứng khoán đã nhoa ^^!" 
                        />
					</div>
		);
	}
}

function mapStateToProps (state){
    return{
		exchangeOnline: state.rootMain['EXCHANGE_ONLINE'],
		codeStock: state.rootMain['STOCK_CODE_TRADING']
    }
}

export default connect(mapStateToProps) (TVChartContainer)
