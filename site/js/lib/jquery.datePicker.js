/* globals WidgetCommon */

var DatePicker = (function($) {
    function DatePicker(selector) {
        if(!selector) throw Error("Specify selector for DatePicker widget");
        this.$datePicker = $(selector);
        this.init();
    }

    DatePicker.prototype.init = function() {
        var self = this;

        this.$datePicker.empty().addClass("datePicker");

        this.$datePicker.append(
            '<input type = "text" placeholder = "Date" disabled />' +
            '<div class = "icon" tabindex = "100"></div>' +
            '<div class = "calendar" tabindex = "1">' +
                '<header>' +
                    '<button class = "previous"></button>' +
                    '<span class = "title">November 2014</span>' +
                    '<button class = "next"></button>' +
                '</header>' +
                '<div class = "grid">' +
                    '<ul class = "heading">' +
                        '<li>Sun</li><li>Mon</li><li>Tue</li><li>Wed</li><li>Thu</li><li>Fri</li><li>Sat</li>' +
                    '</ul>' +
                    '<ul class = "days"></ul>' +
                '</div>' +
            '</div>'
        );

        this.$input = this.$datePicker.find("input");
        this.$icon = this.$datePicker.find(".icon");
        this.$calendar = this.$datePicker.find(".calendar");
        this.$list = this.$datePicker.find(".days");
        this.$title = this.$datePicker.find(".title");
        this.$previous = this.$datePicker.find(".previous");
        this.$next = this.$datePicker.find(".next");

        this.show = false;

        this.$icon.click(function() {
            self.$datePicker.toggleClass("show");
            self.show = !self.show;
        });

        this.$icon.blur(function() {
            self.show = false;
            setTimeout(function() {
                if(!self.show) self.$datePicker.removeClass("show");
            }, 250);
        });

        this.$calendar.click(function() {
            self.show = true;
        });

        this.$calendar.andSelf().find("*").blur(function() {
            self.show = false;
            setTimeout(function() {
                if(!self.show) self.$datePicker.removeClass("show");
            }, 250);
        });

        this.$previous.click(function() {
            self.fillCalendar(self.previousMonth);
        });

        this.$next.click(function() {
            self.fillCalendar(self.nextMonth);
        });
    };

    DatePicker.prototype.dataAttribute = "data-full-date",
    DatePicker.prototype.otherClassName = "other",
    DatePicker.prototype.currentClassName = "current",
    DatePicker.prototype.monthsFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    DatePicker.prototype.daysInMonths = function(year, monthIndex) {
        return monthIndex === 1 ? year % 4 === 0 ? 29 : 28 : monthIndex  > 6 ? monthIndex % 2 === 0 ? 30 : 31 : monthIndex % 2 === 0 ? 31 : 30;
    };

    DatePicker.prototype.setStartDate = function(startDate) {
        if(!startDate) var today = new Date();
        if(startDate && !(startDate instanceof Date)) throw Error("Expecting Date() instance")
        this.startDate = today ? new Date(today.getFullYear(), today.getMonth(), 1) : startDate;
    };

    DatePicker.prototype.fillCalendar = function(startDate) {
        this.setStartDate(startDate);
        
        var c = this.getCurrentMonthParameters(),
            p = this.getPreviousMonthParameters(c),
            n = this.getNextMonthParameters(c);
        
        this.$title.text(c.fullName);
        this.updateList(c, p, n);
    };
    
    DatePicker.prototype.getCurrentMonth = function() {
        return this.currentMonth;    
    };
    
    DatePicker.prototype.getCurrentMonthParameters = function() {
        var obj = {};
        
        obj.weekDay = this.startDate.getDay() === 0 ? 7 : this.startDate.getDay();
        obj.month = this.startDate.getMonth();
        obj.year = this.startDate.getFullYear();
        obj.days = this.daysInMonths(obj.year, obj.month);
        obj.day = 1;
        obj.fullName = this.monthsFull[obj.month] + " " + obj.year;
        
        this.currentMonth = new Date(obj.year, obj.month, obj.day);
        
        return obj;
    };
    
    DatePicker.prototype.getPreviousMonthParameters = function(c) {
        var obj = {};
        
        obj.month = c.month === 0 ? 11 : c.month - 1;
        obj.year = c.month === 0 ? c.year - 1 : c.year;
        obj.day = 1;

        obj.days = this.daysInMonths(obj.year, obj.month);
        obj.start = obj.days - c.weekDay + 1;
        
        this.previousMonth = new Date(obj.year, obj.month, obj.day);
        
        return obj;
    };

    DatePicker.prototype.getNextMonthParameters = function(c) {
        var obj = {};
        
        obj.month = c.month === 11 ? 0 : c.month + 1;
        obj.year = c.month === 11 ? c.year + 1 : c.year;
        obj.day = 1;
        
        this.nextMonth = new Date(obj.year, obj.month, obj.day);
        
        return obj;
    };
    
    DatePicker.prototype.updateList = function(c, p, n) {
        var $listItems = this.$list.children("li"),
            fullList = $listItems.length === 42,
            listCounter = 0;
        
        var intervals = [
                {type: "prev", start: p.start, end: p.days},
                {type: "current", start: 1, end: c.days},
                {type: "next", start: 1, end: 42 - c.days - c.weekDay}
            ],
            self = this;
            
        intervals.forEach(function(element) {
            for(var day = element.start, $element = ""; day <= element.end; day++) {
                $element = fullList ? $listItems.eq(listCounter++) : $("<li></li>");
                $element
                    .text(day)
                    .click(function() {
                        self.$datePicker.removeClass("show");
                        self.$input.val($(this).attr("data-full-date"));
                        if(self.messenger) self.sendValidMessage();
                    });
                
                switch(element.type) {
                    case "prev":
                        $element
                            .attr(self.dataAttribute, p.year + "/" + (p.month + 1) + "/" + day)
                            .attr("class", self.otherClassName);;
                        break;
                    case "current":
                        $element
                            .attr(self.dataAttribute, c.year + "/" + (c.month + 1) + "/" + day)
                            .attr("class", self.currentClassName);
                        break;
                    case "next":
                        $element
                            .attr(self.dataAttribute, n.year + "/" + (n.month + 1) + "/" + day)
                            .attr("class", self.otherClassName);
                        break;
                    default:
                        throw Error("Received the following data type [" + element.type + "]");
                }

                if(!fullList) self.$list.append($element);
            }    
        });
    };
    
    $.extend(DatePicker.prototype, WidgetCommon);
    
    return function(element) {
        var datePicker = new DatePicker(element);
        
        return {
            fillCalendar: function() {
                datePicker.fillCalendar.apply(datePicker, Array.prototype.slice.call(arguments, 0));    
                return this;
            },
            
            getCurrentMonth: function() {
                return datePicker.getCurrentMonth.apply(datePicker); 
            },
            
            setMessenger: function(messenger) {
                datePicker.setMessenger.call(datePicker, messenger);   
                return this;
            },
            
            setFieldName: function(name) {
                datePicker.setFieldName.call(datePicker, name);
                return this;
            },
            
            setInput: function(value) {
                datePicker.setInput.call(datePicker, value);
                return this;
            }
        };
    };
})(jQuery);

jQuery.fn.datePickerCount = 0;
jQuery.fn.datePickerAttrName = "date-picker-id";

jQuery.fn.datePicker = function(collection, date) {
    var self = jQuery.fn,
        $element = this.eq(0),
        id = $element.attr(self.datePickerAttrName),
        dateRegEx = /^([0-9]{4})\/([0-9]{1,2})\/([0-9]{1,2})$/gi;

    if(date && !dateRegEx.test(date)) throw Error("Date format example: 2014/2/17");
    date = date ? new Date(date) : date;

    if(!id) {
        $element.attr(self.datePickerAttrName, self.datePickerCount++);
        collection[0] = DatePicker($element);
        collection[0].fillCalendar(date);
    } else if(date && date.getTime() !== collection[0].getCurrentMonth().getTime()) {
        collection[0].fillCalendar(date);
    }

    return $element;
};