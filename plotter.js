$(function () {

    var fingerTipX = 0;
    var fingerTipY = 0;
    var canvas = $('#plain_canvas')[0];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var onePixelInMM = 0.264583;

    var winMaxX = window.screen.availWidth;
    var winMaxY = window.screen.availHeight;

    console.log("winMaxX=" + winMaxX + ",winMaxY=" + winMaxY);

    var pixelsPerMM = function () {
        $("body").append("<div id='onebyone' style='width:1mm;height:1mm;display:hidden;'></div>");
        var widthPixels = $("#onebyone").width();
        var heightPixels = $("#onebyone").height();
        $("#onebyone").remove();
        return [widthPixels, heightPixels];
    };
    var pixelsInMM = pixelsPerMM();
    var screenXMax = winMaxX * onePixelInMM;

    var screenYMax = winMaxY * onePixelInMM;
    var yMax = screenYMax;

    console.log("screenXMax=" + screenXMax + ",screenYMax=" + screenYMax);

    var mapLeapToPixels = function (x, y) {
        var screenX = (screenXMax / 2) - x;
        if (screenYMax < y && yMax < y) {
            yMax = y;
            console.log(yMax);
        }
        var screenY = screenYMax - y;
        return [(screenX * winMaxX) / screenXMax, (screenY * winMaxY) / screenYMax];
    };
    var randomColor = function () {
        return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)
    };

    var drawCircle = function (x, y) {
        var context = canvas.getContext("2d");
        context.beginPath();
        context.arc(x, y, 2.0, 0, (2 * Math.PI), true);
        context.fillStyle = randomColor();
        context.fill();
        context.closePath();
    };

    var removeCircle = function (x, y) {
        var context = canvas.getContext("2d");
        context.beginPath();
        context.arc(x, y, 40, 0, (2 * Math.PI), false);
        context.clip();
        context.closePath();
    };

    var plotFinger = function (x, y) {
//        console.log("x=" + x + ", y=" + y);
        var screenXY = mapLeapToPixels(x, y);
        //console.log("" + screenXY[0] + "," + screenXY[1]);
        //removeCircle(fingerTipX, fingerTipY);
        drawCircle(screenXY[0], screenXY[1]);
        fingerTipX = screenXY[0];
        fingerTipY = screenXY[1];
    };

    Leap.loop(function (frame) {
        if (frame.fingers.length <= 5) {
            frame.fingers.forEach(function (finger) {
                plotFinger(finger.tipPosition[0], finger.tipPosition[1]);
            });
        }
    });
});