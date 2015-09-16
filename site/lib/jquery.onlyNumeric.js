(function($) {
    var digitKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
    var digitKeysNumLock = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
    var dotKeys = [110, 190];
    var deleteKeys = [8, 46];
    var navigationKeys = [37, 39, 9];
    var allKeys = digitKeys.concat(digitKeysNumLock, deleteKeys, navigationKeys);
    
    $.fn.onlyNumeric = function(allowFloats, options) {
        this.bind("keydown keyup", function(evt) {
            allKeys = allKeys.concat(allowFloats ? dotKeys : []);
            
            if(
                (allKeys.indexOf(evt.keyCode) === -1) || 
                (allKeys.indexOf(evt.keyCode) !== -1 && evt.shiftKey && evt.keyCode !== 9) ||
                (dotKeys.indexOf(evt.keyCode) !== -1 && $(this).val().indexOf('.') !== -1)
            ) {
                evt.preventDefault();
                return;
            }
            
            if(options && evt.type === "keyup") {
                if(options.min) {
                    if(parseFloat($(this).val()) < options.min) {
                        $(this).val(options.min);
                    }
                } 
                
                if(options.noBlank) {
                    if($(this).val() === undefined || $(this).val().length === 0 || $(this).val() === "") {
                        $(this).val(options.min || 1);
                    }
                } 
                
                if(options.max) {
                    if(parseFloat($(this).val()) > options.max) {
                        $(this).val(options.max);
                    }
                }
            }
        });
        
        return this;
    };
})(jQuery);