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
window.onresize = function() {
    scrollBottom();
}
$('#m').bind('resize', function() {
    scrollBottom();
});
$("#messages").bind("DOMSubtreeModified", function() {
    scrollBottom();

    $("img").load(function() {
      scrollBottom();
    });
});
$('.top-bar').on('doubletap', function() {
  $(".toggle-hide").toggleClass("hide-for-small-only");
});

setInterval("updateScroll",100);
var scrolled = false;
function updateScroll(){
    if(!scrolled){
        scrollBottom();
    }
}
$("#m").scroll(function() {
   if(toScroll) {
       scrolled = true;
   } else {
      scrolled = false;
   }
});
