/* globals jqueryComparators */

var statesApp = statesApp || {};
statesApp.Mixins || (statesApp.Mixins = {});


statesApp.Mixins.OrderMixin = {
    events: {
        "click #orderGroup button": "sortStates"
    },
    
    initialize: function() {
        $("#orderGroup button:first").addClass("selected");
    },
    
    sortStates: function(e) {
        var $el = $(e.target);
        if($el.hasClass("selected")) return;
        
        var field = $el.parent().attr("for");
        var reverse = $el.hasClass("desc");
        
        $("#orderGroup button").removeClass("selected");
        $el.addClass("selected");
        
        $("#states .state")
            .detach()
            .sort(jqueryComparators[field === "name" ? "textSort" : "numberSort"]("." + field, reverse))
            .appendTo($("#states"));
    }
};