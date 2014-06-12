var https = require("https");
var responseData = [];

https.request = function(options, callback) {
    return new FakeRequest(callback);
};


var FakeRequest = function(callback) {
    this.callback = callback;
};

FakeRequest.prototype.write = function(data) {
    this.dataWritten = data;
};

FakeRequest.prototype.end = function() {
    var response = new FakeResponse();
    this.callback(response);

    if (response.eventHandlers["data"]) {
        while (responseData.length > 0) {
            response.eventHandlers["data"](responseData.shift());
        }
    }

    if (response.eventHandlers["end"]) {
        response.eventHandlers["end"]();
    }
};


var FakeResponse = function() {
    this.eventHandlers = {};
};

FakeResponse.prototype.setEncoding = function(encoding) {
    this.encoding = encoding;
};

FakeResponse.prototype.on = function(event, handler) {
    this.eventHandlers[event] = handler;
};


module.exports = {
    addResponseData: function(data) {
        responseData.push(data);
    }
};
