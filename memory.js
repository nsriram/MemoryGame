$(function () {
    var joker = "url(joker.jpg)";
    var batman = "url(batman.jpg)";
    var blank = "url(blank.jpg)";
    var cards = [joker, batman, joker, batman, joker, batman, joker, batman];
    console.log('App ready');

    var controller = new Leap.Controller();
    console.log('Leap initialized');

    $('.tile').bind('click', function () {
        var tile = $(this);
        var cardNumber = this.id;
        var cardImage = cards[cardNumber];

        var isClosed  = tile.hasClass("closed");
        console.log(isClosed);

        if (isClosed) {
            tile.removeClass("closed");
            tile.addClass("open");
            tile.css("background-image", cardImage);
        } else {
            tile.removeClass("open");
            tile.addClass("closed");
            tile.css("background-image", blank);
        }
    });

    Leap.loop({enableGestures:true}, function (frame) {
        if (frame.gestures && frame.gestures.length > 0) {
            console.log(frame.gestures);
        }
    });
});