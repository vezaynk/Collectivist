function getList() {
    $.getJSON("threads/list.json", function(json) {
        $("body").removeClass("loading2");
        json.forEach(function(value, index, array) {
            addThread(value.id, value.title, value.poster, value.body, value.image, value.time, value.replies)
        });
    });
}

function addThread(id, title, poster, body, image, time, replies) {
    var replyhtml = "<div class=\"row preview-thread partial t-" + id + " \"> <div class=\"medium-4 show-for-medium columns preview-image\" style=\"background-image: url(" + image + ")\"><\/div>\r\n                <div class=\"medium-8 small-12 columns preview-text\">\r\n                    <div class=\"row heading\">\r\n                        <h3 class=\"title\">" + title + "<\/h3>\r\n                        <h6>ID: <span class=\"author\">" + poster + "<\/span><\/h6>\r\n                    <\/div>\r\n                    <div class=\"row body\">\r\n                        <p>" + body.substring(0, 50) + "...<\/p>\r\n                   \r\n                <\/div><div class=\"row footer\">\r\n                        <a href='#" + id + "'><button type=\"button\" data-postid=\"" + id + "\" name=\"button\" class=\"button thread-button\">Read More<\/button></a>\r\n                        <label><span class='reply-count'>" + replies.length + "</span> replies<\/label> |\r\n                        <label>" + moment(time).format("DD-MM-YYYY h:mm:ss") + "<\/label>\r\n                    <\/div><\/div>";
    $(replyhtml).prependTo(".thread-list");
    console.log(title);
}
getList();
setInterval(function() {
    $('p').linkify();
}, 1200);


//Move to another file
function nightmode(){
   $("<link/>", {
      rel: "stylesheet",
      type: "text/css",
      href: "static/nightmode.css"
   }).appendTo("head");
}

function injectStyles(rule) {
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo("body");
}

injectStyles('a:hover { color: red; }');
