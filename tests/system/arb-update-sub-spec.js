require("should");

var credentials = require("./credentials");
var arb = require("../../lib/arb")(credentials.loginName, credentials.transactionKey);

describe("arb.updateSubscription", function() {
    it("should update a subscription", function(done) {
        var subscription = {
            refId: "my-ref",
            subscriptionId: "21104510",
            name: "test-subscription",
            paymentSchedule: {
                startDate: "2015-03-31",
                totalOccurrences: 9999,
                trialOccurrences: 2
            },
            amount: 0.01,
            trialAmount: 0,
            payment: {
                creditCard: {
                    cardNumber: "4111111111111111",
                    expirationDate: "2020-06",
                    cardCode: "111"
                }
            },
            customer: {
                id: "abc123"
            },
            billTo: {
                firstName: "John",
                lastName: "Public"
            },
            shipTo: {
                address: "999 Pennsylvania Ave"
            }
        };

        arb.updateSubscription(subscription, function(error, response) {
            if (error) {
                console.log(JSON.stringify(error));
            }

            (typeof error === "undefined").should.be.true;

            console.log(JSON.stringify(response));

            done();
        });
    });
});

