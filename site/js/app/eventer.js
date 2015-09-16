/* globals Backbone _ */

var eventer = eventer || {};

$(function() {
    new eventer.MainView();   
    eventer.Activities.fetch();
    eventer.Companies.fetch();
    eventer.Events.fetch();
    eventer.router = new eventer.MainRouter();
    
    Backbone.history.start();
    eventer.router.navigate("events", {trigger: true});
});