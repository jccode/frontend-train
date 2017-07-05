
import echarts from 'echarts';
import _ from 'underscore';
import moment from 'moment';


var DEFAULT_ECHART_OPTS = {
    tooltip : {
        trigger: 'axis',
        formatter: function(params) {
            var date = params[0]['data']['value'][0];
            var s = moment(date).format("MM/DD HH:mm:ss")
            return [s].concat(_.map(params, tooltipFormatter)).join("<br>");
        }
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
    dataZoom : {
        show : true,
        realtime : true
        // filterMode: 'filter'
    },
    xAxis : [{
        type : 'time'
    }]
};

var DEFAULT_OPTS = {
    colors: ['#009afa','#ff4c78','#fab316','#a9c630','#ac8ff0','#ee6e46','#03b09c', '#bed8f1','#8fcdf4','#004f5e','#4bb4c7','#b5dad3','#08a1b1','#acd5c5','#e8e974','#47aa6a','#6e1255','#eecbc5','#ce342a','#efea5b','#2561a9'],
    
    yAxisDeltaWidth: 30
};


function MassChart(el, data, codeMapping, options) {
    console.log("Mass chart");
    
    this.data = data;
    this.codeMapping = codeMapping;
    this.codes = _.keys(codeMapping);
    this.codeLength = this.codes.length;
    this.opts = _.extend({}, DEFAULT_OPTS, options);

    this.seriesData = this.makeSeriesData();

    
    var data_opts = {
        legend: {
            data: _.values(codeMapping)
        },
        yAxis: this.makeYAxis(),
        series: this.makeSeries(this.seriesData)
    };
    
    var echart_opts = _.extend({}, DEFAULT_ECHART_OPTS, data_opts);
    
    // console.log("data")
    // console.log( data );
    // console.log( "seriesData" );
    // console.log( this.seriesData );
    
    this.chart = echarts.init(el);
    this.chart.setOption(echart_opts);


    // Events
    // this.chart.on("datazoom", (e) => {console.log( e );})
    // this.chart.on("datarangeselected", (e) => { console.log( e ); })
    // this.chart.on("restore", (e) => { console.log( e ); })
    // this.chart.on("dataviewchanged", (e) => { console.log( e ); })
    // this.chart.on("brush", (e) => { console.log( e ); })
    // this.chart.on("brushselected", (e) => { console.log( e ); })
    
}

MassChart.prototype.makeYAxis = function() {
    var i = -1,
        len = this.codeLength,
        yAxis = [];
    
    for(; ++i < len;){
        yAxis.push({
            type: 'value',
            position: 'left',
            offset: i * this.opts.yAxisDeltaWidth,
            axisLine:{
                lineStyle:{
                    color:this.opts.colors[i]
                }
            }
        });
    }

    return yAxis;
}

MassChart.prototype.makeSeries = function(seriesData) {
    var codes = this.codes,
        codeMapping = this.codeMapping;
    
    var series = _.map(codes, function(code, index) {
        return {
            name: codeMapping[code]['name'],
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            yAxisIndex: index,
            sampling: 'average',
            data: _.map(seriesData, function(d) {
                return d[index];
            })
        };
    });

    // console.log( "--------make series-------" );
    // console.log(dd);
    // console.log( series );
    
    return series;
}

MassChart.prototype.makeSeriesData = function() {
    var codes = this.codes,
        codeMapping = this.codeMapping;
    
    return _.map(this.data, function(item, index) {
        return _.map(codes, function(code) {
            return {
                name: 'xxx',//item.date,
                idx: index,
                value: [
                    item.date,
                    round(item[code].value)
                ],
                extraString: item[code].extraString,
                unit: codeMapping[code]['unit']
            };
        });
    });
}

MassChart.prototype.showTooltip = function(index) {
    // check first, add point if not exist
    var series = this.chart.getModel().getSeries();
    var data0 = series[0].getData();
    var idx = _.sortedIndex(data0.indices, index);
    var isExist = data0.indexOfRawIndex(index) > -1;
    
    if(!isExist) { 
        _.each(series, function(se) {
            se.getData().indices.splice(idx, 0, index);
        });
    }

    // do show tooltips
    this.chart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: index
    });

    // remove the added point
    if(!isExist) {
        _.each(series, function(se) {
            se.getData().indices.splice(idx, 1);
        });
    }
}


/**
 * 格式化
 */
function round(x) {
    // if "Int" then "Int" else format "Float" to 1 decimal
    return x % 1 === 0 ? x : x.toFixed(1);
}

/**
 * Tooltip formatter
 */
function tooltipFormatter(params) {
    var data = params["data"];
    if (!data) {
        return "";
    }
    var extStr = data["extraString"],
        date = data['value'][0],
        val = data['value'][1],
        unit = data["unit"];
    if(extStr && extStr.length > 20) extStr = extStr.substr(0,20).concat('...');
    return params['marker'] +
        params['seriesName'] + ": " +
        (extStr && extStr != "null" ? val + "(" + extStr + ")" : val) +
        unit;
}



export default MassChart;
