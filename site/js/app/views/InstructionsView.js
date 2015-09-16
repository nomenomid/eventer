/* globals Backbone _ */

var eventer = eventer || {};

eventer.InstructionsView = Backbone.View.extend({
    tagName: "div",
    
    className: "instruction",
    
    template: _.template($("#instructions-template").html()),

    render: function(props) {
        this.$el.html(this.template(props));
        return this;
    }
});