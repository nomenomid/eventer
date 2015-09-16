/* globals Backbone _ */

var eventer = eventer || {};

eventer.NameCollection = Backbone.Collection.extend({
    model: eventer.NameModel,
    
	initialize: function() {
		this.url = "/eventer/" + this.collectionName.toLowerCase();
	},

    nameExists: function(name) {
        return this.filter(function(record) {
            return record.get("name").toLowerCase() === name.toLowerCase();
        }).length > 0;
    },

	findByID: function(id) {
		return this.filter(function(record) {
			return record.get("_id") === id;
		});
	},
	
	findByName: function(name) {
		return this.filter(function(record) {
			return record.get("name").toLowerCase() === name.toLowerCase();
		});
	}
});

eventer.ActivityCollection = eventer.NameCollection.extend({
    collectionName: "Activities"    
});

eventer.CompanyCollection = eventer.NameCollection.extend({
    collectionName: "Companies"
});

eventer.Activities = new eventer.ActivityCollection();
eventer.Companies = new eventer.CompanyCollection();