/* globals Backbone _ */

var eventer = eventer || {};

eventer.EventView = Backbone.View.extend({
    tagName: "tr",

    events: {
        "click label.edit": "editView",
        "click label.delete": "removeView",
        "dblclick": "editView"
    },

    template: _.template($("#event-template").html()),

    initialize: function() {
        this.listenTo(this.model, "destroy", this.remove);
        this.listenTo(this.model, "change", this.render);
    },

    removeView: function() {
        this.model.destroy();
    },

    getDisplayInformation: function(model) {
        return {
            startDate: new Date(model.get("startDate")).toUTCString(),
            endDate: new Date(model.get("endDate")).toUTCString()
        };
    },

    editView: function() {
        if(eventer.scheduleView.$(".editing").length > 0) return;
        var self = this, editView = new eventer.EventEditView({model: self.model});
        $(editView.render({sibling: self}).el).insertBefore(this.$el);
        eventer.scheduleView.$addButton.disable();
        eventer.scheduleView.setEditButtons();
        this.$el.addClass("hiddenForUpdate");
    },

    render: function() {
        var self = this;
        this.$el.html(this.template(this.getDisplayInformation(this.model)));
        this.$companyCell = this.$el.find("td:nth-of-type(2)");
        this.$activityCell = this.$el.find("td:nth-of-type(3)");

        this.$companyCell.append(new eventer.NameViewSimple({model: eventer.Companies.findByID(self.model.get("company"))[0]}).render().el);
        this.$activityCell.append(new eventer.NameViewSimple({model: eventer.Activities.findByID(self.model.get("activity"))[0]}).render().el);
        return this;
    }
});