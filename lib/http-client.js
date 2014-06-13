var https = require("https");

var productionHost = "api.authorize.net";
var sandboxHost = "apitest.authorize.net";
var host = productionHost;
var path = "/xml/v1/request.api";

var post = function(data, callback) {
    var options = {
        host: host,
        path: path,
        method: "POST",
        headers: {
            "Content-Type": "text/xml",
            "Content-Length": data.length,
            "User-Agent": "node-authorize-net-arb"
        }
    };

    var request = https.request(options, function(response) {
        var responseChunks = [];

        response.setEncoding("utf8");

        response.on("data", function(chunk) {
            responseChunks.push(chunk);
        });

        response.on("end", function() {
            callback(null, responseChunks.join(""));
        });
    });

    request.on("error", function(error) {
        callback(error);
    });

    request.write(data);
    request.end();
};


module.exports = {
    post: post,

    sandboxHost: sandboxHost,

    useSandbox: function() {
        host = sandboxHost;
    }
};
