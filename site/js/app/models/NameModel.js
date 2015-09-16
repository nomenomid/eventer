/* globals Backbone _ */

var eventer = eventer || {};

eventer.NameModel = Backbone.Model.extend({
    idAttribute: "_id",
    
    defaults: {
        name: ""
    },

    parse: function(response) {
        response.id = response._id;
        return response;
    }
});