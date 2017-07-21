// index.html RELOAD
require("file-loader?emitFile=false!../../video.html");
// css
import "../../scss/common.scss";
import "../../scss/video.scss";
// js

window.HELP_IMPROVE_VIDEOJS = false;
//window.videojs.options.flash.swf = 'node_modules/videojs-swf/dist/video-js.swf';

// ready
jQuery($ => {
    init();
})

function init() {
    console.log("video");
    play_video();
}

function play_video() {
    const player = videojs("my-video");

    const source = {
        flv: {
            src: "images/1.flv",
            type: "video/x-flv"
        },
        mp4: {
            src: "images/2.mp4",
            type: "video/mp4"
        }
    };
    
    // player.src(source.mp4);
    // player.play();

    
    const playlist = [
        {sources: [source.flv]},
        {sources: [source.mp4]}
    ];
    player.playlist(playlist);
    player.playlist.autoadvance(0);
    player.playlist.repeat(false);

    // init playlist-ui
    // player.playlistUi();

}


