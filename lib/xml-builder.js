var xml = require("xml");
var _ = require("underscore");

var buildCreateSubscriptionXml = function(options) {
    var xmlObjects = buildCreateSubscriptionXmlObjectArray(options);

    var request = {
        ARBCreateSubscriptionRequest: [
            { _attr: { xmlns: "AnetApi/xml/v1/schema/AnetApiSchema.xsd" } }
        ].concat(xmlObjects)
    };

    return xml(request, { declaration: { encoding: "utf-8" } });
};

var buildGetSubscriptionStatusXml = function(options) {
    var xmlObjects = buildXmlObjectArray(options, [
            "merchantAuthentication.name",
            "merchantAuthentication.transactionKey",
            "refId",
            "subscriptionId"
        ]);

    var request = {
        ARBGetSubscriptionStatusRequest: [
            { _attr: { xmlns: "AnetApi/xml/v1/schema/AnetApiSchema.xsd" } }
        ].concat(xmlObjects)
    };

    return xml(request, { declaration: { encoding: "utf-8" } });
};

var buildUpdateSubscriptionXml = function(options) {
    var xmlObjects = buildUpdateSubscriptionXmlObjectArray(options);

    var request = {
        ARBUpdateSubscriptionRequest: [
            { _attr: { xmlns: "AnetApi/xml/v1/schema/AnetApiSchema.xsd" } }
        ].concat(xmlObjects)
    };

    return xml(request, { declaration: { encoding: "utf-8" } });
};

var buildCancelSubscriptionXml = function(options) {
    var xmlObjects = buildXmlObjectArray(options, [
            "merchantAuthentication.name",
            "merchantAuthentication.transactionKey",
            "refId",
            "subscriptionId"
        ]);

    var request = {
        ARBCancelSubscriptionRequest: [
            { _attr: { xmlns: "AnetApi/xml/v1/schema/AnetApiSchema.xsd" } }
        ].concat(xmlObjects)
    };

    return xml(request, { declaration: { encoding: "utf-8" } });
};


var buildCreateSubscriptionXmlObjectArray = function(options) {
    return buildXmlObjectArray(options, [
            "merchantAuthentication.name",
            "merchantAuthentication.transactionKey",
            "refId",
            "subscription.name",
            "subscription.paymentSchedule.interval.length",
            "subscription.paymentSchedule.interval.unit",
            "subscription.paymentSchedule.startDate",
            "subscription.paymentSchedule.totalOccurrences",
            "subscription.paymentSchedule.trialOccurrences",
            "subscription.amount",
            "subscription.trialAmount",
            "subscription.payment.creditCard.cardNumber",
            "subscription.payment.creditCard.expirationDate",
            "subscription.payment.creditCard.cardCode",
            "subscription.payment.bankAccount.accountType",
            "subscription.payment.bankAccount.routingNumber",
            "subscription.payment.bankAccount.accountNumber",
            "subscription.payment.bankAccount.nameOnAccount",
            "subscription.payment.bankAccount.echeckType",
            "subscription.payment.bankAccount.bankName",
            "subscription.order.invoiceNumber",
            "subscription.order.description",
            "subscription.customer.id",
            "subscription.customer.email",
            "subscription.customer.phoneNumber",
            "subscription.customer.faxNumber",
            "subscription.billTo.firstName",
            "subscription.billTo.lastName",
            "subscription.billTo.company",
            "subscription.billTo.address",
            "subscription.billTo.city",
            "subscription.billTo.state",
            "subscription.billTo.zip",
            "subscription.billTo.country",
            "subscription.shipTo.firstName",
            "subscription.shipTo.lastName",
            "subscription.shipTo.company",
            "subscription.shipTo.address",
            "subscription.shipTo.city",
            "subscription.shipTo.state",
            "subscription.shipTo.zip",
            "subscription.shipTo.country"
        ]);
};

var buildUpdateSubscriptionXmlObjectArray = function(options) {
    return buildXmlObjectArray(options, [
            "merchantAuthentication.name",
            "merchantAuthentication.transactionKey",
            "refId",
            "subscriptionId",
            "subscription.name",
            "subscription.paymentSchedule.startDate",
            "subscription.paymentSchedule.totalOccurrences",
            "subscription.paymentSchedule.trialOccurrences",
            "subscription.amount",
            "subscription.trialAmount",
            "subscription.payment.creditCard.cardNumber",
            "subscription.payment.creditCard.expirationDate",
            "subscription.payment.creditCard.cardCode",
            "subscription.payment.bankAccount.accountType",
            "subscription.payment.bankAccount.routingNumber",
            "subscription.payment.bankAccount.accountNumber",
            "subscription.payment.bankAccount.nameOnAccount",
            "subscription.payment.bankAccount.echeckType",
            "subscription.payment.bankAccount.bankName",
            "subscription.order.invoiceNumber",
            "subscription.order.description",
            "subscription.customer.id",
            "subscription.customer.email",
            "subscription.customer.phoneNumber",
            "subscription.customer.faxNumber",
            "subscription.billTo.firstName",
            "subscription.billTo.lastName",
            "subscription.billTo.company",
            "subscription.billTo.address",
            "subscription.billTo.city",
            "subscription.billTo.state",
            "subscription.billTo.zip",
            "subscription.billTo.country",
            "subscription.shipTo.firstName",
            "subscription.shipTo.lastName",
            "subscription.shipTo.company",
            "subscription.shipTo.address",
            "subscription.shipTo.city",
            "subscription.shipTo.state",
            "subscription.shipTo.zip",
            "subscription.shipTo.country"
        ]);
};

var buildXmlObjectArray = function(obj, fieldPaths) {
    var xmlObjects = [];

    _.each(fieldPaths, function(fieldPath) {
        var value = getFieldValue(obj, fieldPath);

        if (typeof value !== "undefined") {
            appendFieldXmlObject(xmlObjects, fieldPath, value);
        }
    });

    return xmlObjects;
};

var getFieldValue = function(obj, fieldPath) {
    var parts = fieldPath.split(".");

    for (var i = 0; i < parts.length; i++) {
        if (!obj) { return; }
        obj = obj[parts[i]];
    }

    return obj;
};

var appendFieldXmlObject = function(xmlObjects, fieldPath, value) {
    if (fieldPath.indexOf(".") === -1) {
        xmlObjects.push(createXmlObject(fieldPath, value));
    } else {
        var fieldPathHead = fieldPath.substr(0, fieldPath.indexOf("."));
        var fieldPathTail = fieldPath.substr(fieldPathHead.length + 1);
        var headXmlObject = _.find(xmlObjects, function(elem) { return !!elem[fieldPathHead]; });
        if (typeof headXmlObject === "undefined") {
            headXmlObject = createXmlObject(fieldPathHead, []);
            xmlObjects.push(headXmlObject);
        }
        appendFieldXmlObject(headXmlObject[fieldPathHead], fieldPathTail, value);
    }
};

var createXmlObject = function(key, value) {
    var obj = {};
    obj[key] = value;
    return obj;
};

module.exports = {
    buildCancelSubscriptionXml: buildCancelSubscriptionXml,
    buildCreateSubscriptionXml: buildCreateSubscriptionXml,
    buildGetSubscriptionStatusXml: buildGetSubscriptionStatusXml,
    buildUpdateSubscriptionXml: buildUpdateSubscriptionXml
};
