/*File.prototype.convertToBase64 = function(callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
        callback(e.target.result)
    };
    reader.onerror = function(e) {
        callback(null);
    };
    reader.readAsDataURL(this);
};

$("#fakePostImage").on('change', function() {
    var selectedFile = this.files[0];
    selectedFile.convertToBase64(function(base64) {
        $("#realPostImage").val(base64);
        console.log($("#realPostImage").val());
    })
});
$("#fakeReplyImage").on('change', function() {
    var selectedFile = this.files[0];
    selectedFile.convertToBase64(function(base64) {
        $("#realPostImage").val(base64);
        console.log($("#realReplyImage").val());
    })
});
$("#fakeChatImage").on('change', function() {
    var selectedFile = this.files[0];
    selectedFile.convertToBase64(function(base64) {
        $("#realChatImage").val(base64);
        console.log($("#realChatImage").val());
    })
});

document.getElementById('text-message').onpaste = function(event) {
    // use event.originalEvent.clipboard for newer chrome versions
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    console.log(JSON.stringify(items)); // will give you the mime types
    // find pasted image among pasted items
    var blob = null;
    for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") === 0) {
            blob = items[i].getAsFile();
        }
    }
    // load image if there is a pasted image
    if (blob !== null) {
        var reader = new FileReader();
        reader.onload = function(event) {
            console.log(event.target.result); // data url!
            $("#realChatImage").val(event.target.result);
            $("#realChatImage").parent().submit();

        };
        reader.readAsDataURL(blob);
    }
}*/
