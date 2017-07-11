// index.html RELOAD
require("file-loader?emitFile=false!../../video.html");
// css
import "../../scss/common.scss";
import "../../scss/video.scss";
// js

window.HELP_IMPROVE_VIDEOJS = false;

// ready
jQuery($ => {
    init();
})

function init() {
    console.log("video");
    //flvjsTest();
}

const flvjsTest = () => {
    if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement');
        var flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: 'images/1.flv'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    }
}
