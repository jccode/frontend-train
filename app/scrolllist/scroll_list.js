import _ from 'underscore';
import FixedQueue from './fix-queue';


var Viewport = function(size) {
    this.contents = FixedQueue(size);
    this.eventHandlers = {};
}

Viewport.EVENT = {
    DATA_PREPENDED: 'DATA_PREPENDED',
    DATA_APPENDED: 'DATA_APPENDED',
    DATA_DELETED: 'DATA_DELETED'
};

Viewport.prototype = (function() {

    return {
        /**
         * register event handler
         */
        on: function(event, handler) {
            this.eventHandlers[event] = handler;
        },

        
        /**
         * unregister event handler
         */
        off: function(event) {
            if(this.eventHandlers[event]) {
                delete this.eventHandlers[event];
            }
        }, 
        
        prepend: function(list) {
            var result = _.isArray(list) ?
                    FixedQueue.unshift.apply(this.contents, list) :
                    this.contents.unshift(list);

            var prependHandler = this.eventHandlers[Viewport.EVENT.DATA_PREPENDED],
                deleteHandler = this.eventHandlers[Viewport.EVENT.DATA_DELETED];
            if( prependHandler ){
                prependHandler(list);
            }
            if( deleteHandler && result.deleted.length > 0 ){
                deleteHandler(result.deleted);
            }
        }, 

        append: function(list) {
            var result = _.isArray(list) ?
                    FixedQueue.push.apply(this.contents, list) :
                    this.contents.push(list);

            var appendHandler = this.eventHandlers[Viewport.EVENT.DATA_APPENDED],
                deleteHandler = this.eventHandlers[Viewport.EVENT.DATA_DELETED];
            if( appendHandler ){
                appendHandler(list);
            }
            if( deleteHandler && result.deleted.length > 0 ){
                deleteHandler(result.deleted);
            }
        },

        clear: function() {
            this.contents.splice(0, this.contents.length);
        }, 

        capacity: function() {
            return this.contents.fixedSize;
        }, 

        length: function() {
            return this.contents.length;
        },

        first: function() {
            return this.contents[0];
        }, 

        last: function() {
            return this.contents[this.contents.length - 1];
        }
    };
    
})();



