require("should");

var credentials = require("./credentials");
var arb = require("../../lib/arb")(credentials.loginName, credentials.transactionKey);

describe("arb.getSubscriptionStatus", function() {
    it("should get status", function(done) {
        arb.getSubscriptionStatus({ refId: "my-ref", subscriptionId: "2109340800" }, function(error, response) {
            (typeof error === "undefined").should.be.true;

            response.status.length.should.be.greaterThan(0);

            done();
        });
    });
});
