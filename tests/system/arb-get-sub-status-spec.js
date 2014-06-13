require("should");

var credentials = require("./credentials");
var arb = require("../../lib/arb");
var client = arb.client(credentials.loginName, credentials.transactionKey);

arb.useSandbox();

describe("arb.client.getSubscriptionStatus", function() {
    it("should get status", function(done) {
        client.getSubscriptionStatus({ refId: "my-ref", subscriptionId: "2107121" }, function(error, response) {
            if (error) {
                console.log(JSON.stringify(error));
            }

            (typeof error === "undefined").should.be.true;

            console.log(JSON.stringify(response));

            done();
        });
    });
});
