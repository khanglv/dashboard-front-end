import React, { useEffect } from 'react';
import {css} from 'emotion';

import Chart from 'chart.js';

let color = window['colors'];

const rootChart = css`
    display: flex;
    justify-content: center;
    overflow: auto;
    .rootMain{
        height: calc(100vh - 85px);
        padding-top: 10px;
        padding-bottom: 1em;
        max-width: 1400px;
        width: 100%;
        @media only screen and (max-width: 1200px) {
            height: calc(100vh - 100px);
            padding-top: 10px;
            padding-bottom: 1em;
            max-width: 1200px;
        }
        
        @media only screen and (max-width: 992px) {
            padding-right: 0.5rem;
            padding-left: 0.5rem;
            padding-bottom: 1em;
            height: auto;
            overflow: hidden;
            width: 100%;
        }
        .componentItem{
            background-color: ${color._WHITE};
            padding: 1em;
            border-radius: 4px;
            .title{
                color: ${color._BLACK};
                font-weight: 600;
            }
        }
    }
    
`

function ChartNav (){
    const chartRef = React.createRef();
    useEffect(()=>{
        const myChartRef = chartRef.current.getContext("2d");
        new Chart(myChartRef, {
            type: "line",
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
                datasets: [
                    {
                        label: 'My First dataset',
                        fill: false,
                        lineTension: 0, // độ mãnh
                        borderColor: color._BLUE,
                        borderCapStyle: 'square', //radius
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        type: 'bar',
                        label: "Visitor",
                        data: [180, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 100, 65, 59, 80, 81, 56, 55, 40, 55, 40, 65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        backgroundColor: '#71B37C',
                        borderColor: '#71B37C',
                        hoverBackgroundColor: '#71B37C',
                        hoverBorderColor: '#71B37C',
                        barPercentage: 0.1
                    }
                ]
            },
            options: {
                layout: {
                    padding: {
                        left: 50,
                        right: 50,
                        top: 0,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            drawOnChartArea: false
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            drawOnChartArea: false
                        }
                    }]
                }
            },
            responsive:false,
            chartArea: {
                backgroundColor: 'red'
            }
        });
        return () => {

        }
    },[]);

    return(
        <div className={rootChart}>
            <div className="rootMain">
                <div className="p-top20">
                    <div className="componentItem">
                        <div className="title">
                            GIÁ TRỊ TÀI SẢN RÒNG
                        </div>
                        <div className="p-top10">
                            <canvas style={{ width: 800, height: 300 }} ref={chartRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChartNav;