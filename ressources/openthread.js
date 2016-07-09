function getThread(threadid) {
    $.getJSON("threads/" + threadid + ".json", function(json) {
        var data = json;
        openThread(data.id, data.title, data.poster, data.body, data.image, data.time, data.replies);
        json.replies.forEach(function(value, index, array) {
            addReply(threadid, value.title, value.poster, value.body, value.image, value.time)
        });
    });
}

function openThread(id, title, poster, body, image, time, replies) {
    var threadOP = "<div class='small-12 columns medium-4 toggleImage'><img src='" + image + "'></div><div class=\"medium-8 small-12 columns preview-text\">\r\n                    <div class=\"row heading\">\r\n                        <h3 class=\"title\">" + title + "<\/h3>\r\n                        <h6>ID: <span class=\"author\">" + poster + "<\/span><\/h6>\r\n                    <\/div>\r\n                    <div class=\"row body\">\r\n                        <p>" + body + "<\/p>\r\n                    <\/div>\r\n                <\/div>";

    $("#thread-dynamic .thread-OP").html(threadOP);

    $('#replyThreadID').val(id);
    $("#threadopen").data("threadid", id);
    $("#thread-dynamic .thread-replies").html("");
    $("#thread-dynamic .reply-count").html(replies.length);

    $('.toggleImage').on('click', function() {
      $(".toggleImage").toggleClass("medium-4");

    });
}

function addReply(id, title, poster, body, image, time) {
    var replyhtml = "<div class=\"small-12 columns preview-text\"><div class=\"row heading\"><h3 class=\"title\">" + title + "<\/h3> <h6>ID: <span class=\"author\">" + poster + "<\/span><\/h6><\/div><div class=\"row body\"><p>" + body + "<\/p><\/div><\/div><\/div><hr>";
    //Append only if threadid matches
    if ($("#threadopen").data("threadid") == id) {
        $(replyhtml).appendTo("#thread-dynamic .thread-replies");
        console.log(title);
    }
}

function loadThread(threadid) {
    getThread(threadid);
}

$(document).on("click", ".thread-button", function() {
    var postid = $(this).data("postid");
    loadThread(postid);
    $('#threadopen').foundation('toggle');
});
