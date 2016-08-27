String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function getThread(threadid) {
    $.getJSON("threads/" + threadid + ".json", function(json) {
        var data = json;
        openThread(data.id, data.title, data.poster, data.body, data.image, data.time, data.replies);
        json.replies.forEach(function(value, index, array) {
            addReply(threadid, value.title, value.poster, value.body, value.image, value.time)
        });
        $('#threadopen').foundation('toggle');
    });
}

function openThread(id, title, poster, body, image, time, replies) {
    var threadOP = "<div class='small-12 columns medium-4 toggleImage'><img src='" + image + "'></div><div class=\"medium-8 small-12 columns preview-text\"><div class=\"row heading\"><h3 class=\"title\">" + title + "<\/h3><h6>ID: <span class=\"author\">" + poster + "<\/span><\/h6>\r\n                    <\/div><div class=\"row body\"><p>" + body.replaceAll("\n", "<br>") + "<\/p><\/div><\/div>";

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
    var replyhtml = "<div class=\"small-12 columns preview-text\"><div class=\"row heading\"><h3 class=\"title\">" + title + "<\/h3> <h6>ID: <span class=\"author\">" + poster + "<\/span><\/h6><\/div><div class=\"row body\"><p>" + body.replaceAll("\n", "<br>") + "<\/p><\/div><\/div><\/div><hr>";
    //Append only if threadid matches
    if ($("#threadopen").data("threadid") == id) {
        $(replyhtml).appendTo("#thread-dynamic .thread-replies");
        console.log(title);
    }
}

function loadThread(threadid) {
    switch (threadid) {
        case "":
            break;
        case "s":
            $('#settingsdialog').foundation('open');
            break;
        case "d":
            $('#donatedialog').foundation('open');
            break;
        case "n":
            $('#newthreaddialog').foundation('open');
            break;
        case "i":
            $('#shareimagedialog').foundation('open');
            break;
        case "i":
            $('#shareimagedialog').foundation('open');
            break;
        default:
            getThread(threadid);
    }

}


    window.onhashchange = function () {
        loadThread(window.location.hash.slice(1));
    }


$(document).on("closed.zf.reveal", ".reveal", function()
{
    window.location.hash = "";
})
