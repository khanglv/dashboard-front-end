import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading/Loading';
import { connect } from 'react-redux';
import { getDailyProfit } from '../../stores/actions/core/dailyProfitAction';
import Highcharts from 'highcharts/highstock';
import HighChartMaster from 'highcharts/modules/map';
import * as common from '../../components/Common/Common';
import { css } from 'emotion';
Highcharts.setOptions({
    lang: {
        months: [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
            'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
            'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ],
        shortMonths: [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
            'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
            'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ],
        weekdays: [
            'CN', 'T2', 'T3', 'T4',
            'T5', 'T6', 'T7'
        ]
    }
})

HighChartMaster(Highcharts);

let color = window['colors'];

const rootChart = css`
    .componentItem{
        background-color: ${color._WHITE};
        padding: 1em;
        padding-bottom: 0;
        border-radius: 4px;
        .title{
            color: ${color._BLACK};
            font-weight: 600;
        }
    }
`

function ChartDaily(props) {
    const [accountInfo] = useState(JSON.parse(localStorage.getItem('accountInfoKey')));
    const [dataDaily, setDataDaily] = useState({
        dailyProfit: [],
        totalProfit: []
    });
    const [isLoading, setLoading] = useState(false);

    const myRef = React.useRef(null);

    function loadChart() {
        try {
            const myChartRef = myRef.current;
            Highcharts.chart(myChartRef, {
                chart: {
                    style: {
                        fontFamily: 'Montserrat'
                    },
                },
                mapNavigation: {
                    enableMouseWheelZoom: true
                },
                credits: { //hide logo highchart.com
                    enabled: false
                },
                plotOptions: {
                    line: {
                        marker: {
                            enabled: false
                        }
                    },
                    column: {
                        zones: [{
                            value: 0,
                            color: color._RED_VCSC
                        }, {
                            color: color._GREEN
                        }]
                    }
                },
                tooltip: {
                    shared: true,
                    borderColor: 'rgb(124, 181, 236)'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                    ordinal: true,
                },
                yAxis: [{
                    className: 'highcharts-color-0',
                    title: {
                        text: 'Lũy kế'
                    },
                    gridLineColor: color._GREY_LIGHT_2
                }, {
                    className: 'highcharts-color-1',
                    opposite: true,
                    title: {
                        text: 'Hàng ngày'
                    },
                    gridLineColor: color._GREY_LIGHT_2,
                    height: '40%',
                    top: '60%'
                }],
                series: [
                    {
                        name: 'dailyProfit',
                        type: 'column',
                        data: dataDaily.dailyProfit,
                        yAxis: 1
                    },
                    {
                        name: 'totalProfit',
                        type: 'line',
                        color: color._BLUE,
                        data: dataDaily.totalProfit
                    }
                ]
            })
        } catch (error) {

        }
    }

    async function loadDailyProfitOneHundred(arrData) {
        let lastDaily = { date: common.dateToYYYYMMDD(new Date()) };
        if (arrData.length > 0) {
            lastDaily = arrData[arrData.length - 1];
        }
        let obj = JSON.parse(localStorage.getItem('rememberSectionOrder'));
        return props.getDailyProfit({
            accountNumber: accountInfo.userInfo.accounts[0].accountNumber,
            subNumber: obj ? obj.SUB_NUMBER : '00',
            fetchCount: 100,
            baseDate: lastDaily.date
        });
    }

    async function loadDailyProfit(arrData = []) {
        try {
            setLoading(true);
            const res = await loadDailyProfitOneHundred(arrData);
            let objDailyProfit = {dailyProfit: [], totalProfit: []};
            if (res.type === 'DAILY.PROFIT') {
                let lstOrderHis = [];
                if (res.data) {
                    if (res.data.length >= 100) {
                        arrData = [...arrData, ...res.data];
                        loadDailyProfit(res.data);
                    } else {
                        lstOrderHis = [
                            ...arrData, ...res.data
                        ]
                        lstOrderHis = lstOrderHis.reverse();
                        let dataDaily = lstOrderHis.map((item) => {
                            return [
                                new Date(common.splitStringDate(item.date)).setHours(8, 0, 0, 0),
                                item.dailyProfit
                            ]
                        });
            
                        let dataTotal = lstOrderHis.map((item) => {
                            return [
                                new Date(common.splitStringDate(item.date)).setHours(8, 0, 0, 0),
                                item.totalProfit
                            ]
                        });
                        objDailyProfit = {
                            dailyProfit: dataDaily,
                            totalProfit: dataTotal
                        }
                        setDataDaily(objDailyProfit);
                        setLoading(false);
                    }
                }
            }
            else{
                setDataDaily(objDailyProfit);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }
    }

    function loadData() {
        loadDailyProfit();
    }

    useEffect(loadData, [props.subNumberChange]);

    useEffect(loadChart, [dataDaily]);

    return (
        <div className={rootChart}>
            <Loading isLoading={isLoading}>
                <div className="componentItem">
                    <div className="title">
                        GIÁ TRỊ TÀI SẢN RÒNG
                    </div>
                    <div className="p-top10">
                        <div style={{ width: '100%', maxHeight: 400 }} ref={myRef} />
                    </div>
                </div>
            </Loading>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        lstStock: state.indexCore['STOCKS.LIST'],
        subNumberChange: state.rootMain['SUB_NUMBER']
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getDailyProfit: (data) => dispatch(getDailyProfit(data, false))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartDaily);
