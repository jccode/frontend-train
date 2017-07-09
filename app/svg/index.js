// index.html RELOAD
require("file-loader?emitFile=false!../../svg.html");
// css
import "../../scss/common.scss";

// js
import * as d3 from 'd3';
import SVG from './svg2';


// ready
jQuery($ => {
    init();
});

var svgRoot;

function init() {
    console.log("hello svg");

    var opts = {
        zoomend: hidePopup
    };
    
    SVG.load("svg-wrapper", '../../images/energy.svg', opts).then(svg => {
        svgRoot = svg;
        svg.selectAll("rect")
            .on("click", (d, i, g) => {
                console.log( "click on rect" );
                const el = g[i];
                console.log( d3.event );

                // test add circle
                addCircle();
                $("#popup").css({
                    left: d3.event.x,
                    top: d3.event.y
                }).show();
            });
    });
}

function addCircle() {
    var x = 200, y = 200;
    svgRoot
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 25)
        .style("fill", "purple");
}

function hidePopup() {
    console.log( "zoomend" );
    $("#popup").hide();
}


