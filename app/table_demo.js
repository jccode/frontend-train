import moment from 'moment';
import _ from 'underscore';
import ScrollList from './scroll_list';

function init() {
    console.log("table init");
    const data = init_data();
    // console.log(data);
    const opts = {
        viewport: 500,
        incr: 200,
        template: `<div class="row" id="row_<%= _idx %>"><div class="col-xs-3"><%= _idx %></div><div class="col-xs-3"><%= time %></div><div class="col-xs-3"><%= CURR_IN %></div><div class="col-xs-3"><%= CURR_OUT %></div></div>`
    };
    const sl = new ScrollList($("#tbody"), data, opts);
    sl.initViewport(800);
    // $("#row_830").css("background","#f00").get(0).scrollIntoView(true);
    // init_table()
}

function init_data() {
    let i=0, len=2000, data = [], now = moment();
    for(; i<len; i++) {
        now.add(1, "seconds");
        data.push({
            time: now.format('YYYY-MM-DD HH:mm:ss'),
            CURR_IN: _.random(0, 100),
            CURR_OUT: _.random(50, 200)
        })
    }
    return data;
}


function init_table() {
    let now = moment();
    let html = "";
    for(var i=0; i<1000; i++) {
        now.add(1, "seconds");
        html += `<div class="row"> <div class="col-xs-4"> ${now.format('YYYY-MM-DD HH:mm:ss')} </div> <div class="col-xs-4"> 34.9 </div> <div class="col-xs-4"> 113.8 </div> </div>`;;
    }
    $("#tbody").html(html);
}


export default { init }
