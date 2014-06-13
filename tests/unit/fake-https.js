var https = require("https");
var responseData = [];
var throwErrorOnNextRequest = false;
var lastHostUsed;

https.request = function(options, callback) {
    lastHostUsed = options.host;
    return new FakeRequest(callback);
};


var FakeRequest = function(callback) {
    this.callback = callback;
    this.eventHandlers = {};
};

FakeRequest.prototype.on = function(event, handler) {
    this.eventHandlers[event] = handler;
};

FakeRequest.prototype.write = function(data) {
    this.dataWritten = data;
};

FakeRequest.prototype.end = function() {
    if (throwErrorOnNextRequest) {
        throwErrorOnNextRequest = false;
        if (this.eventHandlers["error"]) {
            this.eventHandlers["error"]({ message: "An HTTP error occurred" });
        }
        return;
    }

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
    },
    throwErrorOnNextRequest: function() {
        throwErrorOnNextRequest = true;
    },
    getHostUsedInLastRequest: function() {
        return lastHostUsed;
    }
};
