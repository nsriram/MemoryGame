$(function () {
    var joker = "url(joker.jpg)";
    var batman = "url(batman.jpg)";
    var blank = "url(blank.jpg)";
    var cards = [joker, batman, joker, batman, joker, batman, joker, batman];

    console.log('App ready');

    var controller = new Leap.Controller();
    console.log('Leap initialized');

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
        var screenX = 175 + leapX;
        var screenY = 350 - leapY;
        console.log("screenX, screenY=" + screenX + "," + screenY);

        var winMaxX = $(document).width();
        var winMaxY = $(document).height();
        console.log("winMaxX, winMaxY = " + winMaxX + "," + winMaxY);

        var screenXMax = 350;
        var screenYMax = 350;

        var winX = (screenX * winMaxX) / screenXMax;
        var winY = (screenY * winMaxY) / screenYMax;
        console.log("winX, winY = " + winX + "," + winY);

        var cols = 4;

        var row = Math.ceil(winY / 250) - 1;
        var col = Math.ceil(winX / 300) - 1;
        console.log("row,col = " + row + "," + col);

        return (row * cols) + (col);
    };

    var handleTap = function (gesture, index) {
        if (gesture.type === 'screenTap') {
            var tapPosition = gesture.position;
            var x = tapPosition[0];
            var y = tapPosition[1];


            var imageId = mapImageId(x, y);

            console.log(imageId);
            $('#' + imageId).click();
        }
    };

    Leap.loop({enableGestures:true}, function (frame) {
        if (frame.gestures && frame.gestures.length > 0) {
            frame.gestures.forEach(handleTap);
        }
    });
});