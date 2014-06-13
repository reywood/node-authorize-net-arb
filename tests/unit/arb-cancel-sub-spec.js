require("should");

var fakeHttps = require("./fake-https");
var responses = require("./responses");
var arbClient = require("../../lib/arb").client("my-login-name", "my-transaction-key");

var request = {
    refId: "my-ref",
    subscriptionId: "1234567890"
};

describe("arb.client.cancelSubscription", function() {
    it("should serialize a get subscription status request", function() {
        arbClient.cancelSubscription(request);

        fakeHttps.getDataWrittenInLastRequest().should.equal(
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<ARBCancelSubscriptionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">' +
                '<merchantAuthentication>' +
                    '<name>my-login-name</name>' +
                    '<transactionKey>my-transaction-key</transactionKey>' +
                '</merchantAuthentication>' +
                '<refId>my-ref</refId>' +
                '<subscriptionId>1234567890</subscriptionId>' +
            '</ARBCancelSubscriptionRequest>');
    });

    it("should send a request to cancel a subscription", function(done) {
        fakeHttps.addResponseData(responses.cancelSubSuccess);

        arbClient.cancelSubscription(request, function(error, response) {
            (typeof error === "undefined").should.be.true;

            response.refId.should.equal("my-ref");

            done();
        });
    });

    it("should return an error if method specific Authorize.net failure response is received", function(done) {
        fakeHttps.addResponseData(responses.cancelSubError);

        arbClient.cancelSubscription(request, function(error, response) {
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

        arbClient.cancelSubscription(request, function(error, response) {
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

        arbClient.cancelSubscription(request, function(error, response) {
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

        arbClient.cancelSubscription(request, function(error, response) {
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

        arbClient.cancelSubscription(request, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("https");
            error.message.should.equal("An HTTP error occurred");

            done();
        });
    });
});
