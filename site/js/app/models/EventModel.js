/* globals Backbone _ */

var eventer = eventer || {};

eventer.EventModel = Backbone.Model.extend({
    defaults: {
        company: "",
        activity: "",
        startDate: "",
        endDate: ""
    },
    
    parse: function(response) {
        response.id = response._id;
        return response;
    }
});