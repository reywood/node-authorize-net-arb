var _ = require("underscore");
var xml2js = require("xml2js");

var httpClient = require("./http-client.js");
var xmlBuilder = require("./xml-builder.js");
var _undefined;

AuthNetArb = function(loginName, transactionKey) {
    this.loginName = loginName;
    this.transactionKey = transactionKey;
};

AuthNetArb.prototype.createSubscription = function(subscription, callback) {
    var refId = subscription.refId;
    var xml = xmlBuilder.buildCreateSubscriptionXml({
            merchantAuthentication: getAuth(this),
            refId: refId,
            subscription: subscription
        });

    this._sendReceiveAndParse(refId, xml, "ARBCreateSubscriptionResponse", function(error, response) {
        if (error) {
            callback(error);
        } else {
            callback(_undefined, {
                refId: getResponseRefId(response),
                subscriptionId: response.subscriptionId[0]
            });
        }
    });
};

AuthNetArb.prototype.getSubscriptionStatus = function(refId, subscriptionId, callback) {
    var xml = xmlBuilder.buildGetSubscriptionStatusXml({
            merchantAuthentication: getAuth(this),
            refId: refId,
            subscriptionId: subscriptionId
        });

    httpClient.post(xml, function(error, responseXml) {
        console.log(responseXml);
        callback();
    });
};

AuthNetArb.prototype._sendReceiveAndParse = function(refId, xml, rootXmlElementName, callback) {
    httpClient.post(xml, function(httpError, responseXml) {
        if (httpError) {
            callback(getHttpFailureMessage(refId, httpError));
            return;
        }

        parseXmlResponse(refId, responseXml, rootXmlElementName, function(xmlError, response) {
            if (xmlError) {
                callback(xmlError);
            } else {
                callback(_undefined, response);
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

        response = response[rootXmlElementName];

        if (!response) {
            callback(getUnexpectedResponseMessage(refId, responseXml));
            return;
        }

        if (!wasRequestSuccessful(response)) {
            callback(getAuthNetErrorMessage(response));
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

var getUnexpectedResponseMessage = function(responseXml) {
    return {
            source: "auth-net",
            refId: refId,
            message: "Unexpected response received",
            response: responseXml
        };
};

var getAuthNetErrorMessage = function(response) {
    var error = response.messages[0].message[0];
    return {
            source: "auth-net",
            refId: response.refId && response.refId[0],
            message: error.text[0],
            code: error.code[0]
        };
};

module.exports = function(loginName, transactionKey) {
    return new AuthNetArb(loginName, transactionKey);
};
