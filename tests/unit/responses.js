var fs = require("fs");

var readOptions = { encoding: "utf8" };
var responseDir = __dirname + "/responses";

var read = function(fileName) {
    return fs.readFileSync(responseDir + "/" + fileName, readOptions);
};

module.exports = {
    generalError: read("general-error.xml"),

    cancelSubSuccess: read("cancel-sub-success.xml"),
    cancelSubError: read("cancel-sub-error.xml"),

    createSubSuccess: read("create-sub-success.xml"),
    createSubError: read("create-sub-error.xml"),

    getSubStatusSuccess: read("get-sub-status-success.xml"),
    getSubStatusError: read("get-sub-status-error.xml"),

    updateSubSuccess: read("update-sub-success.xml"),
    updateSubError: read("update-sub-error.xml")
};
