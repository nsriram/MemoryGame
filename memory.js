$(function () {
    var symbol = "url(batsymbol.gif)";
    var joker = "url(joker.jpg)";
    var joker2 = "url(joker2.jpg)";
    var joker3 = "url(joker3.jpg)";
    var joker4 = "url(joker4.jpg)";
    var batman = "url(batman.jpg)";
    var batman2 = "url(batman2.jpg)";
    var bike = "url(bike.jpg)";
    var tumbler = "url(tumbler.jpg)";
    var harvey = "url(harvey.jpg)";
    var commissioner = "url(commissioner.jpg)";
    var robin = "url(robin.jpg)";
    var batwoman = "url(batwoman.jpg)";
    var ducard = "url(ducard.jpg)";
    var bane = "url(bane.jpg)";
    var luciusfox = "url(luciusfox.jpg)";
    var rachel = "url(rachel.jpg)";
    var alfred = "url(alfred.jpeg)";

    var blank = "url(blank.jpg)";
    var currentImageId = -1;

    var cards = [harvey, batman, robin, joker, commissioner, batwoman, bane, ducard, luciusfox, rachel, alfred, bike,
        tumbler, symbol, joker2, joker3, batman2, joker4];
    cards = cards.concat(cards);
    cards.sort(function () {
        return 0.5 - Math.random()
    });

    Handlebars.registerHelper('mutipletimes', function (n, multiple, block) {
        var accum = '';
        var start = n * multiple;
        for (var i = start; i < (start + n); ++i) {
            accum += block.fn(i);
        }
        return accum;
    });


    var applyTemplate = function (template, data) {
        var template = $("script[name=" + template + "]").html();
        console.log(Handlebars.compile(template));
        $(".board").append(Handlebars.compile(template)(data));
    };

    applyTemplate("tile", {});

    var cols = 6;

    var onePixelInMM = 0.264583;
    var maxTipVelocity = 50.0;

    var winMaxX = $(window).width();
    var winMaxY = $(window).height();

    var screenXMax = winMaxX * onePixelInMM;
    var screenYMax = winMaxY * onePixelInMM;

    var imageWidth = $(document).width() / 6.25;
    var imageHeight = $(document).height() / 6.25;

    var controller = new Leap.Controller();

    var flipCards = function (card, removeClass, addClass, image) {
        card.removeClass(removeClass);
        card.addClass(addClass);
        card.css("background-image", image);
    };

    var handleOpenedCards = function (openedCards) {
        var card1Image = $(openedCards[0]).css("background-image");
        var card2Image = $(openedCards[1]).css("background-image");
        if (card1Image === card2Image) {
            openedCards.unbind('click');
            $(openedCards[0]).removeClass("open");
            $(openedCards[1]).removeClass("open");
        } else {
            openedCards.forEach(
                function (card, index) {
                    flipCards($(card), "open", "closed", blank);
                });
        }
    };

    $('.tile').bind('click', function () {
        var tile = $(this);
        var isOpened = tile.hasClass("open");

        var openedCards = $('.open');
        if (openedCards.length == 2) {
            handleOpenedCards(openedCards);
            if (isOpened)
                return;
        }
        var cardNumber = this.id;

        var cardImage = cards[cardNumber];
        var isClosed = tile.hasClass("closed");


        if (isClosed) {
            flipCards(tile, "closed", "open", cardImage);
        }
    });

    var mapImageId = function (leapX, leapY) {
//        console.log("leapX, leapY=" + leapX + "," + leapY);

        var screenX = screenXMax / 2 + leapX;
        var screenY = screenYMax - leapY;
//        console.log("screenX, screenY=" + screenX + "," + screenY);

        var winX = (screenX * winMaxX) / screenXMax;
        var winY = (screenY * winMaxY) / screenYMax;
//        console.log("winX, winY = " + winX + "," + winY);

        var colsLeft = Math.floor(winX / imageWidth);
        var rowsAbove = Math.floor(winY / imageHeight);

//        console.log("row,col = " + rowsAbove + "," + colsLeft);

        return (rowsAbove * cols) + (colsLeft);
    };

    var isWithinVelocityLimits = function (x) {
        return x < maxTipVelocity && x > -(maxTipVelocity);
    };

    Leap.loop(function (frame) {
        if (frame.pointables.length == 1) {
            var finger = frame.pointables[0];
            var xVelocity = finger.tipVelocity[0];
            var yVelocity = finger.tipVelocity[1];
            if (isWithinVelocityLimits(xVelocity) &&
                isWithinVelocityLimits(yVelocity)) {

                var x = finger.tipPosition[0];
                var y = finger.tipPosition[1];
                if ((x < screenXMax / 2) && (x > -(screenXMax / 2)) &&
                    (y < screenYMax) && (y > 0)) {
                    var imageId = mapImageId(x, y);
                    if (imageId !== currentImageId) {
                        $('#' + imageId).click();
                        currentImageId = imageId;
                    }
                }
            }
        }
    });
});