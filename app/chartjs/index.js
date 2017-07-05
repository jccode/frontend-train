
// index.html RELOAD
require("file-loader?emitFile=false!../../chartjs.html");
// css
import "../../scss/common.scss";
// js
import _ from 'underscore';
import Chart from 'chart.js';
import moment from 'moment';
import echarts from 'echarts';
import MassChart from './masschart';


// global varibles
var line_chart,
    
    echart_ins;



// ready
jQuery($ => {
    init($);
    
    // init_echart_demo();
});



function init($) {
    const codeNames = ['DCF_CurrIn', 'DCF_VoltIn'],
          codes = ['e50990124cDCF_CurrIn', '957100124cDCF_VoltIn'],
          units = ['A', 'V'];
    
    $.get('app/chartjs/candata.json').then(res => {
        // init_chart(res.data, codes, codeNames);
        
        // console.log(res.data);
        init_echart(res.data, codes, codeNames);

        var i = -1, len = codes.length, mapping = {};
        for(; ++i < len;){
            mapping[codes[i]] = {
                name: codeNames[i],
                unit: units[i]
            };
        }

        window.massChart = new MassChart(document.getElementById('echart2'), res.data, mapping);
        
    });

    bind_event();
}

function init_chart(dataList,codes,codeNames) {
    
    var colors=['#009afa','#ff4c78','#fab316','#a9c630','#ac8ff0','#ee6e46','#03b09c', '#bed8f1','#8fcdf4','#004f5e','#4bb4c7','#b5dad3','#08a1b1','#acd5c5','#e8e974','#47aa6a','#6e1255','#eecbc5','#ce342a','#efea5b','#2561a9'];
    
    var showYAxis = true;
    var xAxis = _.map(dataList,function(data){
        return moment(data.date).format("MM/DD HH:mm");
        //return data.date;
    });

    var yAxis = _.map(codeNames,function(codeName, idx) {
        return {
            type: "linear", //"linear": only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            display: showYAxis,
            position: "left",
            id: "y-axis-"+idx,
            gridLines: {
                color: colors[idx]
            }
        };
    });

    var seriesDataList = _.map(codes, function (code) {
        return _.map(dataList,function(data){
            return data[code];
        });
    });

    var seriesData=_.map(seriesDataList,function(data, idx){
        return {
            label: codeNames[idx],
            borderColor: colors[idx],
            backgroundColor: colors[idx],
            fill: false,
            borderWidth: 2,
            pointRadius: 2,
            data: _.map(data,function(item){
                return item && numfix(item['value']);
            }),
            yAxisID: "y-axis-"+idx
        };
    });

    var lineChartData = {
        labels: xAxis,
        datasets: seriesData
    };

    // console.log("init chart");
    // console.log(lineChartData);

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // Destroy the previous instance before create a new one.
    if (line_chart) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        line_chart.destroy();
    }

    line_chart = Chart.Line(ctx, {
        data: lineChartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            hoverMode: 'index', // index
            intersect: false,
            stacked: false,
            title:{
                display: false,
                text:'参数查询'
            },
            scales: {
                /*
                 xAxes: [{
                 type: "time",
                 time: {
                 format: "MM/DD HH:mm",
                 // round: 'day',
                 unit: "minute",
                 tooltipFormat: 'MM/DD HH:mm:ss'
                 },
                 scaleLabel: {
                 display: false,
                 labelString: 'Date'
                 },
                 ticks: {
                 maxRotation: 0
                 }
                 }],
                 */
                yAxes: yAxis
            },
            tooltips: {
                mode: 'index'
            },
            //onClick: chartjsClickHandler

            pan: {
                enabled: true,
                mode: 'xy' // is panning about the y axis neccessary for bar charts?
            },
            zoom: {
                enabled: true,
                drag: true,
                mode: 'xy'
            }
        }
    });
}

function numfix(num){
    if(typeof(num)==='number' && parseInt(num)!==num){
        return parseFloat(num.toFixed(1));
    }
    return num;
}


