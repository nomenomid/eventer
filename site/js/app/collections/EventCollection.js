/* globals Backbone _ */

var eventer = eventer || {};

eventer.EventCollection = Backbone.Collection.extend({
    model: eventer.EventModel,

    url: "/eventer/events",

    getNextID: function() {
        return !this.length ? 1 : this.last().get("id") + 1;
    },

    findByFieldValue: function(field, value) {
        return this.filter(function(element) {
            return element.get(field).toString().toLowerCase() === value.toString().toLowerCase();
        });
    }
});

eventer.Events = new eventer.EventCollection();