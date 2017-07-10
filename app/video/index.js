// index.html RELOAD
require("file-loader?emitFile=false!../../video.html");
// css
import "../../scss/common.scss";
// js

window.HELP_IMPROVE_VIDEOJS = false;

// ready
jQuery($ => {
    init();
})

function init() {
    console.log("video");
}

