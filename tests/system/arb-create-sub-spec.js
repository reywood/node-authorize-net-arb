require("should");

var credentials = require("./credentials");
var arb = require("../../lib/arb");
var client = arb.client(credentials.loginName, credentials.transactionKey);

arb.useSandbox();

describe("arb.client.createSubscription", function() {
    it("should create a subscription", function(done) {
        var request = {
            subscription: {
                name: "test-subscription",
                order: {
                    invoiceNumber: "inv-0001",
                    description: "Test subscription"
                },
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
                    id: "abc123",
                    email: "jane.doe@example.com",
                    phoneNumber: "555-555-5555",
                    faxNumber: "555-555-5555"
                },
                billTo: {
                    firstName: "Jane",
                    lastName: "Doe",
                    address: "123 Main St",
                    city: "Anytown",
                    state: "CA",
                    zip: "11111",
                    country: "US"
                },
                shipTo: {
                    address: "123 Main St"
                }
            }
        };

        client.createSubscription(request, function(error, response) {
            if (error) {
                console.log(JSON.stringify(error));
            }

            (typeof error === "undefined").should.be.true;

            console.log(JSON.stringify(response));

            done();
        });
    });
});

