/* globals Backbone _ */

var eventer = eventer || {};

eventer.FilterView = Backbone.View.extend({
    el: "#filterGroup",

    initialize: function() {
        this.filterMap = {
            company: "",
            activity: ""
        };

        var messenger = {};
        _.extend(messenger, Backbone.Events);

        this.$el.append(new eventer.CompanyComboBoxView().render({parent: this, messenger: messenger}).el);
        this.$el.append(new eventer.ActivityComboBoxView().render({parent: this, messenger: messenger}).el);

        messenger.on("message", this.processMessage, this);
    },

    processMessage: function(message) {
        this.filterMap[message.fieldName] = message.valid ? message.value : "";
        this.filterSchedule();
    },

    filterSchedule: function() {
        var self = this,
            $trs = eventer.scheduleView.$el.find("tbody > tr:not(.emptyFooter):not(.editing)"),
            $tableFooter = eventer.scheduleView.$el.find("tbody .emptyFooter"),
            $editing = eventer.scheduleView.$el.find("tbody > tr.editing"),
            $trsFiltered;
            
        $trs.removeClass("hidden");

        $trsFiltered = $trs.filter(function(index, element) {
            var companyName = $(element).find("td:nth-of-type(2) > label").eq(0).text().trim().toLowerCase(),
                activityName = $(element).find("td:nth-of-type(3) > label").eq(0).text().trim().toLowerCase();

            return (companyName.indexOf(self.filterMap["company"].toLowerCase()) !== 0 ||
                   activityName.indexOf(self.filterMap["activity"].toLowerCase()) !== 0);
        }).addClass("hidden");

        if($trs.length === $trsFiltered.length && $editing.length === 0) $tableFooter.addClass("show");
        else $tableFooter.removeClass("show");
    }
});