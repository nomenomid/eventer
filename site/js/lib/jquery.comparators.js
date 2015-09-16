/* globals $ */

var jqueryComparators = {
    textSort: function(reverse) {
        return function(item1, item2) {
            var text1 = $(item1).text().trim().toLowerCase(),
                text2 = $(item2).text().trim().toLowerCase();

            if(text1 < text2) return (reverse ? 1 : -1);
            if(text1 > text2) return (reverse ? -1 : 1);
            return 0;
        }
    }
};