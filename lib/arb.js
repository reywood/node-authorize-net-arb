var _ = require("underscore");
var xml2js = require("xml2js");

var httpClient = require("./http-client.js");
var xmlBuilder = require("./xml-builder.js");
var _undefined;

ArbClient = function(loginName, transactionKey) {
    this.loginName = loginName;
    this.transactionKey = transactionKey;
};

ArbClient.prototype.createSubscription = function(request, callback) {
    request.merchantAuthentication = getAuth(this);

    var xml = xmlBuilder.buildCreateSubscriptionXml(request);

    this._makeRequest(
        request.refId,
        xml,
        "ARBCreateSubscriptionResponse",
        function(response) {
            return {
                refId: response.refId,
                subscriptionId: response.subscriptionId
            };
        },
        callback
    );
};

ArbClient.prototype.getSubscriptionStatus = function(request, callback) {
    request.merchantAuthentication = getAuth(this);

    var xml = xmlBuilder.buildGetSubscriptionStatusXml(request);

    this._makeRequest(
        request.refId,
        xml,
        "ARBGetSubscriptionStatusResponse",
        function(response) {
            return {
                refId: response.refId,
                status: response.status
            };
        },
        callback
    );
};

ArbClient.prototype.updateSubscription = function(request, callback) {
    request.merchantAuthentication = getAuth(this);

    var xml = xmlBuilder.buildUpdateSubscriptionXml(request);

    this._makeRequest(
        request.refId,
        xml,
        "ARBUpdateSubscriptionResponse",
        function(response) {
            return {
                refId: response.refId
            };
        },
        callback
    );
};

ArbClient.prototype.cancelSubscription = function(request, callback) {
    request.merchantAuthentication = getAuth(this);

    var xml = xmlBuilder.buildCancelSubscriptionXml(request);

    this._makeRequest(
        request.refId,
        xml,
        "ARBCancelSubscriptionResponse",
        function(response) {
            return {
                refId: response.refId
            };
        },
        callback
    );
};

ArbClient.prototype._makeRequest = function(refId, xml, rootXmlElementName, buildSuccessResponse, clientCallback) {
    clientCallback = clientCallback || function() { };

    httpClient.post(xml, function(httpError, responseXml) {
        if (httpError) {
            clientCallback(getHttpFailureMessage(refId, httpError));
            return;
        }

        parseXmlResponse(refId, responseXml, rootXmlElementName, function(xmlError, response) {
            if (xmlError) {
                clientCallback(xmlError);
            } else {
                clientCallback(_undefined, buildSuccessResponse(response));
            }
        });
    });
};


var getAuth = function(authNetArb) {
    return {
        name: authNetArb.loginName,
        transactionKey: authNetArb.transactionKey
    };
};

var parseXmlResponse = function(refId, responseXml, rootXmlElementName, callback) {
    xml2js.parseString(responseXml, { explicitArray: false }, function(error, response) {
        if (error) {
            callback(getXmlParseFailureMessage(refId, responseXml, error));
            return;
        }

        if (!response) {
            callback({ refId: refId, message: "No response received" });
            return;
        }

        if (response["ErrorResponse"]) {
            callback(getAuthNetErrorMessage(refId, response["ErrorResponse"]));
            return;
        }

        response = response[rootXmlElementName];

        if (!response) {
            callback(getUnexpectedResponseMessage(refId, responseXml));
            return;
        }

        if (!wasRequestSuccessful(response)) {
            callback(getAuthNetErrorMessage(refId, response));
            return;
        }

        callback(null, response);
    });
};

var wasRequestSuccessful = function(response) {
    return !!response.messages &&
           response.messages.resultCode.toUpperCase() === "OK";
};

var getHttpFailureMessage = function(refId, httpError) {
    var err = httpError;

    if (!(httpError instanceof Error)) {
        err = new Error(httpError);
    }

    return _.extend(err, { source: "http", refId: refId });
};

var getXmlParseFailureMessage = function(refId, responseXml, error) {
    var err = new Error("Failed to parse XML response");

    return _.extend(err, {
        source: "xml",
        refId: refId,
        detail: error,
        response: responseXml
    });
};

var getUnexpectedResponseMessage = function(refId, responseXml) {
    var err = new Error("Unexpected XML response received");

    return _.extend(err, {
        source: "xml",
        refId: refId,
        response: responseXml
    });
};

var getAuthNetErrorMessage = function(refId, response) {
    var authNetError = response.messages.message;
    var err = new Error(authNetError.text);

    return _.extend(err, {
        source: "auth-net",
        refId: response.refId || refId,
        code: authNetError.code
    });
};

module.exports = {
    client: function(loginName, transactionKey) {
        return new ArbClient(loginName, transactionKey);
    },
    useSandbox: function() {
        httpClient.useSandbox();
    }
};
