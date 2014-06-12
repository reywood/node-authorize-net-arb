var fakeHttps = require("./fake-https");

var AuthNetArb = require("../../lib/arb").AuthNetArb;
var responses = require("./responses");

var basicSubscription = {
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

describe("AuthNetArb", function() {
    describe(".createSubscription", function() {
        it("should send a request and return subscriptionId on success", function(done) {
            fakeHttps.addResponseData(responses.createSubSuccess);

            var arb = new AuthNetArb("my-login-name", "my-transaction-key");

            arb.createSubscription("my-ref", basicSubscription, function(response) {
                response.success.should.be.true;
                response.refId.should.equal("my-ref");
                response.subscriptionId.should.equal("1234567890");

                done();
            });
        });

        it("should return an error on failure", function(done) {
            fakeHttps.addResponseData(responses.createSubError);

            var arb = new AuthNetArb("my-login-name", "my-transaction-key");

            arb.createSubscription("my-ref", basicSubscription, function(response) {
                response.success.should.be.false;
                response.refId.should.equal("my-ref");
                response.code.should.equal("E00017");
                response.message.should.equal("Start Date must not occur before the submission date.");

                done();
            });
        });
    });
});
