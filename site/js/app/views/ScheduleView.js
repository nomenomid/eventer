/* globals Backbone _ */

var eventer = eventer || {};

eventer.ScheduleView = Backbone.View.extend({
    el: "#scheduleForm",
    
    events: {
        "click header > .add": "addNewEvent"
    },
    
    initialize: function() {
        this.$scheduleTable = this.$("table");
        this.$addButton = this.$("header button");
        this.$editButtons;
		
		this.listenTo(eventer.Events, "add", this.addNewRecord);
    },
    
	addNewRecord: function(model) {
		this.$scheduleTable.prepend(new eventer.EventView({model: model}).render().el);
	},
	
    addNewEvent: function() {
        this.$addButton.attr("disabled", "disabled");
        this.$scheduleTable.prepend(new eventer.EventEditView().render().el);
        eventer.filterView.filterSchedule();
        this.setEditButtons();
    },
    
    setEditButtons: function() {
        this.$editButtons = this.$("td:last-of-type > .edit");
        if(this.$el.find(".editing").length > 0) this.$editButtons.addClass("disabled");
        else this.$editButtons.removeClass("disabled");
    }
});