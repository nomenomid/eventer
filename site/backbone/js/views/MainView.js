/* globals Backbone _ */

var statesApp = statesApp || {};

statesApp.MainView = Backbone.View.extend({
    el: "#statesApp",
    
    initialize: function() {
        new statesApp.ConfigsView();
        this.$states = this.$("#states");
        this.listenTo(statesApp.States, "add", this.addNewRecord);
    },
    
    addNewRecord: function(model) {
        this.$states.append(new statesApp.StateView({model: model}).render().el);
    }
});