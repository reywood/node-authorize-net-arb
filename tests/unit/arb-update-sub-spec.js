require("should");

var fakeHttps = require("./fake-https");
var responses = require("./responses");
var arbClient = require("../../lib/arb").client("my-login-name", "my-transaction-key");

var request = {
        refId: "my-ref",
        subscriptionId: "1234567890",
        subscription: {
            name: "my-subscription",
            paymentSchedule: {
                startDate: "2015-01-31",
                totalOccurrences: 9999,
                trialOccurrences: 1
            },
            amount: 19.99,
            trialAmount: 0,
            payment: {
                creditCard: {
                    cardNumber: "4111111111111111",
                    expirationDate: "2020-01",
                    cardCode: "111"
                }
            },
            customer: {
                id: "abc123"
            },
            billTo: {
                firstName: "Jane",
                lastName: "Doe"
            },
            shipTo: {
                address: "123 Main St"
            }
        }
    };

describe("arb.client.updateSubscription", function() {
    it("should serialize an update subscription request", function() {
        arbClient.updateSubscription(request);

        fakeHttps.getDataWrittenInLastRequest().should.equal(
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<ARBUpdateSubscriptionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">' +
                '<merchantAuthentication>' +
                    '<name>my-login-name</name>' +
                    '<transactionKey>my-transaction-key</transactionKey>' +
                '</merchantAuthentication>' +
                '<refId>my-ref</refId>' +
                '<subscriptionId>1234567890</subscriptionId>' +
                '<subscription>' +
                    '<name>my-subscription</name>' +
                    '<paymentSchedule>' +
                        '<startDate>2015-01-31</startDate>' +
                        '<totalOccurrences>9999</totalOccurrences>' +
                        '<trialOccurrences>1</trialOccurrences>' +
                    '</paymentSchedule>' +
                    '<amount>19.99</amount>' +
                    '<trialAmount>0</trialAmount>' +
                    '<payment>' +
                        '<creditCard>' +
                            '<cardNumber>4111111111111111</cardNumber>' +
                            '<expirationDate>2020-01</expirationDate>' +
                            '<cardCode>111</cardCode>' +
                        '</creditCard>' +
                    '</payment>' +
                    '<customer><id>abc123</id></customer>' +
                    '<billTo>' +
                        '<firstName>Jane</firstName>' +
                        '<lastName>Doe</lastName>' +
                    '</billTo>' +
                    '<shipTo>' +
                        '<address>123 Main St</address>' +
                    '</shipTo>' +
                '</subscription>' +
            '</ARBUpdateSubscriptionRequest>');
    });

    it("should send a request to update a subscription", function(done) {
        fakeHttps.addResponseData(responses.updateSubSuccess);

        arbClient.updateSubscription(request, function(error, response) {
            (typeof error === "undefined").should.be.true;

            response.refId.should.equal("my-ref");

            done();
        });
    });

    it("should return an error if method specific Authorize.net failure response is received", function(done) {
        fakeHttps.addResponseData(responses.updateSubError);

        arbClient.updateSubscription(request, function(error, response) {
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

        arbClient.updateSubscription(request, function(error, response) {
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

        arbClient.updateSubscription(request, function(error, response) {
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

        arbClient.updateSubscription(request, function(error, response) {
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

        arbClient.updateSubscription(request, function(error, response) {
            (typeof error === "undefined").should.be.false;
            (typeof response === "undefined").should.be.true;

            error.refId.should.equal("my-ref");
            error.source.should.equal("https");
            error.message.should.equal("An HTTP error occurred");

            done();
        });
    });
});
