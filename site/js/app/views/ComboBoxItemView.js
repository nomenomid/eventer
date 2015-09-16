/* globals Backbone _ */

var eventer = eventer || {};

eventer.ComboBoxItemView = Backbone.View.extend({
    tagName: "li",
    
    events: {
        "click": "processClick"
    },
    
    initialize: function() {
        this.listenTo(this.model, "destroy", this.remove);
        this.listenTo(this.model, "change", this.render);
    }, 
    
    render: function() {
        this.parent = this.parent || arguments[0].parent;
        this.$el.text(this.model.attributes.name);
        return this;
    },
    
    processClick: function(e) {
        this.parent.trigger("modelChange", this.model);
    }
});