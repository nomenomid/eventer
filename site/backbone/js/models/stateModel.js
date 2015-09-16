/* globals Backbone */

var statesApp = statesApp || {};

statesApp.StateModel = Backbone.Model.extend({
    defaults: {
        name: "",
        abbreviation: "",
        population: "",
        income: "",
        area: "",
        statefaceLetter: "",
        wikiLink: ""
    }
});