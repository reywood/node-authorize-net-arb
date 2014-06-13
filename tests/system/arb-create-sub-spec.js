require("should");

var credentials = require("./credentials");
var arb = require("../../lib/arb");
var client = arb.client(credentials.loginName, credentials.transactionKey);

arb.useSandbox();

describe("arb.client.createSubscription", function() {
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
            amount: 0.01,
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

        client.createSubscription(subscription, function(error, response) {
            if (error) {
                console.log(JSON.stringify(error));
            }

            (typeof error === "undefined").should.be.true;

            console.log(JSON.stringify(response));

            done();
        });
    });
});

