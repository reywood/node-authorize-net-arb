var fakeHttps = require("./fake-https");

var arb = require("../../lib/arb").client("my-login-name", "my-transaction-key");
var responses = require("./responses");

var basicSubscription = {
        refId: "my-ref",
        subscriptionId: "1234567890",
        name: "my-subscription",
        paymentSchedule: {
            startDate: "2015-01-31",
            totalOccurrences: 9999
        },
        amount: 19.99,
        payment: {
            creditCard: {
                cardNumber: "4111111111111111",
                expirationDate: "2020-01",
                cardCode: "111"
            }
        }
    };

describe("arb.updateSubscription", function() {
    it("should send a request to update a subscription", function(done) {
        fakeHttps.addResponseData(responses.updateSubSuccess);

        arb.updateSubscription(basicSubscription, function(error, response) {
            (typeof error === "undefined").should.be.true;

            response.refId.should.equal("my-ref");

            done();
        });
    });

    it("should return an error if method specific Authorize.net failure response is received", function(done) {
        fakeHttps.addResponseData(responses.updateSubError);

        arb.updateSubscription(basicSubscription, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("auth-net");
            error.code.should.equal("E00017");
            error.message.should.equal("Start Date must not occur before the submission date.");

            done();
        });
    });

    it("should return an error if a general Authorize.net failure response is received", function(done) {
        fakeHttps.addResponseData(responses.generalError);

        arb.updateSubscription(basicSubscription, function(error, response) {
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

        arb.updateSubscription(basicSubscription, function(error, response) {
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

        arb.updateSubscription(basicSubscription, function(error, response) {
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

        arb.updateSubscription(basicSubscription, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("https");
            error.message.should.equal("An HTTP error occurred");

            done();
        });
    });
});
