/* Function extensions */

Function.prototype.overload = function(overloadee) {
    var self = this;
    return function() {
        var args = Array.prototype.slice.call(arguments, 0),
            result = overloadee.apply(this, args);
        return result === null ? self.apply(this, args) : result;
    };
};

/*

Object.prototype.toConsole = function() {
    console.log(this.toString());    
};

*/