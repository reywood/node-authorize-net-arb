# authorize-net-arb

[![Build Status](https://travis-ci.org/reywood/node-authorize-net-arb.svg?branch=master)](https://travis-ci.org/reywood/node-authorize-net-arb)

Authorize.net Automated Recurring Billing (ARB) support for nodejs. Check out [Authorize.net's ARB page](http://www.authorize.net/solutions/merchantsolutions/merchantservices/automatedrecurringbilling/) for more info about their service. You will need to be familiar with the [ARB XML API](http://developer.authorize.net/api/arb/) ([PDF](http://www.authorize.net/support/ARB_guide.pdf)) in order to know what fields are appropriate to use and when to use them.

## Usage

First off, you will need to create an ARB client object with your API login ID and transaction key.

```javascript
var arb = require("authorize-net-arb");
var arbClient = arb.client("my-api-login-id", "my-transaction-key");
```

You can also use ARB in [sandbox mode](https://developer.authorize.net/sandbox/). All requests will go to Authorize.net's sandbox server after this mode is enabled.

```javascript
var arb = require("authorize-net-arb");
arb.useSandbox();
```

### Methods

All methods take two parameters. The first is an object whose properties closely mirror the nodes of the "request" XML documents of each API call described in [Authorize.net's documentation](http://www.authorize.net/support/ARB_guide.pdf). The second is a callback that receives two parameters: an error object and a response object. If the operation was successful, the error parameter will have a value of `undefined`. The response parameter will contain any non-error related info returned by the API call.

This library makes no effort to make sure the values you specify in your request are well formed before sending it. You must adhere to the rules outlined in Authorize.net's documentation.

#### Create Subscription

```javascript
var arb = require("authorize-net-arb");
var arbClient = arb.client("my-api-login-id", "my-transaction-key");

var request = {
    refId: "my-ref",
    subscription: {
        name: "my-subscription",
        order: {
            invoiceNumber: "inv-0001",
            description: "My Subscription"
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
            firstName: "Jane",
            lastName: "Doe",
            address: "123 Main St",
            city: "Anytown",
            state: "CA",
            zip: "11111",
            country: "US"
        }
    }
};

arbClient.createSubscription(request, function(error, response) {
    if (error) {
        // handle error response
    } else {
        // handle success
    }
});
```

If the call succeeds, the `response` object will have the format:

```javascript
{
    refId: "my-ref",
    subscriptionId: "1234567890"
}
```


#### Update Subscription

```javascript
var arb = require("authorize-net-arb");
var arbClient = arb.client("my-api-login-id", "my-transaction-key");

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
            lastName: "Doe",
            address: "123 Main St"
        },
        shipTo: {
            firstName: "Jane",
            lastName: "Doe",
            address: "123 Main St"
        }
    }
};

arbClient.updateSubscription(request, function(error, response) {
    if (error) {
        // handle error response
    } else {
        // handle success
    }
});
```

If the call succeeds, the `response` object will have the format:

```javascript
{
    refId: "my-ref"
}
```


#### Get Subscription Status

```javascript
var arb = require("authorize-net-arb");
var arbClient = arb.client("my-api-login-id", "my-transaction-key");

var request = {
    refId: "my-ref",
    subscriptionId: "1234567890"
};

arbClient.getSubscriptionStatus(request, function(error, response) {
    if (error) {
        // handle error response
    } else {
        // handle success
    }
});
```

If the call succeeds, the `response` object will have the format:

```javascript
{
    refId: "my-ref",
    status: "active|expired|suspended|cancelled|terminated"
}
```


#### Cancel Subscription

```javascript
var arb = require("authorize-net-arb");
var arbClient = arb.client("my-api-login-id", "my-transaction-key");

var request = {
    refId: "my-ref",
    subscriptionId: "1234567890"
};

arbClient.cancelSubscription(request, function(error, response) {
    if (error) {
        // handle error response
    } else {
        // handle success
    }
});
```

If the call succeeds, the `response` object will have the format:

```javascript
{
    refId: "my-ref"
}
```


### Errors

Error objects returned by method calls will generally have `source`, `refId`, and `message` properties. If the error was returned by Authorize.net, it will usually have a `code` property as well. If an unexpected response was received from the API server, a `response` property with the entire response text should be present.
