/* globals Backbone _ */

var eventer = eventer || {};

eventer.ComboBoxView = Backbone.View.extend({
    tagName: "div",
    
    initialize: function() {
        this.children = [];
        
        this.$comboBox = $("<div></div>");
        this.comboBoxControls = {};
        this.$comboBox.comboBox(this.comboBoxControls, this.placeholder);
        this.comboBoxControls = this.comboBoxControls[0];
        this.addItems();
        this.$el.html(this.$comboBox);
        
        this.currentModel;
        this.listenTo(this.collection, "add", this.addItem);
        this.listenTo(this.collection, "change", this.comboBoxControls.sortItems);

        this.on("modelChange", this.updateCurrentModel);
    },
      
    render: function() {
        this.parent = this.parent || arguments[0].parent;
        this.messenger = this.messenger || arguments[0].messenger;
        this.value = this.value || arguments[0].value;
        
        this.comboBoxControls.setMessenger(this.messenger);
        this.comboBoxControls.setFieldName(this.fieldName);
        this.comboBoxControls.setInput(this.value);
        
        this.messenger.on("message", this.processMessage, this);
        
        return this;
    },

    processMessage: function(message) {
        var self = this;
        
        if(!message.valid || message.uniqueInput) this.clearCurrentModel();
        else if(message.valid) {
            this.collection.each(function(model) {
                if(model.get("name").toLowerCase() === message.value.toLowerCase()) {
                    self.updateCurrentModel(model);
                }    
            });
        }
    },

    clearCurrentModel: function() {
        if(this.currentModel) {
            this.stopListening(this.currentModel);
            this.currentModel = undefined;
        }    
    },
    
    addItems: function() {
        var self = this;
        this.collection.each(function(model) {
            self.addItem(model);
        });
    },
    
    addItem: function(model) {
        this.comboBoxControls.addItem(new eventer.ComboBoxItemView({model: model}).render({parent: this}).el);
    },

    updateCurrentModel: function(model) {
        if(this.currentModel) this.stopListening(this.currentModel);
        this.currentModel = model;
        this.listenTo(this.currentModel, "change", this.changeInput);
        this.listenTo(this.currentModel, "destroy", this.comboBoxControls.clearInput);
    },
    
    changeInput: function(model) {
        this.comboBoxControls.setInput(model.attributes.name);        
    }
});


eventer.ActivityComboBoxView = eventer.ComboBoxView.extend({
    placeholder: "Activity",
    fieldName: "activity",
    collection: eventer.Activities
});

eventer.CompanyComboBoxView = eventer.ComboBoxView.extend({
    placeholder: "Company",
    fieldName: "company",
    collection: eventer.Companies
});