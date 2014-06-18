## Running Tests

First off, make sure the grunt CLI and project dependencies are installed.

```sh
$ sudo npm install -g grunt-cli
$ npm install
```

To run unit tests, just execute grunt. The default task runs all unit tests.

```sh
$ grunt
```

To run system tests, you'll need to install the mocha CLI.

```sh
$ sudo npm install -g mocha
```

Then, create the file `tests/system/credentials.js` with your Authorize.net API login ID and transaction key. You'll probably want to use a sandbox account for this. The contents should resemble:

```javascript
module.exports = {
    loginName: "your-api-login-id",
    transactionKey: "your-transaction-key"
};
```

Use mocha to run individual tests.

```sh
$ mocha tests/system/arb-create-sub-spec.js
```
