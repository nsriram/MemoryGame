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

    Leap.loop({enableGestures:true}, function (frame) {
        if (frame.gestures && frame.gestures.length > 0) {
            console.log(frame.gestures);
        }
    });
});