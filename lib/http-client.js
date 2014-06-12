var https = require("https");

var host = "api.authorize.net"; // "apitest.authorize.net";
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
            callback(responseChunks.join(""));
        });
    });

    request.write(data);
    request.end();
};


module.exports = {
    post: post
};
