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

    httpClient.post(xml, function(response) {
        console.log(response);
        callback();
    });
};

AuthNetArb.prototype.getSubscriptionStatus = function(refId, subscriptionId, callback) {
    var xml = xmlBuilder.buildGetSubscriptionStatusXml({
            merchantAuthentication: getAuth(this),
            refId: refId,
            subscriptionId: subscriptionId
        });

    httpClient.post(xml, function(response) {
        console.log(response);
        callback();
    });
};

var getAuth = function(authNetArb) {
    return {
            name: authNetArb.loginName,
            transactionKey: authNetArb.transactionKey
        };
};

module.exports = {
    AuthNetArb: AuthNetArb
};
