/* globals Backbone _ ENTER_KEY */

var eventer = eventer || {},
    ENTER_KEY = 13;

eventer.NameListView = Backbone.View.extend({
    tagName: "div",
    
    className: "form",
    
    template: _.template($("#name-list-template").html()),
    
    events: {
        "keypress .new-record": "createOnEnter", 
        "keyup .new-record": "filterList"
    },
    
    initialize: function() {
        this.$el.html(this.template());
        this.$el.append((new eventer.InstructionsView()).render({name: this.name}).el);
        
        this.$input = this.$(".new-record");
        this.$list = this.$(".name-list");
        this.items;

        this.listenTo(this.collection, "add", this.addNewRecord);
        this.listenTo(this.collection, "add", this.sortList);
        this.listenTo(this.collection, "change", this.handleCollectionChange);
    },
    
    handleCollectionChange: function() {
        this.clearInput();
        this.sortList();
        this.showAll();
    },
    
    render: function() {
        return this;
    },
    
    clearInput: function() {
        this.$input.val("").focus(); 
    },

    sortList: function(except) {
        this.$list.children("li").not(except).detach().sort(jqueryComparators.textSort()).appendTo(this.$list);
    },
    
    addNewRecord: function(model) {
        var view = new this.childView({model: model});
        this.$list.append(view.render({parent: this}).el);
        this.$items = this.$list.find("li");
    },
    
    getNewRecordData: function() {
        return {name: this.$input.val().trim()}; 
    },
    
    showAll: function() {
        if(this.$items && this.$items.length > 0) this.$items.removeClass("hidden");
    },
    
    filterList: function(e, $exempt) {
		var value = (typeof e === "object") ? this.$input.val().trim() : e;
        this.showAll();
		this.sortList($exempt);
        if(this.$items) this.$items.filter(function() {
            return $(this).text().trim().toLowerCase().indexOf(value.toLowerCase()) !== 0;
        }).not($exempt).addClass("hidden");
    },
    
    createOnEnter: function(e) {
        if(e.which !== ENTER_KEY || !this.$input.val().trim()) return;
        
        if(this.collection.nameExists(this.getNewRecordData().name)) {
			var self = this;
			this.$list.find(":not(.hidden)").addClass("errorFlash");
			setTimeout(function() {
				self.$list.find(":not(.hidden)").removeClass("errorFlash");
			}, 700);
            return;
        }
        
        this.collection.create(this.getNewRecordData());
        this.clearInput();
        this.sortList();
    }    
});

eventer.ActivityListView = eventer.NameListView.extend({
    collection: eventer.Activities,
    name: "ActivityList",
    childView: eventer.ActivityView
});

eventer.CompanyListView = eventer.NameListView.extend({
    collection: eventer.Companies,
    name: "CompanyList",
    childView: eventer.CompanyView
});