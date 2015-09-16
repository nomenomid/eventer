/* globals jQuery */

jQuery.fn.enable = function() {
    return this.each(function(index, element) {
        if($(this).attr("disabled")) $(this).removeAttr("disabled");    
    });
};

jQuery.fn.disable = function() {
    return this.each(function(index, element) {
        if(!$(this).attr("disabled")) $(this).attr("disabled", "disabled");    
    });  
};