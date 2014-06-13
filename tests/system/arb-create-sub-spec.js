require("should");

var credentials = require("./credentials");
var arb = require("../../lib/arb")(credentials.loginName, credentials.transactionKey);

describe("arb.createSubscription", function() {
    it("should create a subscription", function(done) {
        var subscription = {
            name: "test-subscription",
            paymentSchedule: {
                interval: {
                    length: 1,
                    unit: "months"
                },
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
        };

        arb.createSubscription(subscription, function(error, response) {
            (typeof error === "undefined").should.be.true;

            response.subscriptionId.length.should.be.greaterThan(0);

            done();
        });
    });
});

