$("#text-message").keyup(function() {
    socket.emit("typing");
});

socket.on('typing', function(data) {
    var elem = $("#" + data.id);
    if (data.typing) {
        if (!elem.length && localUser != data.username) {
            //Create typing element
            $("#messages").append('<li id="' + data.id + '" class="' + data.username + ' typing msgtxt"><p class="msg"><b>' + data.username + ':</b> <i>Typing...</i></p></li>');
        }
    } else {
        elem.remove();
    }

    $("#messages").append(elem);
    console.log(data);

});
