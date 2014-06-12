var fs = require("fs");

var readOptions = { encoding: "utf8" };
var responseDir = __dirname + "/responses";

module.exports = {
    createSubSuccess: fs.readFileSync(responseDir + "/create-sub-success.xml", readOptions),
    createSubError: fs.readFileSync(responseDir + "/create-sub-error.xml", readOptions),
    getSubStatusSuccess: fs.readFileSync(responseDir + "/get-sub-status-success.xml", readOptions)
};
