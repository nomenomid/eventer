/* globals Backbone _ */

var eventer = eventer || {};

eventer.MainRouter = Backbone.Router.extend({
    routes: {
        "events": "showEvents",
        "reports": "showReports",
        "contact": "showContact",
        "about": "showAbout"
    },
    
    $mainItems: $("aside li"),
    
    $mainSections: $(".mainSection"),
    
    showEvents: function() {
        this.removeClasses();
        this.$mainItems.eq(0).addClass("selected");
        this.$mainSections.eq(0).addClass("show");
    },
    
    showReports: function() {
        this.removeClasses();
        this.$mainItems.eq(1).addClass("selected");
        this.$mainSections.eq(1).addClass("show");
    },
    
    showContact: function() {
        this.removeClasses();
        this.$mainItems.eq(2).addClass("selected");
        this.$mainSections.eq(2).addClass("show");
    },
    
    showAbout: function() {
        this.removeClasses();
        this.$mainItems.eq(3).addClass("selected");
        this.$mainSections.eq(3).addClass("show");
    },
    
    removeClasses: function() {
        this.$mainItems.removeClass("selected");
        this.$mainSections.removeClass("show");
    }
});