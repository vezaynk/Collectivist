var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var Crypto = require("crypto");
var escape = require('escape-html');
var cookieParser = require('cookie-parser')
var cookieParser2 = require('socket.io-cookie');
var bodyParser = require('body-parser')
io.use(cookieParser2);

String.prototype.hashCode = function() {
    var hash = 0,
        i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
};

Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
        return false;
    }
    var n = parseInt(arguments[1], 10) || 0;
    var k;
    if (n >= 0) {
        k = n;
    } else {
        k = len + n;
        if (k < 0) {
            k = 0;
        }
    }
    var currentElement;
    while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement ||
            (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
            return true;
        }
        k++;
    }
    return false;
};

function sortJSON(data, key) {
    return data.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

var tokens = [];

function logout(token) {
    console.log("Destroying token:", token);
    console.log("De-auth", tokens[token]);
    delete tokens[token];
}
app.use(bodyParser.json({
    limit: '10mb'
})); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    limit: '10mb',
    extended: true
}));

app.use(cookieParser());

function newToken() {
    return Crypto.randomBytes(8).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
}

function loggedIn(token) {
    if (tokens[token] == undefined) {
        return false;
    } else {
        return tokens[token];
    }
}
app.get('/', function(req, res) {
    if (!loggedIn(req.cookies.token)) {
        //debugging shit
        console.log(__dirname + '/login.html');
        res.sendFile(__dirname + '/login.html');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});
app.post('/auth', function(req, res) {
    var username = req.body.username;
    var password = req.body.password.hashCode();
    console.log("Attempted authentication:", username, "********")
    var token = newToken();
    var data = fs.readFileSync(__dirname + "/users/" + username + ".json");
    var json = JSON.parse(data);
    if (json.password == password) {
        res.cookie("token", token);
        res.cookie("localUser", req.body.username);
        tokens[token] = username;
        console.log("User", username, "is authenticated under the token", token);
    } else {
        console.log("User auth for", username, "has failed. Token is destroyed.");
    }
    res.writeHead(302, {
        'Location': '/'
    });
    res.end();
});

//Scripts and CSS
app.get('/static/:file', function(req, res) {
    res.sendFile(__dirname + '/ressources/' + req.params.file);
});

app.get("/logout", function(req, res) {
    logout(req.cookies.token);
    res.sendFile(__dirname + '/login.html');
});
app.get("/msglog", function(req, res) {
    if (!loggedIn(req.cookies.token)) {
        res.sendFile(__dirname + '/login.html');
    } else {
        res.sendFile(__dirname + '/msglog.html');
    }
});
//Threads
app.get('/threads/:threadid', function(req, res) {
    if (!loggedIn(req.cookies.token)) {
        res.sendFile(__dirname + '/login.html');
    } else {
        if (req.params.threadid == "list.json") {
            fs.readdir(__dirname + "/threads/", function(err, files) {
                if (err) return;
                var tmp = [];
                files.forEach(function(f) {
                    var contents = fs.readFileSync(__dirname + "/threads/" + f, 'utf8');
                    var topush = JSON.parse(contents);
                    tmp.push(topush);
                });
                res.send(sortJSON(tmp, 'points'));
            });
        } else {
            console.log("Requesting file", __dirname + '/threads/' + req.params.threadid);
            res.sendFile(__dirname + '/threads/' + req.params.threadid);
        }
    }

});

//Actions
app.post('/action/:action', function(req, res) {
    if (!loggedIn(req.cookies.token)) {
        res.sendFile(__dirname + '/login.html');
    } else {
        res.send("Sent");
        var action = req.params.action;
        /* Authen
        var user = req.cookies.user;
        var key = req.cookies.key;
        */
        switch (action) {
            case "post":
                console.log("New Post");

                //Create object
                var postObject = {
                    id: newToken(),
                    title: escape(req.body.title),
                    poster: escape(loggedIn(req.cookies.token)),
                    body: escape(req.body.body),
                    image: escape(req.body.image),
                    time: Date.now(),
                    points: Date.now(),
                    replies: []
                };
                console.log(postObject);
                console.log("Writing file", __dirname + '/threads/' + postObject.id);
                fs.writeFile(__dirname +  '/threads/' + postObject.id + ".json", json, function(err) {

                    if (err) throw err;

                    console.log('New Thread');
                    io.sockets.emit('thread new', postObject);
                });
                break;

            case "image":

                var msg = {
                    sender: loggedIn(req.cookies.token),
                    message: req.body.image
                }
                io.emit('chat image', msg);

                var messagehtml = '<li class="' + msg.sender + ' msgtxt"><p class="msg"><b>' + msg.sender + ':</b> <img src="' + msg.message + '"></p></li>';
                fs.appendFile(__dirname + '/msglog.html', messagehtml, function(err) {

                });
                console.log(msg);
                console.log(msg.sender + " has sent an image");
                break;
            case "reply":

                //Create object
                var postObject = {
                    id: escape(req.body.threadid),
                    title: escape(req.body.title),
                    poster: escape(loggedIn(req.cookies.token)),
                    body: escape(req.body.body),
                    image: escape(req.body.image),
                    time: Date.now()
                };
                var current = fs.readFileSync(__dirname + "/threads/" + postObject.id + ".json")
                var thread = JSON.parse(current);
                thread.points += 20000;
                var reply = postObject;
                thread.replies.push(reply);
                var json = JSON.stringify(thread);
                fs.writeFile(__dirname + '/threads/' + postObject.id + ".json", json, function(err) {

                    if (err) throw err;

                    console.log('New REply');
                    io.sockets.emit('reply new', postObject);
                });
                break;
        }
    }

});
var clients = [];
Array.prototype.getUnique = function() {
    var u = {},
        a = [];
    for (var i = 0, l = this.length; i < l; ++i) {
        if (u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}

function onlineList() {
    var arr = clients.getUnique();
    return arr.toString();
}

function isOnline(id) {
    console.log(id, clients.includes(id));
    return clients.includes(id);
}

function removeUser(id) {
    var lock = false;
    clients.forEach(function(v, i, a) {
        if (v == id) {
            if (!lock) {
                delete clients[i];
                lock = true;
            }

        }
    });
    //clean up
    clients = clients.filter(function(n) {
        return n != undefined
    });
    console.log(clients);
}
io.on('connection', function(socket) {
    var username = loggedIn(socket.request.headers.cookie.token);
    if (!username) {
        socket.disconnect();
    } else {
        socket.username = username;
        if (!isOnline(socket.username)) {
            io.emit("chat status", {
                sender: socket.username,
                message: "has connected"
            });
            console.log(socket.username + " has connected");
            var messagehtml = '<li class="msgnotif"><p class="msg"><b>' + socket.username + '</b> ' + "has connected" + '</p></li>';
            //fs.appendFile('msglog.html', messagehtml, function(err) {});
        }

        clients.push(socket.username);
    }

    socket.on('chat message', function(data) {
        if (data != "") {
            var msg = {
                sender: socket.username,
                message: escape(data)
            }
            io.emit('chat message', msg);
            console.log(msg.sender + ": " + msg.message);
            if (msg.message == "!online") {
                io.emit('chat message', {
                    sender: "slava",
                    message: onlineList()
                });
            }
            var messagehtml = '<li class="' + msg.sender + ' msgtxt"><p class="msg"><b>' + msg.sender + ':</b> ' + msg.message + '</p></li>';
            fs.appendFile(__dirname + '/msglog.html', messagehtml, function(err) {

            });


        }

    });
    socket.on('disconnect', function() {
        removeUser(socket.username);
        if (!isOnline(socket.username)) {
            io.emit("chat status", {
                sender: socket.username,
                message: "has disconnected"
            });
            console.log(socket.username + " has disconnected");
            var messagehtml = '<li class="msgnotif"><p class="msg"><b>' + socket.username + '</b> ' + "has disconnected" + '</p></li>';
            //fs.appendFile('msglog.html', messagehtml, function(err) {});
        }


    });
});

http.listen(process.env.PORT || 3000, function() {
    console.log("Listening");
});
