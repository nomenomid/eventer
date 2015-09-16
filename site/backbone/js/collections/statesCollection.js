/* globals Backbone */

var statesApp = statesApp || {};

statesApp.StatesCollection = Backbone.Collection.extend({
    model: statesApp.StateModel,
    url: "/states"
});

statesApp.States = new statesApp.StatesCollection();