$(function () {

    var fingerTipX = 0;
    var fingerTipY = 0;

    var canvas = $('#plain_canvas')[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var onePixelInMM = 0.264583;

    var winMaxX = window.innerWidth;
    var winMaxY = window.innerHeight;

    var pixelsPerMM = function () {
        $("body").append("<div id='onebyone' style='width:1mm;height:1mm;display:hidden;'></div>");
        var pixels = $("#onebyone").width();
        $("#onebyone").remove();
        console.log(pixels);
        return pixels;
    };

    var screenXMax = winMaxX / pixelsPerMM();
    var screenYMax = winMaxY / pixelsPerMM();

    var mapLeapToPixels = function (x, y) {
        var screenX = screenXMax / 2 + x;
        var screenY = screenYMax - y;
        return [(screenX * winMaxX) / screenXMax, (screenY * winMaxY) / screenYMax];
    };

    var drawCircle = function (x, y) {
        var context = canvas.getContext("2d");
        context.beginPath();
        context.arc(x, y, 5, 0, (2 * Math.PI), true);
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
        var screenXY = mapLeapToPixels(x, y);
        //console.log("" + screenXY[0] + "," + screenXY[1]);
        //removeCircle(fingerTipX, fingerTipY);
        drawCircle(screenXY[0], screenXY[1]);
        fingerTipX = screenXY[0];
        fingerTipY = screenXY[1];
    };

    Leap.loop(function (frame) {
        if (frame.fingers.length <= 2 && frame.fingers[0].handId != -1) {
            frame.fingers.forEach(function (finger) {
                plotFinger(finger.tipPosition[0], finger.tipPosition[1]);
            });
        }
    });
});