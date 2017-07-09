
import * as d3 from 'd3';


const margin = {top: -5, right: -5, bottom: -5, left: -5};

let container;

function dom_size(el) {
    var style = el.currentStyle || window.getComputedStyle(el);
    return {
        "w": el.offsetWidth,
        "h": el.offsetHeight - (parseInt(style.paddingBottom, 10) + parseInt(style.paddingTop, 10))
    };
};


function zoomed() {
    container.attr("transform", d3.event.transform);
}


/**
 * Load svg to dom 
 *
 * @param {String} el id
 * @return {String} url
 */
function init(domId, url) {
    console.log( "Init svg." );

    const svg_wrapper = document.getElementById(domId),
          ws = dom_size(svg_wrapper),
          width = ws['w'],
          height = ws['h'];

    const zoom = d3.zoom()
              .scaleExtent([1, 10])
              .on('zoom', zoomed);

    const svg = d3.select("#"+domId).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.right + ")" )
              .call(zoom);

    const rect = svg.append("rect")
              .attr('width', width)
              .attr('height', height)
              .style('fill', 'none')
              .style('pointer-events', 'all');

    container = svg.append('g');
    
    return load(url);
}

function load(url) {
    let p = new Promise((resolve, reject) => {
        d3.xml(url, (err, xml) => {
            console.log( 'load svg xml' );
            if (err) {
                console.log( err );
                reject(err);
            }
            const innersvg = container.append('g').append(()=> xml.documentElement);
            resolve(innersvg);
        });
    });
    return p;
}


export default {init};
