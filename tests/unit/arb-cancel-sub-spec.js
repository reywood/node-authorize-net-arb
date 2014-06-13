var fakeHttps = require("./fake-https");

var arb = require("../../lib/arb")("my-login-name", "my-transaction-key");
var responses = require("./responses");

var request = {
    refId: "my-ref",
    subscriptionId: "1234567890"
};

describe("arb.cancelSubscription", function() {
    it("should send a request to cancel a subscription", function(done) {
        fakeHttps.addResponseData(responses.cancelSubSuccess);

        arb.cancelSubscription(request, function(error, response) {
            (typeof error === "undefined").should.be.true;

            response.refId.should.equal("my-ref");

            done();
        });
    });

    it("should return an error if method specific Authorize.net failure response is received", function(done) {
        fakeHttps.addResponseData(responses.cancelSubError);

        arb.cancelSubscription(request, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("auth-net");
            error.code.should.equal("E00035");
            error.message.should.equal("The subscription cannot be found.");

            done();
        });
    });

    it("should return an error if a general Authorize.net failure response is received", function(done) {
        fakeHttps.addResponseData(responses.generalError);

        arb.cancelSubscription(request, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("auth-net");
            error.code.should.equal("E00003");
            error.message.should.equal("Error detail text");

            done();
        });
    });

    it("should return an error if unexpected (but valid) XML is received", function(done) {
        fakeHttps.addResponseData("<unexpected></unexpected>");

        arb.cancelSubscription(request, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("auth-net");
            error.message.should.equal("Unexpected XML response received");

            done();
        });
    });

    it("should return an error if invalid XML is received", function(done) {
        fakeHttps.addResponseData("<invalid");

        arb.cancelSubscription(request, function(error, response) {
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

        arb.cancelSubscription(request, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("https");
            error.message.should.equal("An HTTP error occurred");

            done();
        });
    });
});
