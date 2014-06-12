var xml2js = require("xml2js");

var httpClient = require("./http-client.js");
var xmlBuilder = require("./xml-builder.js");

AuthNetArb = function(loginName, transactionKey) {
    this.loginName = loginName;
    this.transactionKey = transactionKey;
};

AuthNetArb.prototype.createSubscription = function(refId, subscription, callback) {
    var xml = xmlBuilder.buildCreateSubscriptionXml({
            merchantAuthentication: getAuth(this),
            refId: refId,
            subscription: subscription
        });

    httpClient.post(xml, function(responseXml) {
        parseXmlResponse(responseXml, "ARBCreateSubscriptionResponse", function(error, response) {
            if (error) {
                callback(error);
                return;
            }

            callback({
                success: true,
                refId: getResponseRefId(response),
                subscriptionId: response.subscriptionId[0]
            });
        });
    });
};

AuthNetArb.prototype.getSubscriptionStatus = function(refId, subscriptionId, callback) {
    var xml = xmlBuilder.buildGetSubscriptionStatusXml({
            merchantAuthentication: getAuth(this),
            refId: refId,
            subscriptionId: subscriptionId
        });

    httpClient.post(xml, function(responseXml) {
        console.log(responseXml);
        callback();
    });
};


var getAuth = function(authNetArb) {
    return {
            name: authNetArb.loginName,
            transactionKey: authNetArb.transactionKey
        };
};

var parseXmlResponse = function(responseXml, topElementName, callback) {
    xml2js.parseString(responseXml, function(error, response) {
        if (error) {
            callback(getXmlParseFailureMessage(responseXml, error));
            return;
        }

        response = response[topElementName];

        if (!response) {
            callback(getUnexpectedResponseMessage(responseXml));
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

var getXmlParseFailureMessage = function(responseXml, error) {
    return {
            success: false,
            message: "Failed to parse XML response",
            detail: error,
            response: responseXml
        };
};

var getUnexpectedResponseMessage = function(responseXml) {
    return {
            success: false,
            message: "Unexpected response received",
            response: responseXml
        };
};

var getAuthNetErrorMessage = function(response) {
    var error = response.messages[0].message[0];
    return {
        success: false,
        refId: response.refId && response.refId[0],
        message: error.text[0],
        code: error.code[0]
    };
};

module.exports = {
    AuthNetArb: AuthNetArb
};
