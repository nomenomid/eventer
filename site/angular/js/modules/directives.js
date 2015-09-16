/* globals angular */

angular.module("directives", [])
       .directive("dirNumericOnly", dirNumericOnly);

function dirNumericOnly() {
    return function(scope, element, attrs) {
        $(element).onlyNumeric();    
    };
}