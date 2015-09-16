/* globals angular */

angular.module("filters", [])
       .filter("stateFilter", stateFilter)
       .filter("capitalize", capitalize);

function capitalize() {
    return function(input, scope) {
        if(input != null) input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    };
}

function stateFilter() {
    function processCriteria(inputs) {
        var criteria = {};
        var keys = Object.keys(inputs);
        var id;
        var level;
        criteria.length = 0;
        
        for(var i = 0, l = keys.length; i < l; i++) {
            if(inputs[keys[i]] === "") continue;
            
            if(keys[i] === "name") {
                criteria[keys[i]] = inputs[keys[i]];
            } else {
                level = keys[i].slice(0, 3);
                id = keys[i].slice(3).toLowerCase();
                (criteria[id] || (criteria[id] = {}))[level] = inputs[keys[i]];
            }
            
            criteria.length++;
        }
        
        return criteria;
    }
    
    return function(items, criteria) {
        criteria = processCriteria(criteria);
        angular.forEach(items, function(item, index, collection) {
            var fulfilled = 0;
            var value;
            var limit;
            
            for(var key in criteria) {
                value = criteria[key];
                if(key === "name") {
                    if(item[key].toLowerCase().indexOf(value.toLowerCase()) === 0) {
                        fulfilled++;
                    }
                } else if(typeof value === "object") {
                    for(var level in value) {
                        limit = value[level];
                        if((level === "min" ? 1 : -1) * (+item[key] - limit) >= 0) {
                            fulfilled++;
                        }
                    }
                }
            }
            
            if(fulfilled === criteria.length) item.disabled = false;
            else item.disabled = true;
        });
        
        return items;
    }; 
}