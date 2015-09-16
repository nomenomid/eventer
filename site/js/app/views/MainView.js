/* globals Backbone _ */

var eventer = eventer || {};

eventer.MainView = Backbone.View.extend({
    el: "#eventer",
    
    initialize: function() {
        this.$companies = this.$("#companies");
        this.$activities = this.$("#activities");
        
        this.render();
    },
    
    render: function() {
        eventer.scheduleView = new eventer.ScheduleView(),
        eventer.filterView = new eventer.FilterView();
        
        this.$companies.append((new eventer.CompanyListView()).render().el);
        this.$activities.append((new eventer.ActivityListView()).render().el);
    }
});