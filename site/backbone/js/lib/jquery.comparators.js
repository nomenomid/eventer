var jqueryComparators = {
    textSort: function(selector, reverse) {
        return function(item1, item2) {
            var text1 = $(item1).find(selector).text().trim().toLowerCase(),
                text2 = $(item2).find(selector).text().trim().toLowerCase();
                
            return (reverse ? -1 : 1) * (text1 < text2 ? -1 : text1 === text2 ? 0 : 1);
        };
    },
    
    numberSort: function(selector, reverse) {
        return function(item1, item2) {
            var number1 = +$(item1).find(selector).text();
            var number2 = +$(item2).find(selector).text();
            
            return (reverse ? 1 : -1) * (number2 - number1);
        };
    }
};