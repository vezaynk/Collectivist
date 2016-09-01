$("#m").on("submit", function(event) {
    event.preventDefault();
    console.log($("#text-message").val());
    var message = $("#text-message").val();
    $("#text-message").val("");
    socket.emit("chat message", message);
});
setInterval(function() {
    $("#messages").outerHeight($(window).height() - $("#m").outerHeight() - $(".top-messenger").outerHeight() - 1);
}, 200);

var page = 1;

$.get("/msglog?page=0", function(data) {
    $("#messages").prepend(data);
    $("." + localUser + ".msgtxt:not(.you)").addClass("you");
    $("body").removeClass("loading3");
    scrollBottom();
});
$('.top-bar').on('doubletap', function() {
    $(".toggle-hide").toggleClass("hide-for-small-only");
});

setInterval(updateScroll, 100);
var scrolled = false;

function updateScroll() {
    if (!scrolled) {
        scrollBottom();
    }
}

$("#messages").scroll(function() {
    if ($("#messages")[0].scrollTop === 0) {
        var prev_height = $("#messages").height();
        $.get("/msglog?page=" + page++, function(data) {
            var $current_top_element = $('#messages').children().first();
            $('#messages').prepend(data);

            var previous_height = 0;
            $current_top_element.prevAll().each(function() {
                previous_height += $(this).outerHeight();
            });

            $('#messages').scrollTop(previous_height);
            $("." + localUser + ".msgtxt:not(.you)").addClass("you");
        });
    }
    if (isScrolled()) {
        scrolled = false;
    } else {
        scrolled = true;
    }
});

socket.on('disconnect', function() {
    setTimeout(function() {
        if (!socket.connected) {
            location.href = location.href;
        }
    }, 5000);

});


//Thing to detect focus
var isActive = true;
var authenticated = false;
window.onfocus = function() {
    isActive = true;
};

window.onblur = function() {
    isActive = false;
};
//Play a beep
var snd = new Audio("/static/beep.wav");

function play_beep() {
    snd.play();
    return false;
}

$(document).on("activity", function(e) {
    if (!isActive) {
        //User is not active, go crazy!
        play_beep();
        $.titleAlert("New Activity!", {
            //These are here to avoid doing it on focus.
            requireBlur: true,
            stopOnFocus: true,
            //Adjustable values
            duration: 0,
            interval: 700
        });
    }
});
