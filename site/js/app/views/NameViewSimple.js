/* globals Backbone _ */

var eventer = eventer || {};

eventer.NameViewSimple = Backbone.View.extend({
    tagName: "label",

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },

    render: function() {
        this.$el.text(this.model.get("name"));
        return this;
    }
});