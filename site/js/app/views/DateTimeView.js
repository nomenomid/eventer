/* globals Backbone _ */

var eventer = eventer || {};

eventer.DateTimeView = Backbone.View.extend({
    tagName: "div",

    initialize: function() {
        this.$date = $("<div></div>");
        this.$time = $("<div></div>");
        this.dateController = {};
        this.timeController = {};

        this.$date.datePicker(this.dateController);
        this.$time.timePicker(this.timeController);

        this.$el.append(this.$date);
        this.$el.append(this.$time);
    },

    render: function() {
        this.fieldNames = this.fieldNames || arguments[0].fieldNames;
        this.messenger = this.messenger || arguments[0].messenger;
        this.values = this.values || arguments[0].values;

        this.dateController[0].setMessenger(this.messenger);
        this.dateController[0].setFieldName(this.fieldNames.date);
        this.dateController[0].setInput(this.values.date);
        this.timeController[0].setMessenger(this.messenger);
        this.timeController[0].setFieldName(this.fieldNames.time);
        this.timeController[0].setInput(this.values.time);

        return this;
    }
});