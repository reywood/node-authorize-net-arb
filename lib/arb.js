var httpClient = require("./http_client.js");
var xmlBuilder = require("./xml_builder.js");

AuthNetArb = function(loginName, transactionKey) {
    this.loginName = loginName;
    this.transactionKey = transactionKey;
};

AuthNetArb.prototype.createSubscription = function(refId, subscription, callback) {
    var xml = xmlBuilder.buildCreateSubscriptionXml({
            merchantAuthentication: {
                name: this.loginName,
                transactionKey: this.transactionKey
            },
            refId: refId,
            subscription: subscription
        });

    httpClient.post(xml, function(response) {
        console.log(response);
        callback();
    });
};

module.exports = {
    AuthNetArb: AuthNetArb
};
