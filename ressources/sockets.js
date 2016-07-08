/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */


/**
 * Class for dimension change detection.
 *
 * @param {Element|Element[]|Elements|jQuery} element
 * @param {Function} callback
 *
 * @constructor
 */
ResizeSensor = function(element, callback) {
    /**
     *
     * @constructor
     */
    function EventQueue() {
        this.q = [];
        this.add = function(ev) {
            this.q.push(ev);
        };

        var i, j;
        this.call = function() {
            for (i = 0, j = this.q.length; i < j; i++) {
                this.q[i].call();
            }
        };
    }

    /**
     * @param {HTMLElement} element
     * @param {String}      prop
     * @returns {String|Number}
     */
    function getComputedStyle(element, prop) {
        if (element.currentStyle) {
            return element.currentStyle[prop];
        } else if (window.getComputedStyle) {
            return window.getComputedStyle(element, null).getPropertyValue(prop);
        } else {
            return element.style[prop];
        }
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {Function}    resized
     */
    function attachResizeEvent(element, resized) {
        if (!element.resizedAttached) {
            element.resizedAttached = new EventQueue();
            element.resizedAttached.add(resized);
        } else if (element.resizedAttached) {
            element.resizedAttached.add(resized);
            return;
        }

        element.resizeSensor = document.createElement('div');
        element.resizeSensor.className = 'resize-sensor';
        var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: scroll; z-index: -1; visibility: hidden;';
        var styleChild = 'position: absolute; left: 0; top: 0;';

        element.resizeSensor.style.cssText = style;
        element.resizeSensor.innerHTML =
            '<div class="resize-sensor-expand" style="' + style + '">' +
            '<div style="' + styleChild + '"></div>' +
            '</div>' +
            '<div class="resize-sensor-shrink" style="' + style + '">' +
            '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' +
            '</div>';
        element.appendChild(element.resizeSensor);

        if (!{fixed: 1, absolute: 1}[getComputedStyle(element, 'position')]) {
            element.style.position = 'relative';
        }

        var expand = element.resizeSensor.childNodes[0];
        var expandChild = expand.childNodes[0];
        var shrink = element.resizeSensor.childNodes[1];
        var shrinkChild = shrink.childNodes[0];

        var lastWidth, lastHeight;

        var reset = function() {
            expandChild.style.width = expand.offsetWidth + 10 + 'px';
            expandChild.style.height = expand.offsetHeight + 10 + 'px';
            expand.scrollLeft = expand.scrollWidth;
            expand.scrollTop = expand.scrollHeight;
            shrink.scrollLeft = shrink.scrollWidth;
            shrink.scrollTop = shrink.scrollHeight;
            lastWidth = element.offsetWidth;
            lastHeight = element.offsetHeight;
        };

        reset();

        var changed = function() {
            if (element.resizedAttached) {
                element.resizedAttached.call();
            }
        };

        var addEvent = function(el, name, cb) {
            if (el.attachEvent) {
                el.attachEvent('on' + name, cb);
            } else {
                el.addEventListener(name, cb);
            }
        };

        addEvent(expand, 'scroll', function() {
            if (element.offsetWidth > lastWidth || element.offsetHeight > lastHeight) {
                changed();
            }
            reset();
        });

        addEvent(shrink, 'scroll',function() {
            if (element.offsetWidth < lastWidth || element.offsetHeight < lastHeight) {
                changed();
            }
            reset();
        });
    }

    if ("[object Array]" === Object.prototype.toString.call(element)
        || ('undefined' !== typeof jQuery && element instanceof jQuery) //jquery
        || ('undefined' !== typeof Elements && element instanceof Elements) //mootools
    ) {
        var i = 0, j = element.length;
        for (; i < j; i++) {
            attachResizeEvent(element[i], callback);
        }
    } else {
        attachResizeEvent(element, callback);
    }

    this.detach = function() {
        ResizeSensor.detach(element);
    };
};

ResizeSensor.detach = function(element) {
    if (element.resizeSensor) {
        element.removeChild(element.resizeSensor);
        delete element.resizeSensor;
        delete element.resizedAttached;
    }
};

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
    console.log(data);
    addThread(data.id, data.title, data.poster, data.body, data.image, data.time, data.replies);
});

function isScrolled() {
    var node = $("#messages")[0];
    return (node.scrollTop + node.offsetHeight === node.scrollHeight);
}

function scrollBottom() {
    var objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
}
new ResizeSensor(jQuery('#messages'), function() {
    scrollBottom();
});
socket.on("chat message", function(data) {
    var toScroll = isScrolled();
    var sender = data.sender;
    var message = data.message;
    var messagehtml = '<li class="' + sender + ' msgtxt"><p class="msg"><b>' + sender + ':</b> ' + message + '</p></li>';
    $("#messages").append(messagehtml);
    if (toScroll){
        scrollBottom();
    }
    $("." + localUser + ".msgtxt:not(.you)").addClass("you");
});
socket.on("chat image", function(data) {
    var toScroll = isScrolled();
    var sender = data.sender;
    var image64 = data.message;
    var messagehtml = '<li class="' + sender + ' msgtxt"><p class="msg"><b>' + sender + ':</b> <img src="' + image64 + '"></p></li>';
    $("#messages").append(messagehtml);
    if (toScroll){
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
    if (toScroll){
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
