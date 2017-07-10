
import * as d3 from 'd3';


var SVG = (function() {

    var margin = {top: -5, right: -5, bottom: -5, left: -5},

        defaultOpts = {
            zoomstarted: $.noop(),
            zoomend: $.noop()
        },

        container;

    function zoomed() {
        container.attr("transform", d3.event.transform);
    }

    function _load(path) {
        var p = $.Deferred();
        d3.xml(path, function(err, xml) {
            if (err) {
                p.reject(err);
            }
            else {
                var innersvg = container.append('g').append(function() {
                    return xml.documentElement;
                });
                p.resolve(innersvg);
            }
        });
        return p;
    }

    return {
        load: function(domId, path, opts) {
            var $wrapper = $("#"+domId),
                width = $wrapper.width(),
                height = $wrapper.height(),
                opts = $.extend({}, defaultOpts, opts);

            var zoom = d3.zoom()
                    .scaleExtent([1, 10])
                    .on('start', opts.zoomstarted)
                    .on('zoom', zoomed)
                    .on('end', opts.zoomend);

            var svg = d3.select("#"+domId).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
                    .call(zoom);

            var rect = svg.append("rect")
                    .attr('width', width)
                    .attr('height', height)
                    .style('fill', 'none')
                    .style('pointer-events', 'all');

            container = svg.append('g');
            
            return _load(path);
        }
    };
})();


export default SVG;
