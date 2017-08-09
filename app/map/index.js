// index.html RELOAD
require("file-loader?emitFile=false!../../hello.html");
// css
import "../../scss/common.scss";
import "../../scss/map.scss";
// js


var map, drawingManager;


// ready
jQuery($ => {
    init();
})

function init() {
    initMap();
    bindEvent();
}

function bindEvent() {
    $("#add_marker").on("click", function() {
        drawingManager.open();
        drawingManager.setDrawingMode(BMAP_DRAWING_MARKER);
    });
    $("#add_region").on("click", function() {
        drawingManager.open();
        drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
    });
    $("#add_line").on("click", function() {
        drawingManager.open();
        drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);
    });
}

function initMap() {
    map = new BMap.Map('map');
    const poi = new BMap.Point(116.307852,40.057031);
    map.centerAndZoom(poi, 16);
    map.enableScrollWheelZoom();
    // map.setDefaultCursor("url(http://api.map.baidu.com/images/ruler.cur) 3 6, crosshair");

    var overlays = [];
	var overlaycomplete = function(e){
        console.log(e);
        window.event = e;
        overlays.push(e.overlay);
        drawingManager.close();
    };
    
    var styleOptions = {
        strokeColor:"red",    //边线颜色。
        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    //实例化鼠标绘制工具
    drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        // enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5) //偏离值
        },
        enableCalculate: true, // 绘制是否进行测距(画线时候)、测面(画圆、多边形、矩形)
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
    });  
	 //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    function clearAll() {
		for(var i = 0; i < overlays.length; i++){
            map.removeOverlay(overlays[i]);
        }
        overlays.length = 0;
    }

    var closedrawing = function() {
        drawingManager.close();
    }

    // drawingManager.addEventListener('markercomplete', closedrawing); 
    // drawingManager.addEventListener('circlecomplete', closedrawing);

    // tips
    /*
    var label = new BMap.Label("单击设置起点");
    label.setStyle({
		color : "red",
		fontSize : "12px",
		height : "20px",
		lineHeight : "20px",
        width: "30px"
	});
    map.addOverlay(label);
    map.addEventListener("mousemove", (e) => {
        label.setPosition(e.point);
    });
     */
}

