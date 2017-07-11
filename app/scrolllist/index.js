// index.html RELOAD
require("file-loader?emitFile=false!../../scrolllist.html");

// css
import "../../scss/scrolllist.scss";

// js
import $ from 'jquery';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';
//import 'jquery-ui/themes/base/draggable.css';
import 'jquery-ui/themes/base/resizable.css';
import 'jquery-ui/ui/core';
//import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/resizable';

import moment from 'moment';
import _ from 'underscore';
import ScrollList from './scroll_list';


// ready
$($ => {
    init();
})

var sl;

function init() {
    console.log("init");
    const data = init_data();
    // console.log(data);
    const opts = {
        viewport: 100,
        incr: 30,
        scroll_throttle: 10,
        template: `<div class="row" id="row_<%= _idx %>"><div class="col-xs-3"><%= _idx %></div><div class="col-xs-3"><%= time %></div><div class="col-xs-3"><%= CURR_IN %></div><div class="col-xs-3"><%= CURR_OUT %></div></div>`
    };
    sl = new ScrollList($("#tbody"), data, opts);
    // sl.initViewport(800);

    bindEvent();
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

function bindEvent() {
    $("#sv-btn").on("click", function() {
        var idx = $("#sv-idx").val();
        sl.scrollIntoView(idx);
    });


    /*
    var w0;
    $(".table-list .thead div").draggable({
        containment: ".thead",
        axis: "x",
        handle: "i.fa",
        start: (e, ui) => {
            console.log("start");
            console.log( e );
            console.log( ui );
            w0 = ui.helper.width();
        },
        drag: (e, ui) => {
            console.log("drag");
            console.log( e );
            console.log( ui );
            // var $el = $(e.target);
            // $el.width($el.width() + ui.position.left);
            var $el = ui.helper;
            
            // _.debounce(()=> {
            // $el.css({
            //     left:0,
            //     top:0,
            //     width: w0+ui.position.left
            // });
                
            // }, 500)();

        },
        stop: (e, ui) => {
            console.log( "stop" );
            ui.helper.css({
                left:0,
                top:0,
                width: w0+ui.position.left
            });
        }
    });
     */

    $(".table-list .thead div").resizable({
        handles: "e",
        start: (e, ui) => {
            console.log( 'start' );
        },
        resize: (e, ui) => {
            console.log( 'resize' );
        },
        stop: after_resize
    });
    
}

const after_resize = (e, ui) => {
    console.log( 'stop' );
    //console.log( e );
    console.log( ui );
    var $el = ui.element,
        idx = $(".thead > div").index($el),
        $col = $(".tbody > .row > div:nth-child(" + (idx+1) + ")");
    //$col.width(ui.size.width);
    //console.log( $col );

    var $row = $(".tbody > .row"), 
        delta_width = ui.originalSize.width - ui.size.width,
        row_width = $row.width();
    console.log( "row width:"+row_width + ", delta_width:"+delta_width);
    $row.eq(0).width(row_width - delta_width);
}
