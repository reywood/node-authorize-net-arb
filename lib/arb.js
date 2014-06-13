var _ = require("underscore");
var xml2js = require("xml2js");

var httpClient = require("./http-client.js");
var xmlBuilder = require("./xml-builder.js");
var _undefined;

AuthNetArb = function(loginName, transactionKey) {
    this.loginName = loginName;
    this.transactionKey = transactionKey;
};

AuthNetArb.prototype.createSubscription = function(request, callback) {
    var refId = request.refId;
    var xml = xmlBuilder.buildCreateSubscriptionXml({
            merchantAuthentication: getAuth(this),
            refId: refId,
            subscription: request
        });

    this._makeRequest(
        refId,
        xml,
        "ARBCreateSubscriptionResponse",
        function(response) {
            return {
                refId: getResponseRefId(response),
                subscriptionId: response.subscriptionId[0]
            };
        },
        callback
    );
};

AuthNetArb.prototype.getSubscriptionStatus = function(request, callback) {
    var refId = request.refId;
    var xml = xmlBuilder.buildGetSubscriptionStatusXml({
            merchantAuthentication: getAuth(this),
            refId: request.refId,
            subscriptionId: request.subscriptionId
        });

    this._makeRequest(
        refId,
        xml,
        "ARBGetSubscriptionStatusResponse",
        function(response) {
            return {
                refId: getResponseRefId(response),
                status: response.status[0]
            };
        },
        callback
    );
};

AuthNetArb.prototype.updateSubscription = function(request, callback) {
    var refId = request.refId;
    var xml = xmlBuilder.buildUpdateSubscriptionXml({
            merchantAuthentication: getAuth(this),
            refId: refId,
            subscriptionId: request.subscriptionId,
            subscription: request
        });

    this._makeRequest(
        refId,
        xml,
        "ARBUpdateSubscriptionResponse",
        function(response) {
            return {
                refId: getResponseRefId(response)
            };
        },
        callback
    );
};

AuthNetArb.prototype._makeRequest = function(refId, xml, rootXmlElementName, buildSuccessResponse, clientCallback) {
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
    xml2js.parseString(responseXml, function(error, response) {
        if (error) {
            callback(getXmlParseFailureMessage(refId, responseXml, error));
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
           response.messages.length > 0 &&
           !!response.messages[0].resultCode &&
           response.messages[0].resultCode.length > 0 &&
           response.messages[0].resultCode[0] === "Ok";
};

var getResponseRefId = function(response) {
    if (response.refId && response.refId.length > 0) {
        return response.refId[0];
    }
};

var getHttpFailureMessage = function(refId, httpError) {
    return _.extend({ source: "https", refId: refId }, httpError);
};

var getXmlParseFailureMessage = function(refId, responseXml, error) {
    return {
            source: "xml",
            refId: refId,
            message: "Failed to parse XML response",
            detail: error,
            response: responseXml
        };
};

var getUnexpectedResponseMessage = function(refId, responseXml) {
    return {
            source: "auth-net",
            refId: refId,
            message: "Unexpected XML response received",
            response: responseXml
        };
};

var getAuthNetErrorMessage = function(refId, response) {
    var error = response.messages[0].message[0];
    return {
            source: "auth-net",
            refId: response.refId && response.refId[0] || refId,
            message: error.text[0],
            code: error.code[0]
        };
};

module.exports = function(loginName, transactionKey) {
    return new AuthNetArb(loginName, transactionKey);
};
