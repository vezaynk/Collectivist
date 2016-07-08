File.prototype.convertToBase64 = function(callback) {
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
