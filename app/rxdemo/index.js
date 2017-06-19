
// index.html RELOAD
require("file-loader?emitFile=false!../../rxdemo.html");

// css
import "../../scss/common.scss";

// js
import rxdemo1 from "./rx_demo1";


function init() {
    rxdemo1.init();
}

// ready
jQuery($ => {
    init();
})
