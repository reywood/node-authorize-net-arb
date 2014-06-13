require("should");

var xmlBuilder = require("../../lib/xml-builder");

describe("xmlBuilder.buildUpdateSubscriptionXml", function() {
    it("should serialize an update subscription request", function() {
        var xml = xmlBuilder.buildUpdateSubscriptionXml({
            merchantAuthentication: {
                name: "my-login-name",
                transactionKey: "my-tx-key"
            },
            refId: "my-ref-id",
            subscriptionId: "123456",
            subscription: {
                name: "my-subscription",
                paymentSchedule: {
                    startDate: "2014-01-31",
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
        });

        xml.should.equal(
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<ARBUpdateSubscriptionRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">' +
                '<merchantAuthentication>' +
                    '<name>my-login-name</name>' +
                    '<transactionKey>my-tx-key</transactionKey>' +
                '</merchantAuthentication>' +
                '<refId>my-ref-id</refId>' +
                '<subscriptionId>123456</subscriptionId>' +
                '<subscription>' +
                    '<name>my-subscription</name>' +
                    '<paymentSchedule>' +
                        '<startDate>2014-01-31</startDate>' +
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
});