var ScrollList = (function() {

    var default_opts = {
        viewport: 200,       // Container size of the viewport
        incr: 50,            // How many items will be loaded
        scroll_throttle: 100, // Throttle to trigger scroll down/up handler. in pixel.
        template: null,
        render_item: null
    };

    var last_st = 0;  // last scrollTop

    var scrollHandler = function() {
        var $el = this.$el,
            throttle = this.opts.scroll_throttle,
            ch = $el.height(),            // container height
            sh = $el.get(0).scrollHeight, // scroll height
            st = $el.scrollTop();         // scroll top
        
        if (st > last_st) { // scroll down
            if( sh - st - ch < throttle ){
                this.scrollBottomListener.apply(this);
            }
        }
        else { // scroll up
            if( st < throttle ){
                this.scrollTopListener.apply(this);
            }
        }
        
        // update last scrollTop
        last_st = st;
    }


    function initViewport(viewport, data) {
        // console.log( `data.length: ${data.length}, viewport capacity:${viewport.capacity()}` );
        var end = _.min([data.length, viewport.capacity()]);
        viewport.append(_.range(0, end));
    }

    
    /**
     * ScrollList
     *
     *
     * @param {Object} opts
     *    - el         :  ScrollList挂载DOM节点
     *    - data       :  Data List
     *    - template   :  underscore 渲染模板
     *    - render_item :  Data item render function. 单个数据项渲染函数. 如果这个参数不为空,则`template`参数不起作用.否则,
     *                   使用`template`参数进行渲染. 这两个参数,必须至少有一个存在.
     *
     * @return {ScrollList} 
     */

    var SL = function(el, data, opts) {
        // check required options
        if(!opts || (!opts.template && !opts.render_item)) {
            throw 'One of options ("template" or "render_item") must be provided!';
            return;
        }

        // one DOM element can bound to only on ScrollList instance
        var $el = $(el);

        var instance = $el.data("scrollList");
        var self = instance || this;

        self.data = data;
        self.opts = $.extend({}, default_opts, opts);

        if (!instance) {
            this.$el  = $el;
            this.viewport = new Viewport(this.opts.viewport);
            this.viewport.on(Viewport.EVENT.DATA_PREPENDED, this.prependListener.bind(this));
            this.viewport.on(Viewport.EVENT.DATA_APPENDED, this.appendListener.bind(this));
            this.viewport.on(Viewport.EVENT.DATA_DELETED, this.deleteListener.bind(this));

            this.$el.on("scroll", _.debounce(scrollHandler, 500).bind(this));
            this.$el.data("scrollList", this);
        } else {
            instance.$el.children().remove();
            instance.viewport.clear();
        }

        self.initViewport(0);
    }

    SL.prototype = {
        initViewport: function(start) {
            var len = this.data.length,
                capacity = this.viewport.capacity();
            if(!start || start < 0 || start >= len) {
                start = 0;
            }
            var end = _.min([len, start + capacity]);
            if( end == len && len - capacity >= 0 && len - capacity < start){
                start = len - capacity;
            }

            this.viewport.append(_.range(start, end));
        },
        
        scrollTopListener: function () {
            console.log( "scroll up to top, trigger event" );

            var first = this.viewport.first(),
                len = this.data.length,
                incr = this.opts.incr;

            console.log(`before: ${this.viewport.contents.join(",")}`)

            if( first > 0 ){
                var start = _.max([0, first - incr]);
                var prev = _.range(start, first);

                this.viewport.prepend(prev);

                var height = this.$el.get(0).scrollHeight;

                console.log(`after: ${this.viewport.contents.join(",")}`);
                console.log(`prepend len: ${prev.length} , capacity: ${this.viewport.capacity()}, height: ${height}, final result: ${prev.length / this.viewport.capacity() * height}`);

                var delta_height = prev.length / this.viewport.capacity() * height;
                
                this.$el.scrollTop(delta_height);
            }

        },

        scrollBottomListener: function () {
            console.log( "scroll down to bottom, trigger event" );

            var last = this.viewport.last(),
                len = this.data.length,
                incr = this.opts.incr;
            
            // console.log(`len: ${len}, last: ${last}`);
            console.log(`before: ${this.viewport.contents.join(",")}`)
            
            if( last < len ){
                var start = last + 1;
                var next = _.range(start, _.min([start+incr, len]));
                this.viewport.append(next);
                
                var height = this.$el.get(0).scrollHeight;
                
                console.log(`after: ${this.viewport.contents.join(",")}`);
                console.log(`append len: ${next.length} , capacity: ${this.viewport.capacity()}, height: ${height}, final result: ${next.length / this.viewport.capacity() * height}`);

                var delta_height = next.length / this.viewport.capacity() * height;
                
                this.$el.scrollTop(height - delta_height);
            }
        },

        prependListener: function ( list ) {
            console.log(" prepend: ")
            
            this.$el.html(this.buildHtml(list) + this.$el.html());
        },

        appendListener: function (list) {
            console.log( "append:" );
            
            this.$el.html(this.$el.html() + this.buildHtml(list));
        }, 

        deleteListener: function (list) {
            console.log("delete:");
            // console.log( `current: ${this.viewport.contents.join(",")}`  );
            // console.log( `delete: ${list.join(",")}` );

            var capacity = this.viewport.capacity(),
                len = list.length,
                vs = this.viewport.first(), // viewport start
                ve = this.viewport.last(),  // viewport end
                ds = list[0],               // deleted list start
                de = list[len - 1];         // deleted list end
            if( ds > ve ) {
                this.$el.children(":gt(" + (capacity - len) + ")").remove();
            }
            else if ( de < vs) {
                this.$el.children(":lt(" + len + ")").remove();
            }
        },

        buildHtml: function(indexList) {
            var renderItem = this.opts.render_item,
                tpl = this.opts.template,
                data = this.data;

            var buildFun = renderItem || _.template(tpl);
                        
            var content = _.map(indexList, function(item) {
                var obj = _.extend({}, data[item], {_idx: item});
                return buildFun(obj);
            });
            
            return content.join("");
        }, 

        destroy: function () {
            this.data = null;
            this.viewport = null;
            this.$el.off("scroll");
        }
    }
    
    return SL;
    
})();



export default ScrollList;




