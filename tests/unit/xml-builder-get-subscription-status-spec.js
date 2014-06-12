require("should");

var xmlBuilder = require("../../lib/xml-builder");

describe("xmlBuilder.buildGetSubscriptionStatusXml", function() {
    it("should serialize a get subscription status request", function() {
        var xml = xmlBuilder.buildGetSubscriptionStatusXml({
            merchantAuthentication: {
                name: "my-login-name",
                transactionKey: "my-tx-key"
            },
            refId: "my-ref-id",
            subscriptionId: "123456"
        });

        xml.should.equal(
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<ARBGetSubscriptionStatusRequest xmlns="AnetApi/xml/v1/schema/AnetApiSchema.xsd">' +
                '<merchantAuthentication>' +
                    '<name>my-login-name</name>' +
                    '<transactionKey>my-tx-key</transactionKey>' +
                '</merchantAuthentication>' +
                '<refId>my-ref-id</refId>' +
                '<subscriptionId>123456</subscriptionId>' +
            '</ARBGetSubscriptionStatusRequest>');
    });
});
