
// index.html RELOAD
require("file-loader?emitFile=false!../index.html");
// css
import "../scss/index.scss";
// js
import rxdemo1 from "./rx_demo1";

function init() {
    console.log("init");
    rxdemo1.init();
}

// ready
jQuery($ => {
    init();
})
