(function($) {
    $.formatNumber = function(number, prefix, decimal) {
        return prefix + (+number).toFixed(decimal).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
})(jQuery);