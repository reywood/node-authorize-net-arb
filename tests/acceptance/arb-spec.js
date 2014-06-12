require("should");
require("./fake-https");

var AuthNetArb = require("../../lib/arb").AuthNetArb;
var credentials = require("./credentials");

describe("AuthNetArb", function() {
    // describe(".createSubscription", function() {
    //     it("should send a request", function(done) {
    //         var arb = new AuthNetArb(credentials.loginName, credentials.transactionKey);
    //         var subscription = {
    //             name: "my-subscription",
    //             paymentSchedule: {
    //                 interval: {
    //                     length: 1,
    //                     unit: "months"
    //                 },
    //                 startDate: "2015-01-31",
    //                 totalOccurrences: 9999,
    //                 trialOccurrences: 1
    //             },
    //             amount: 19.99,
    //             trialAmount: 0,
    //             payment: {
    //                 creditCard: {
    //                     cardNumber: "4111111111111111",
    //                     expirationDate: "2020-01",
    //                     cardCode: "111"
    //                 }
    //             },
    //             customer: {
    //                 id: "abc123"
    //             },
    //             billTo: {
    //                 firstName: "Jane",
    //                 lastName: "Doe"
    //             },
    //             shipTo: {
    //                 address: "123 Main St"
    //             }
    //         };

    //         arb.createSubscription("my-ref", subscription, function() {
    //             done();
    //         });
    //     });
    // });

    describe(".getSubscriptionStatus", function() {
        it("should get status", function(done) {
            var arb = new AuthNetArb(credentials.loginName, credentials.transactionKey);
            arb.getSubscriptionStatus("my-ref", "21093408", function() {
                done();
            });
        })
    });
});
