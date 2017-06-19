// index.html RELOAD
require("file-loader?emitFile=false!../../index.html");
// css
import "../../scss/common.scss";
// js

// ready
jQuery($ => {
    init();
})

function init() {
    console.log("hello");
}

