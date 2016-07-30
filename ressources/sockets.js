var socket = io();

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

var localUser = readCookie("localUser");

socket.on('thread new', function(data) {
    $(document).trigger("activity");
    console.log(data);
    addThread(data.id, data.title, data.poster, data.body, data.image, data.time, data.replies);
});

function isScrolled() {
    var node = $("#messages")[0];
    return (node.scrollTop + node.offsetHeight === node.scrollHeight);
}

function scrollBottom() {
    var objDiv = $("#messages")[0];
    objDiv.scrollTop = objDiv.scrollHeight;
}
socket.on("chat message", function(data) {
    $(document).trigger("activity");
    var toScroll = isScrolled();
    var sender = data.sender;
    var message = data.message;
    var messagehtml = '<li class="' + sender + ' msgtxt"><p class="msg"><b>' + sender + ':</b> ' + message + '</p></li>';
    $("#messages").append(messagehtml);
    if (toScroll) {
        scrollBottom();
    }
    $("." + localUser + ".msgtxt:not(.you)").addClass("you");
});
socket.on("chat image", function(data) {
    $(document).trigger("activity");
    var toScroll = isScrolled();
    var sender = data.sender;
    var image64 = data.message;
    var messagehtml = '<li class="' + sender + ' msgtxt"><p class="msg"><b>' + sender + ':</b> <img src="' + image64 + '"></p></li>';
    $("#messages").append(messagehtml);
    if (toScroll) {
        scrollBottom();
    }
    $("." + localUser + ".msgtxt:not(.you)").addClass("you");
});
socket.on("chat status", function(data) {
    var toScroll = isScrolled();
    var subject = data.sender;
    var status = data.message;
    var messagehtml = '<li class="msgnotif"><p class="msg"><b>' + subject + '</b> ' + status + '</p></li>';
    $("#messages").append(messagehtml);
    if (toScroll) {
        scrollBottom();
    }
    $("." + localUser + ".msgtxt:not(.you)").addClass("you");
});
socket.on('reply new', function(data) {
    console.log(data);
    addReply(data.id, data.title, data.poster, data.body, data.image, data.time);
    $(".t-" + data.id + " .reply-count").html(Number($(".partial.t-" + data.id + " .reply-count").html()) + 1)

    if ($("#threadopen").data("threadid") == data.id) {
        $("#thread-dynamic .reply-count").html($(".partial.t-" + data.id + " .reply-count").html())
    }


});
