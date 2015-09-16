/* globals WidgetCommon */

var TimePicker = (function($) {
    function TimePicker(selector) {
        if(!selector) throw Error("Specify selector for TimePicker widget.");
        this.$timePicker = $(selector).empty().addClass("timePicker");
		this.init();
    }

    $.extend(TimePicker.prototype, WidgetCommon);
    
	TimePicker.prototype.init = function() {
        var self = this;

        this.$timePicker.append(
            '<input type = "text" placeholder = "Time" disabled />' +
            '<div class = "icon" tabindex = "1"></div>' +
            '<div class = "clockHolder" tabindex = "1">' + 
                '<header>' +
                    '<button class = "hours">H</button>' +
                    '<span>:</span>' + 
                    '<button class = "minutes" disabled>M</button>' +
                    '<button class = "meridiems" disabled>A[PM]</button>' +
                '</header>' +
                '<div class = "clockWrapper">' +
                    '<div class = "clock">' +
                        '<div class = "numbers"></div>' +
                        '<div class = "hands">' +
                            '<span class = "minute"></span>' +
                            '<span class = "hour"></span>' +
                        '</div>' +
                    '</div>' +
                    '<div class = "meridiemsHolder">' +
                        '<button class = "am">AM</button>' +
                        '<button class = "pm">PM</button>' +
                    '</div>' +
                '</div>' +
            '</div>'                    
        );
        
        this.addNumbersMarkup();
        
        this.currentStage = "";
        this.$icon = this.$timePicker.find(".icon");
        this.$numbers = this.$timePicker.find(".numbers label span");
        this.$buttons = this.$timePicker.find("header button");
        this.$hoursButton = this.$timePicker.find("header .hours");
        this.$minutesButton = this.$timePicker.find("header .minutes");
        this.$meridiemsButton = this.$timePicker.find("header .meridiems");
        this.$input = this.$timePicker.find("input");
        this.$hoursHand = this.$timePicker.find(".hands .hour");
        this.$minutesHand = this.$timePicker.find(".hands .minute");
        this.$meridiemsHolder = this.$timePicker.find(".meridiemsHolder");
        this.$clockHolder = this.$timePicker.find(".clockHolder");
        
        this.setHoursStage();
        this.displayHourFace();
        this.highlightButton(this.$hoursButton);
        this.$minutesHand.addClass("dim");

        this.$hoursButton.click(function() {
            self.$hoursHand.removeClass("dim");
            self.$minutesHand.addClass("dim");
            self.highlightButton(this);
            self.$meridiemsHolder.removeClass("show");
            self.setHoursStage();
            self.displayHourFace();
        });

        this.$minutesButton.click(function() {
            self.$hoursHand.addClass("dim");
            self.$minutesHand.removeClass("dim");
            self.highlightButton(this);
            self.$meridiemsHolder.removeClass("show");
            self.setMinutesStage();
            self.displayMinuteFace();
        });

        this.$meridiemsButton.click(function() {
            self.$hoursHand.removeClass("dim");
            self.$minutesHand.removeClass("dim");
            self.highlightButton(this);
            self.$meridiemsHolder.addClass("show");
            self.setMeridiemsStage();
            self.displayHourFace();
        });

        this.$meridiemsHolder.find("button").click(function() {
            self.$meridiemsHolder.removeClass("show");
            self.$timePicker.removeClass("show");
            self.setInputMeridiem(this);
            self.visible = false;
        });

        this.$numbers.click(function() {
            switch(self.currentStage) {
                case "hours":
                    self.$hoursHand.removeClass("dim");
                    self.$minutesButton.enable();
                    self.highlightButton(self.$minutesButton);
                    self.setInputHours(this);
                    self.setMinutesStage();
                    setTimeout(function() {
                        self.$hoursHand.addClass("dim");
                        self.$minutesHand.removeClass("dim");
                        self.displayMinuteFace();
                    }, 300);
                    break;
                case "minutes":
                    self.$hoursHand.removeClass("dim");
                    self.$minutesHand.removeClass("dim");
                    self.$meridiemsButton.enable();
                    self.highlightButton(self.$meridiemsButton);
                    self.setInputMinutes(this);
                    self.displayHourFace();
                    self.setMeridiemsStage();
                    setTimeout(function() {
                        self.$meridiemsHolder.addClass("show");
                    }, 300);
                    break;
                case "meridiems":
                    self.$hoursHand.removeClass("dim");
                    self.$minutesHand.removeClass("dim");
                    break;
                default:
                    throw Error("Received unknown stage request [" + self.currentStage + "]");
            }

            if(self.valid) self.sendValidMessage();
        });

        this.visible = false;
        this.valid = false;

        this.$icon.click(function() {
            self.$timePicker.toggleClass("show");
            self.visible = !self.visible;
            if(self.$meridiemsHolder.hasClass("show")) self.$meridiemsHolder.removeClass("show");
        });

        this.$icon.blur(function() {
            self.visible = false;
            setTimeout(function() {
                if(!self.visible) self.$timePicker.removeClass("show");
            }, 250);
        });

        this.$clockHolder.click(function() {
            self.visible = true;
        });

        this.$clockHolder.andSelf().find("*").blur(function() {
            self.visible = false;
            setTimeout(function() {
                if(!self.visible) self.$timePicker.removeClass("show");
            }, 250);
        });
    };

    TimePicker.prototype.addNumbersMarkup = function() {
        var $numbers = this.$timePicker.find(".numbers");
        for(var i = 0; i < 12; $numbers.append("<label><span></span></label>"), i++);
    };
    
    TimePicker.prototype.displayHourFace = (function() {
        var hours = [12];
        for(var i = 1; i <= 11; hours.push(i++));
        
        return function() {
            this.$numbers.each(function(index, element) {
                $(element).text(hours[index]);    
            });      
        };
    })();
        
    TimePicker.prototype.displayMinuteFace = (function() {
        var minutes = [0];
        for(var i = 5; i <= 55; minutes.push(i), i += 5);
        
        return function() {
            this.$numbers.each(function(index, element) {
                $(element).text(minutes[index]);
            });  
        };
    })();

    TimePicker.prototype.setHoursStage = function() {
        this.currentStage = "hours";    
    };
        
    TimePicker.prototype.setMinutesStage = function() {
        this.currentStage = "minutes";    
    };
    
    TimePicker.prototype.setMeridiemsStage = function() {
        this.currentStage = "meridiems";    
    };
    
    TimePicker.prototype.highlightButton = function(element) {
        this.$buttons.removeClass("selected");
        $(element).addClass("selected");
    };

    TimePicker.prototype.rotateHands = function($hand) {
        $hand = $hand || this.$minutesHand;
        
        var rotateMinuteHand = $hand.hasClass("minute"),
            times = this.getTimeComponents(),
            degrees;
        
        times.minutes = times.minutes ? times.minutes : 0;
        
        degrees = rotateMinuteHand ? 
                  (360 / 60 * +times.minutes) : 
                  (((+times.hours === 12 ? 0 : +times.hours) + (+times.minutes / 60)) * 30);
        
        $hand.css({
            "transform": "rotate(" + Math.round(degrees) + "deg)"
        });
        
        return rotateMinuteHand ? this.rotateHands(this.$hoursHand) : true;
    };

    TimePicker.prototype.getTimeComponents = function() {
        var currentTime = this.$input.val(),
            times = {hours: undefined, minutes: undefined, meridiems: undefined};

        if(currentTime.indexOf(":") !== -1) {
            currentTime = currentTime.split(":");
            times.hours = currentTime[0];
            if(currentTime[1].indexOf(" ") !== -1) {
                currentTime[1] = currentTime[1].split(" ");
                times.minutes = currentTime[1][0];
                times.meridiems = currentTime[1][1];
            } else {
                times.minutes = currentTime[1];
            }
        } else {
            times.hours = currentTime;
        }
        
        return times;
    };
    
    TimePicker.prototype.setTime = function(h, m, mer) {
        this.$input.val(h + (m ? ":" + m : "") + (mer ? " " + mer : ""));    
    };

    TimePicker.prototype.setInputHours = function(numberElement) {
        var times = this.getTimeComponents(),
            newHour = $(numberElement).text().trim();
        
        newHour = (newHour.length === 1 ? "0" : "") + newHour;
        this.setTime(newHour, times.minutes, times.meridiems);
        
        if((!times.minutes && newHour === "12") || (times.hours === newHour)) this.displayMinuteFace();
        else this.rotateHands();
    };
    
    TimePicker.prototype.setInputMinutes = function(numberElement) {
        var times = this.getTimeComponents(),
            newMinutes = $(numberElement).text().trim();
        
        newMinutes = (newMinutes.length === 1 ? "0" : "") + newMinutes;
        this.setTime(times.hours, newMinutes, times.meridiems);
        
        if(times.minutes === newMinutes) this.$meridiemsHolder.addClass("show");
        else this.rotateHands();
    };

    TimePicker.prototype.setInputMeridiem = function(element) {
        var times = this.getTimeComponents(),
            meridiem = $(element).text();
            
        this.setTime(times.hours, times.minutes, meridiem);
		this.valid = true;
        this.sendValidMessage();
    };

    TimePicker.prototype.setInput = function(value) {
        if(value) {
            this.$input.val(value);
            this.rotateHands();
            this.$buttons.enable();
            this.valid = true;
        }
    };

    return function(selector) {
        var timePicker = new TimePicker(selector);
        
        return {
            setFieldName: function(name) {
                timePicker.setFieldName.call(timePicker, name);
                return this;
            },
            
            setMessenger: function(messenger) {
                timePicker.setMessenger.call(timePicker, messenger);
                return this;
            },

            setInput: function(value) {
                timePicker.setInput.call(timePicker, value);
                return this;
            }
        };
    };
})(jQuery);

jQuery.fn.timePickerCount = 0;
jQuery.fn.timePickerAttrName = "time-picker-id";

jQuery.fn.timePicker = function(collection) {
    var self = jQuery.fn,
        $element = this.eq(0),
        id = $element.attr(self.timePickerAttrName);

    if(!id) {
        $element.attr(self.timePickerAttrName, self.timePickerCount++);
        collection[0] = TimePicker($element);
    }

    return $element;
};