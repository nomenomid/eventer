/* globals Backbone */

var statesApp = statesApp || {};

statesApp.ConfigsView = Backbone.View.extend({
    el: "#configs",
    mixins: [statesApp.Mixins.FilterMixin, statesApp.Mixins.OrderMixin],
});