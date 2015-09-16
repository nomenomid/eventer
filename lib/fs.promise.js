/* globals PromiseKeeper */

require("./promise.js");
var fs = require("fs");

var fsp = {}

fsp.readFile = function(fileName) {
    return new PromiseKeeper(function(resolve, reject) {
        fs.readFile(fileName, function(err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });  
};

module.exports = fsp;