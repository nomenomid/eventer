/* globals Backbone _ */

var eventer = eventer || {};

eventer.EventEditView = Backbone.View.extend({
    tagName: "tr",

    className: "editing",

    events: {
        "click button.cancel": "removeView",
        "click button.add": "saveView"
    },

    template: _.template($("#event-edit-template").html()),

    initialize: function() {
        var self = this;
        
        this.inputsMap = {
            company: false,
            activity: false,
            startDate: false,
            startTime: false,
            endDate: false,
            endTime: false
        };

        var messenger = {};
        _.extend(messenger, Backbone.Events);

        this.$el.html(this.template());

        this.$saveButton = this.$el.find("button.add");
        this.$companyCell = this.$el.find("td:nth-of-type(2)");
        this.$activityCell = this.$el.find("td:nth-of-type(3)");
        this.$startCell = this.$el.find("td:nth-of-type(4)");
        this.$endCell = this.$el.find("td:nth-of-type(5)");

        if(this.model) this.initializeInputsMap();

        this.$companyCell.append(new eventer.CompanyComboBoxView().render({parent: this, messenger: messenger, value: self.inputsMap.company}).el);
        this.$activityCell.append(new eventer.ActivityComboBoxView().render({parent: this, messenger: messenger, value: self.inputsMap.activity}).el);
        this.$startCell.append(new eventer.DateTimeView().render({fieldNames: {date: "startDate", time: "startTime"}, messenger: messenger, values: {date: self.inputsMap.startDate, time: self.inputsMap.startTime}}).el);
        this.$endCell.append(new eventer.DateTimeView().render({fieldNames: {date: "endDate", time: "endTime"}, messenger: messenger, values: {date: self.inputsMap.endDate, time: self.inputsMap.endTime}}).el);

        messenger.on("message", this.processMessage, this);
    },

    render: function() {
        if(arguments.length > 0) this.sibling = this.sibling || arguments[0].sibling;
        return this;
    },
    
    initializeInputsMap: function() {
        var self = this,
            startDateTime = new Date(this.model.get("startDate")),
            endDateTime = new Date(this.model.get("endDate"));
            
        this.inputsMap = {
            company: eventer.Companies.findByID(self.model.get("company"))[0].get("name"),
            activity: eventer.Activities.findByID(self.model.get("activity"))[0].get("name"),
            startDate: $.format.date(startDateTime, "yyyy/MM/dd"),
            startTime: $.format.date(startDateTime, "h:mm a"),
            endDate: $.format.date(endDateTime, "yyyy/MM/dd"),
            endTime: $.format.date(endDateTime, "h:mm a")
        };
        
        this.readyToSave();
    },
    
    processMessage: function(message) {
        this.inputsMap[message.fieldName] = message.valid ? message.value : message.valid;
        this.readyToSave();
    },

    readyToSave: function() {
        if(this.allValid()) this.$saveButton.enable();
        else this.$saveButton.disable();
    },

    allValid: function() {
        for(var key in this.inputsMap) if(!this.inputsMap[key]) return false;
        return true;
    },

    getRecordInformation: function() {
        var self = this;
        return {
            company: self.getNameID("company"),
            activity: self.getNameID("activity"),
            startDate: new Date(self.inputsMap["startDate"] + " " + self.inputsMap["startTime"]).getTime(),
            endDate: new Date(self.inputsMap["endDate"] + " " + self.inputsMap["endTime"]).getTime()
        };
    },

    getNameID: function(name) {
        var collections = {
                "company": "Companies",
                "activity": "Activities"
            },
            collection = eventer[collections[name]],
            exists = collection.nameExists(this.inputsMap[name]),
            id;

        if(!exists && !this.model) {
            id = this.createName(collection, name);
        } else if(!exists && this.model) {
            id = this.updateName(collection, name);
        } else id = collection.findByName(this.inputsMap[name])[0].get("id");
        
        return id;
    },
    
    createName: function(collection, name) {
        var self = this, model = collection.create({name: self.inputsMap[name]}, {wait: true});
        return model.attributes._id;
    },
    
    updateName: function(collection, name) {
        var self = this, nameID = this.model.get(name);
        collection.findByID(nameID)[0].save({name: self.inputsMap[name]});
        return nameID;
    },

    saveView: function() {
        if(!this.model) eventer.Events.create(this.getRecordInformation());
        else this.model.save(this.getRecordInformation());
        eventer.scheduleView.$addButton.enable();
        eventer.filterView.filterSchedule();
        this.removeView();
    },

    removeView: function() {
        this.remove();
        if(this.sibling) this.sibling.$el.removeClass("hiddenForUpdate");
        if(eventer.scheduleView.$el.find(".editing").length === 0) eventer.scheduleView.$addButton.enable();
        eventer.filterView.filterSchedule();
        eventer.scheduleView.setEditButtons();
    }
});