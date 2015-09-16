/* globals Backbone _ */

var statesApp = statesApp || {};

statesApp.StateView = Backbone.View.extend({
    tagName: "div",
    
    className: "state",
    
    template: _.template($("#state-template").html()),
    
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});