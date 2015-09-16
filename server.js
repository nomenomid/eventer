<<<<<<< HEAD
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
var port = process.env.PORT || 5000;

var Name = new mongoose.Schema({name: String});

var Event = new mongoose.Schema({
    company: mongoose.Schema.Types.ObjectId, 
    activity: mongoose.Schema.Types.ObjectId, 
    startDate: Date, 
    endDate: Date});
    
var modelsMap = {
    "activities": mongoose.model("activities", Name), 
    "companies": mongoose.model("companies", Name), 
    "events": mongoose.model("events", Event)};
    
var fieldNames = {
    "activities": ["name"], 
    "companies": ["name"], 
    "events": ["company", "activity", "startDate", "endDate"]};

function buildRecord(collection, request, record) {
    record || (record = {});
    fieldNames[collection].forEach(function(element, index) {
        record[element] = request.body[element];    
    });
    return record;
}

app.use(express.static("site"));
app.use(bodyParser());
mongoose.connect("mongodb://heroku_pdw3vb3p:7utd945kduvhacuamt92pl0elb@ds041571.mongolab.com:41571/heroku_pdw3vb3p");

app.get("/eventer/:collection/:id?", function(request, response) {
    return modelsMap[request.params.collection].find(request.params.id, function(error, results) { 
        return error ? console.log(error) : response.send(results);    
    });
});

app.post("/eventer/:collection", function(request, response) {
    var collection = request.params.collection, record;
    return (record = modelsMap[collection](buildRecord(collection, request))).save(function(error) {
        return error ? console.log(error) : response.send(record);
    });
});

app.delete("/eventer/:collection/:id", function(request, response) {
    return modelsMap[request.params.collection].findById(request.params.id, function(error, result) {
        return result.remove(function(error) {
            return error ? console.log(error) : response.send("");
        });  
    });
});

app.put("/eventer/:collection/:id", function(request, response) {
    var collection = request.params.collection;
    return modelsMap[collection].findById(request.params.id, function(error, result) {
        buildRecord(collection, request, result).save(function(error) {
            return error ? console.log(error) : response.send(result);    
        });
    });
=======
/* globals readFile */

var fsp = require("./lib/fs.promise.js");
var express = require("express");
var app = express();
var dataFile = "./data/states.json";
var port = process.env.PORT || 5000;

app.use(express.static("site"));

app.get("/states", function(request, response) {
    fsp.readFile(dataFile)
        .then(JSON.parse)
        .then(response.send.bind(response));
>>>>>>> 41b10827a65bd4dcbaa133d4e049b0298eef5ce3
});

app.listen(port, function() {
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);    
});