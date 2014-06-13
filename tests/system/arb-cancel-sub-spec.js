require("should");

var credentials = require("./credentials");
var arb = require("../../lib/arb")(credentials.loginName, credentials.transactionKey);

describe("arb.cancelSubscription", function() {
    it("should get status", function(done) {
        arb.cancelSubscription({ refId: "my-ref", subscriptionId: "21104510" }, function(error, response) {
            if (error) {
                console.log(JSON.stringify(error));
            }

            (typeof error === "undefined").should.be.true;

            console.log(JSON.stringify(response));

            done();
        });
    });
});
