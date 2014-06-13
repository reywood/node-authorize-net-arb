require("should");

var fakeHttps = require("./fake-https");
var responses = require("./responses");
var httpClient = require("../../lib/http-client");
var arb = require("../../lib/arb");

describe("arb.useSandbox", function() {
    it("should cause requests to go to sandbox host", function(done) {
        arb.useSandbox();

        fakeHttps.addResponseData(responses.getSubStatusSuccess);

        var arbClient = arb.client("my-login-name", "my-transaction-key");

        arbClient.getSubscriptionStatus({ subscriptionId: "1234567890" }, function() {
            fakeHttps.getHostUsedInLastRequest().should.equal(httpClient.sandboxHost);

            done();
        });
    });
});
