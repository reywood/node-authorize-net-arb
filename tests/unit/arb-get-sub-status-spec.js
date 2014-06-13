var fakeHttps = require("./fake-https");

var arb = require("../../lib/arb")("my-login-name", "my-transaction-key");
var responses = require("./responses");


describe("arb.getSubscriptionStatus", function() {
    it("should send a request and return status on success", function(done) {
        fakeHttps.addResponseData(responses.getSubStatusSuccess);

        var request = {
            refId: "my-ref",
            subscriptionId: "1234567890"
        };

        arb.getSubscriptionStatus(request, function(error, response) {
            (typeof error === "undefined").should.be.true;

            response.refId.should.equal("my-ref");
            response.status.should.equal("active");

            done();
        });
    });
});
