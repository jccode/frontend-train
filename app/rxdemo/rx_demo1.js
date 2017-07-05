import Rx from 'rx';

function init() {
    console.log("rx demo1 init");
    complete_drag_demo();
    merge_test();
}

const next = (x) => console.log("Next: "+x);
const err = (err) => console.log("Error: "+err);
const complete = () => console.log("Complete");




/**
 * REF: https://egghead.io/lessons/javascript-simple-drag-and-drop-with-observables
 */
function simple_drag_demo() {
    const container = document.getElementById('c1');
    const target = document.getElementById('c2');
    
    const mousedown = Rx.Observable.fromEvent(target, "mousedown");
    const mousemove = Rx.Observable.fromEvent(container, "mousemove");
    const mouseup = Rx.Observable.fromEvent(container, "mouseup");

    const [x0, y0] = [container.offsetLeft, container.offsetTop];
    
    const drags = mousedown.map(e => mousemove.takeUntil(mouseup)).concatAll();
    drags.forEach(e => {
        target.style.left = (e.clientX - x0) + "px";
        target.style.top = (e.clientY - y0) + "px";
    });
}


/**
 * REF: RxJs examples
 *
 * @return {String}
 */
function complete_drag_demo() {
    const container = document.getElementById('c1');
    const target = document.getElementById('c2');
    
    const mousedown = Rx.Observable.fromEvent(target, "mousedown");
    const mousemove = Rx.Observable.fromEvent(container, "mousemove");
    const mouseup = Rx.Observable.fromEvent(container, "mouseup");

    const [x0, y0] = [container.offsetLeft, container.offsetTop];
    const [xm, ym] = [x0 + container.clientWidth - target.clientWidth, y0 + container.clientHeight - target.clientHeight];

    mousedown.flatMap(e => {
        const [startX, startY] = [e.offsetX, e.offsetY];
        return mousemove
            .map(e => {
                e.preventDefault();
                return {
                    left: e.clientX - startX,
                    top: e.clientY - startY
                };
            })
            .filter(e => e.left >= x0 && e.left <= xm && e.top >= y0 && e.top <= ym)
            .takeUntil(mouseup)
    }).subscribe(e => {
        target.style.left = (e.left - x0) + "px";
        target.style.top = (e.top - y0) + "px";
    });
}


function take_until_test() {
    Rx.Observable
        .timer(0, 1000)
        .takeUntil(Rx.Observable.timer(5000))
        .subscribe(next, err, complete);
}


function timer_test() {
    Rx.Observable
        .timer(0, 1000)
        .timeInterval()
        .map(x => `${x.value}:${x.interval}`)
        .take(10)
        .subscribe(next, err, complete);
}


function plunk_test() {
    // test1
    const source = Rx.Observable.from([
        {value: 0},
        {value: 1},
        {value: 2}
    ]).pluck('value');
    const subscription = source.subscribe(
        next, err, complete
    );

    // test2
    Rx.Observable.from([
        { valueA: { valueB: { valueC: 0 }}},
        { valueA: { valueB: { valueC: 1 }}},
        { valueA: { valueB: 2 }}
    ])
        .pluck('valueA', 'valueB', 'valueC')
        .subscribe(next, err, complete);
}


function demo1() {
    const target = document.getElementById("c1");
    const mousemove = Rx.Observable
              .fromEvent(document, 'mousemove')
              .throttle(500)
              // .debounce(500)
    ;
    const subscription = mousemove.subscribe(pos => {
        console.log(`move to -> (${pos.x}, ${pos.y})`);
    });
}


function flatMapLatest_test() {
    var range$ = Rx.Observable.range(1, 3);
    range$
        .flatMap(x => Rx.Observable.from([x+'a', x+'b']))
        .subscribe(next, err, complete);
    range$.flatMapLatest(x => Rx.Observable.from([x+'a', x+'b']))
        .subscribe(next, err, complete);
}

function merge_test() {
    const source1 = Rx.Observable.interval(100).timeInterval()
              .map(i => `First: ${i.value}, time: ${i.interval}`);
    const source2 = Rx.Observable.interval(150).timeInterval()
              .map(i => `Second: ${i.value}, time: ${i.interval}`);

    //Rx.Observable.merge(source1, source2).take(10).subscribe(next, err, complete);
    Rx.Observable.combineLatest(source1, source2).take(10).subscribe(next, err, complete);
}



export default { init };