function init_echart_demo() {
    var data = [];
    var now = +new Date(1997, 9, 3);
    var oneDay = 24 * 3600 * 1000;
    var value = Math.random() * 1000;
    for (var i = 0; i < 1000; i++) {
        data.push(randomData());
    }

    function randomData() {
        now = new Date(+now + oneDay);
        value = value + Math.random() * 21 - 10;
        return {
            name: now.toString(),
            value: [
                // [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                now,
                Math.round(value)
            ]
        }
    }
    
    var option = {
        title: {
            text: '动态数据 + 时间坐标轴'
        },
        // toolbox: {
        //     show: true,
        //     feature: {
        //         dataZoom: {
        //             yAxisIndex: 'none'
        //         },
        //         magicType: {type: ['line', 'bar']},
        //         restore: {},
        //         saveAsImage: {}
        //     }
        // },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0];
                var date = new Date(params.name);
                return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            }
        },
        series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data
        }],
        dataZoom : {
            show : true,
            realtime : true
        }
    };

    console.log(option);
    
    echart_ins = echarts.init(document.getElementById('echart'));
    echart_ins.setOption(option);


    var randomData2 = (basetime, i) => {
        var t = new Date(+basetime + oneDay*i);
        var value = 1000 + Math.random() * 21 - 10;
        return {
            name: now.toString(),
            value: [
                [t.getFullYear(), t.getMonth() + 1, t.getDate()].join('/'),
                Math.round(value)
            ]
        }
    }
    
    $("#btn_add_data").on("click", function() {

        data.splice(730, 0, {
            name: 'xx',
            value: [
                +new Date(1999,10,1,12,0,0),
                500
            ]
        });

        // data.push({
        //     name: +new Date(2002,10,1,12,0,0),
        //     value: [
        //         +new Date(2002,10,1,12,0,0),
        //         600
        //     ]
        // });

        echart_ins.setOption({
            series: [{
                data: data
            }]
        });
    });

    echart_ins.on("datazoom", function(params) {
        console.log('datazoom');
        console.log(params);
    });
    echart_ins.on("brush", (params) => {
        console.log("brush");
        console.log(params);
    })
    echart_ins.on("brushselected", (params) => {
        console.log("brush selected");
        console.log(params);
    })
}

function init_echart(dataList,codes,codeNames) {

    var colors=['#009afa','#ff4c78','#fab316','#a9c630','#ac8ff0','#ee6e46','#03b09c'];
    var xAxis = _.map(dataList,function(data){
        return moment(data.date).format("MM/DD HH:mm:ss");
    });
    var yAxisDeltaWidth = 30;
    var yAxis = _.map(codeNames,function(codeName, idx) {
        return {
            type: 'value',
            position: 'left',
            offset: idx * yAxisDeltaWidth,
            axisLine:{
                lineStyle:{
                    color:colors[idx]
                }
            }
        };
    });
    var seriesDataList = _.map(codes, function (code) {
        return _.map(dataList,function(data){
            return data[code];
        });
    });
    var seriesData=_.map(seriesDataList,function(data, idx){
        return {
            name: codeNames[idx],
            type:'line',
            yAxisIndex: idx,
            symbol:'bulk', //图标形状
            symbolSize:4,  //图标尺寸
            itemStyle:{
                normal:{
                    color: colors[idx],
                    lineStyle:{
                        color:colors[idx]
                    }
                }
            },
            data: _.map(data,function(show){
                if(!show) {
                    return {};
                }
                return {
                    value: numfix(show.value),
                    extraString: show.extraString
                };
            })
        };
    });

    var grid = codeNames.length * yAxisDeltaWidth;
    var option = {
        tooltip : {
            trigger: 'axis'
            // formatter: echart_tooltip_formatter
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        legend: {
            data: codeNames
        },
        dataZoom : {
            show : true,
            realtime : true
        },
        grid: {
            left: grid
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                data : xAxis
            }
        ],
        yAxis : yAxis,
        series :seriesData
    };

    echart_ins = echarts.init(document.getElementById('echart'));
    echart_ins.setOption(option);
    //myChart.on("click", echart_click_handler);

    // console.log( 'echart options' );
    // console.log(option);
    window.echart_ins = echart_ins;
}


function bind_event() {
    $("#btn_add_data").on('click', function() {
        console.log("add data");

        addData("06/15 09:55:01", [30,24])
        addData("06/15 09:55:02", [30,24])
        addData("06/15 09:55:03", [30,24])
        addData("06/15 09:55:04", [30,24])
        
    });
}


function addData(x, ys) {
    var opts = echart_ins.getOption();
    var xAxisData = opts.xAxis[0].data;
    var series = opts.series;

    // console.log(opts)

    // add data to xAxis
    xAxisData.push(x);
    
    // add data to series
    var i = -1, len = ys.length;
    for(; ++i < len;){
        series[i].data.push(ys[i]);
    }

    var newOpts = {
        xAxis: [{
            data: xAxisData
        }],
        series: series
    };
    
    echart_ins.setOption(newOpts);
}
