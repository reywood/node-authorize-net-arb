var fakeHttps = require("./fake-https");

var arb = require("../../lib/arb")("my-login-name", "my-transaction-key");
var responses = require("./responses");

var request = {
    refId: "my-ref",
    subscriptionId: "1234567890"
};


describe("arb.getSubscriptionStatus", function() {
    it("should send a request and return status on success", function(done) {
        fakeHttps.addResponseData(responses.getSubStatusSuccess);

        arb.getSubscriptionStatus(request, function(error, response) {
            (typeof error === "undefined").should.be.true;

            response.refId.should.equal("my-ref");
            response.status.should.equal("active");

            done();
        });
    });

    it("should return an error if method specific Authorize.net failure response is received", function(done) {
        fakeHttps.addResponseData(responses.getSubStatusError);

        arb.getSubscriptionStatus(request, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("auth-net");
            error.code.should.equal("E00035");
            error.message.should.equal("The subscription cannot be found.");

            done();
        });
    });

    it("should return an error if invalid XML is received", function(done) {
        fakeHttps.addResponseData("<invalid");

        arb.getSubscriptionStatus(request, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("xml");
            error.message.should.equal("Failed to parse XML response");

            done();
        });
    });

    it("should return an error if the http connection fails", function(done) {
        fakeHttps.throwErrorOnNextRequest();

        arb.getSubscriptionStatus(request, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("https");
            error.message.should.equal("An HTTP error occurred");

            done();
        });
    });
});
