$("#text-message").keyup(function() {
    socket.emit("typing");
});

socket.on('typing', function(data) {
    if (data.typing) {
        if (!$("#" + data.id).length && localUser != data.username) {
            //Create typing element
            $("#messages").append('<li id="' + data.id + '" class="' + data.username + ' typing msgtxt"><p class="msg"><b>' + data.username + ':</b> <i>Typing...</i></p></li>');
        }
    } else {
        $("#" + data.id).remove();
    }

    $("#messages").append($("#" + data.id));
    //console.log(data);

});
