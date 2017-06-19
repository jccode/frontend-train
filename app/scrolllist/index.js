// index.html RELOAD
require("file-loader?emitFile=false!../../scrolllist.html");

// css
import "../../scss/common.scss";

// js
import moment from 'moment';
import _ from 'underscore';
import ScrollList from './scroll_list';


// ready
jQuery($ => {
    init();
})


function init() {
    console.log("init");
    const data = init_data();
    // console.log(data);
    const opts = {
        viewport: 500,
        incr: 200,
        template: `<div class="row" id="row_<%= _idx %>"><div class="col-xs-3"><%= _idx %></div><div class="col-xs-3"><%= time %></div><div class="col-xs-3"><%= CURR_IN %></div><div class="col-xs-3"><%= CURR_OUT %></div></div>`
    };
    const sl = new ScrollList($("#tbody"), data, opts);
    sl.initViewport(800);
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


