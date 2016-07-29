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


$.get("msglog", function(data) {
    $("#messages").prepend(data);
    $("." + localUser + ".msgtxt:not(.you)").addClass("you");
    $("body").removeClass("loading3");
    scrollBottom();
});
$('.top-bar').on('doubletap', function() {
  $(".toggle-hide").toggleClass("hide-for-small-only");
});

setInterval(updateScroll,100);
var scrolled = false;
function updateScroll(){
    if(!scrolled){
        scrollBottom();
    }
}
$("#messages").scroll(function() {
   if(isScrolled()) {
       scrolled = false;
   } else {
      scrolled = true;
   }
});

socket.on('disconnect', function () {
  setTimeout(function (){
    location.href = location.href;
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

$(document).on("activity", function(e){
    if (!isActive){
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
