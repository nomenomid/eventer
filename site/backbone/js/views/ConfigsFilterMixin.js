var statesApp = statesApp || {};
statesApp.Mixins || (statesApp.Mixins = {});

statesApp.Mixins.FilterMixin = {
    events: {
        "keyup #filterGroup input": "filterStates"
    },
    
    initialize: function() {
        this.$("#filterGroup input[class]").onlyNumeric();
    },
    
    getFilterInputs: function() {
        var criteria = {};
        criteria.length = 0;
        this.$("#filterGroup input").each(function(index, element) {
            var $el = $(element);
            var val = $el.val().trim();
            var id = $el.attr("id");
            var level;
            if(val !== "") {
                if(id === "name") {
                    criteria[id] = val;
                } else {
                    level = id.slice(0, 3);
                    id = id.slice(3).toLowerCase();
                    (criteria[id] || (criteria[id] = {}))[level] = val;
                }
                
                criteria.length++;
            }
        });
        
        return criteria;
    },
    
    filterStates: function() {
        $("#states .state").removeClass("disabled");
        
        var criteria = this.getFilterInputs();
        if(criteria.length === 0) return;
        
        $("#states .state").filter(function(index, element) {
            var $el = $(element);
            var fulfilledCount = 0;
            var value;
            var limit;
            
            for(var key in criteria) {
                if(key === "name") {
                    if($el.find(".name").text().toLowerCase().indexOf(criteria["name"].toLowerCase()) === 0)  {
                        fulfilledCount++;
                    }
                } else {
                    value = +$el.find("." + key).text();
                    for(var level in criteria[key]) {
                        limit = +criteria[key][level];
                        if((level === "min" ? 1 : -1) * (value - limit) >= 0) {
                            fulfilledCount++;
                        }
                    }
                }
            }
            if(fulfilledCount === criteria.length) return false;
            return true;
        }).addClass("disabled");
    }
};