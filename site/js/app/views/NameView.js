/* globals Backbone ENTER_KEY _ */

var eventer = eventer || {};

eventer.NameView = Backbone.View.extend({
    tagName: "li",
    
    template: _.template($("#name-template").html()),

    events: {
        "click .remove": "removeView",
        "dblclick .view": "editView",
        "blur .edit": "closeView",
        "keyup .edit": "updateOnEnter"
    },
    
    initialize: function() {
        this.listenTo(this.model, "destroy", this.remove);
        this.listenTo(this.model, "change", this.render);
        this.except = false;
    },
    
    render: function() {
		this.parent = this.parent || arguments[0].parent;
        this.$el.html(this.template(this.model.attributes));
        this.$input = this.$("input");
        return this;
    },
    
    showView: function() {
        this.$el.removeClass("hidden");
    },
    
    hideView: function() {
        this.$el.addClass("hidden");    
    },
    
    removeView: function() {
        if(this.canRemove()) this.model.destroy();
        else this.displayError("Record associated with Schedule entry");
        this.parent.$input.val("");
    },
    
    editView: function() {
        if(this.$el.hasClass("errorFlash")) return;

        this.$el.addClass("editing");
        this.$input.focus().putCursorAtEnd();
		this.parent.$input.val("");
		this.parent.filterList(this.$input.val().trim(), this.$el);
    },

    displayError: function(error) {
        var self = this;
        this.except = true;
        this.$el.html(this.template({name: error})).addClass("errorFlash");
        setTimeout(function() {
            self.$el.removeClass("errorFlash");
            self.render();
            self.except = false;
            self.closeView();
        }, 1500);
    },

    canRemove: function() {
        if(eventer.Events.findByFieldValue(this.fieldName, this.model.get("_id")).length > 0) return false;
        return true;
    },

    updateOnEnter: function(e) {
		var newValueOriginal = this.$input.val().trim(),
			newValue = newValueOriginal.toLowerCase(),
			existingValue = this.$el.text().trim().toLowerCase(),
			self = this;
	
        if(e.which === ENTER_KEY) {
			if(this.collection.nameExists(newValue) && newValue !== existingValue) {
				this.parent.$list.find("li:not(.hidden)").not(this.$el).addClass("errorFlash");
				setTimeout(function() {
					self.parent.$list.find("li:not(.hidden)").not(this.$el).removeClass("errorFlash");
				}, 700);
				return;
			} else {
				if(newValueOriginal === "") this.removeView();
				else {
					this.model.save({name: newValueOriginal}, {wait: true});
					this.closeView();
				}
			}
        } else {
			this.parent.filterList(newValue, this.$el);
		}
    },
    
    closeView: function() {
		this.render();
        this.$el.removeClass("editing");
		this.parent.sortList(this.except ? this.$el : undefined);
		this.parent.showAll();
    }
});

eventer.ActivityView = eventer.NameView.extend({
    parent: "",
    fieldName: "activity",
    collection: eventer.Activities
});

eventer.CompanyView = eventer.NameView.extend({
    parent: "",
    fieldName: "company",
    collection: eventer.Companies    
});