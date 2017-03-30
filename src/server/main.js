var Hapi = require("hapi");
var Inert = require("inert");
var Path = require("path");
var Good = require("good");
var Yar = require("yar");
var MySync = require("./sync.js");
var MyAuth = require("./auth.js");


var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, "..", "..")
            }
        }
    }
});

server.connection({
    host: "localhost",
    port: "80"
});

server.register([{
    register: Inert
}, {
    register: Yar,
    options: {
        storeBlank: false,
        cookieOptions: {
            password: "jf3ia2oj*f9JG*H(QH3rjhwu\8hfdj8(Hh78feh8wh9h\f9H(FE*HW*eWGFUQ£kfhauw3oQ£*&£hr",
            isSecure: false
        }
    }
}, {
    register: Good,
    options: {
        reporters: {
            consoleLogger: [{
                module: "good-squeeze",
                name: "Squeeze",
                args: [{
                    log: "*",
                    response: "*"
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}], function (err) {
    if (err) throw err;

    server.start(function (err) {
        if (err) throw err;

        console.log("Server started at: " + server.info.uri);
    })

});



server.route([
    {
        method: "GET",
        path: "/",
        handler: {
            file: Path.join(__dirname, "index.html")
        }    
    }, {
        method: "GET",
        path: "/content/{filepath}",
        handler: function (request, reply) {
            reply.file(Path.join("src", "client", request.params.filepath))
        }
    }, {
        method: "GET",
        path: "/angular/{filepath}",
        handler: function (request, reply) {
            reply.file(Path.join("node_modules", "angular", request.params.filepath))
        }
    }, {
        method: "POST",
        path: "/sync",
        handler: MySync.sync
    }, {
        method: ["GET", "POST"],
        path: "/authed",
        handler: MyAuth.authed
    }
]);
