var fakeHttps = require("./fake-https");

var arb = require("../../lib/arb")("my-login-name", "my-transaction-key");
var responses = require("./responses");

var basicSubscription = {
        refId: "my-ref",
        name: "my-subscription",
        paymentSchedule: {
            interval: {
                length: 1,
                unit: "months"
            },
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

describe("arb.createSubscription", function() {
    it("should send a request and return subscriptionId on success", function(done) {
        fakeHttps.addResponseData(responses.createSubSuccess);

        arb.createSubscription(basicSubscription, function(error, response) {
            (typeof error === "undefined").should.be.true;

            response.refId.should.equal("my-ref");
            response.subscriptionId.should.equal("1234567890");

            done();
        });
    });

    it("should return an error if Authorize.net failure response is received", function(done) {
        fakeHttps.addResponseData(responses.createSubError);

        arb.createSubscription(basicSubscription, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("auth-net");
            error.code.should.equal("E00017");
            error.message.should.equal("Start Date must not occur before the submission date.");

            done();
        });
    });

    it("should return an error if invalid XML is received", function(done) {
        fakeHttps.addResponseData("<invalid");

        arb.createSubscription(basicSubscription, function(error, response) {
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

        arb.createSubscription(basicSubscription, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("https");
            error.message.should.equal("An HTTP error occurred");

            done();
        });
    });
});
