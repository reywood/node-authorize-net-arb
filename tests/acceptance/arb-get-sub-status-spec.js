require("should");

var credentials = require("./credentials");
var arb = require("../../lib/arb")(credentials.loginName, credentials.transactionKey);

describe("AuthNetArb.getSubscriptionStatus", function() {
    it("should get status", function(done) {
        arb.getSubscriptionStatus({ refId: "my-ref", subscriptionId: "21093408" }, function(error, response) {
            (typeof error === "undefined").should.be.true;

            done();
        });
    })
});
