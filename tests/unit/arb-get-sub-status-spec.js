require("should");

var fakeHttps = require("./fake-https");
var responses = require("./responses");
var arbClient = require("../../lib/arb").client("my-login-name", "my-transaction-key");

var request = {
    refId: "my-ref",
    subscriptionId: "1234567890"
};


describe("arb.client.getSubscriptionStatus", function() {
    it("should serialize a get subscription status request", function() {
        arbClient.getSubscriptionStatus(request);

        fakeHttps.getDataWrittenInLastRequest().should.equal(
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<ARBGetSubscriptionStatusRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">' +
                '<merchantAuthentication>' +
                    '<name>my-login-name</name>' +
                    '<transactionKey>my-transaction-key</transactionKey>' +
                '</merchantAuthentication>' +
                '<refId>my-ref</refId>' +
                '<subscriptionId>1234567890</subscriptionId>' +
            '</ARBGetSubscriptionStatusRequest>');
    });

    it("should send a request and return status on success", function(done) {
        fakeHttps.addResponseData(responses.getSubStatusSuccess);

        arbClient.getSubscriptionStatus(request, function(error, response) {
            (typeof error === "undefined").should.be.true;

            response.refId.should.equal("my-ref");
            response.status.should.equal("active");

            done();
        });
    });

    it("should return an error if method specific Authorize.net failure response is received", function(done) {
        fakeHttps.addResponseData(responses.getSubStatusError);

        arbClient.getSubscriptionStatus(request, function(error, response) {
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

        arbClient.getSubscriptionStatus(request, function(error, response) {
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

        arbClient.getSubscriptionStatus(request, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("http");
            error.message.should.equal("An HTTP error occurred");

            done();
        });
    });
});
