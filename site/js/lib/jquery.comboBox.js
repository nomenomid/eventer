/* globals WidgetCommon _ */

var ComboBox = (function($) {
    function ComboBox(selector, placeholder) {
        if(!selector) throw Error("Specify selector for ComboBox widget.");
        this.$comboBox = $(selector).empty().addClass("comboBox");
        this.placeholder = placeholder || "Name";
        this.init();
    }
    
    $.extend(ComboBox.prototype, WidgetCommon);
    
    ComboBox.prototype.init = function() {
        var self = this;
        
        this.$comboBox.append(
            '<div class = "cover"></div>' +
            '<div class = "clearSelection"></div>' +
            '<input type = "text" placeholder = "' + this.placeholder + '" />' +
            '<span tabindex = "1"></span>' +
            '<div class = "listHolder"><ul></ul></div>'
        );
        
        this.$input = this.$comboBox.find("input"),
        this.$list = this.$comboBox.find(".listHolder ul"),
        this.$clearSelection = this.$comboBox.find(".clearSelection"),
        this.$items = this.$list.find("li");
        
        this.$clearSelection.click(function() {
            $(this).removeClass("show");
            self.$input.val("");
            self.sendInvalidMessage();
        });

        this.$input.keyup(function() {
            if(!self.$comboBox.hasClass("show")) self.$comboBox.addClass("show");
            self.filterItems();
            self.trackInputChanges();
        });
        
        this.$input.click(function() {
            self.$comboBox.addClass("show");  
            self.filterItems();
        });
        
        this.$input.blur(function() {
            setTimeout(function() {
                self.$comboBox.removeClass("show");
                if(self.$input.val().trim().length > 0) self.$clearSelection.addClass("show");
            }, 250);
        }); 
    };
    
    ComboBox.prototype.itemClickHandler = function(self) {
        return function() {
            self.$clearSelection.addClass("show");
            self.$input.val($(this).text());
            self.$comboBox.removeClass("show");
            self.sendValidMessage();
        };
    };
    
    ComboBox.prototype.filterItems = function(value) {
        value = value || this.$input.val().trim();
        this.$items.removeClass("hidden");
        this.$items.filter(function() {
            return $(this).text().toLowerCase().indexOf(value.toLowerCase()) !== 0;
        }).addClass("hidden");    
    };
    
    ComboBox.prototype.hasExact = function(value) {
        return this.$items.filter(function() {
            return $(this).text().toLowerCase() === value.toLowerCase();
        }).length > 0;  
    };
    
    ComboBox.prototype.sortItems = function() {
        this.$items.detach().sort(jqueryComparators.textSort()).appendTo(this.$list);
    };
    
    ComboBox.prototype.trackInputChanges = function() {
        var value = this.$input.val().trim();
        if(value.length === 0) {
            this.sendInvalidMessage();
            if(this.$clearSelection.hasClass("show")) this.$clearSelection.removeClass("show");
        } else {
            if(this.hasExact(value)) this.sendUniqueInput();
            this.sendValidMessage();
        }
    };
    
    ComboBox.prototype.addItem = function($item) {
        $item = $($item);
        $item.click(this.itemClickHandler(this));
        this.$list.append($item);
        this.$items = this.$list.find("li");
        this.sortItems();
        this.filterItems();
    };
    
    ComboBox.prototype.clearInput = function() {
        this.$input.val("");
        this.$clearSelection.removeClass("show");
		this.sendInvalidMessage();
    };
    
    ComboBox.prototype.setInput = function(value) {
        if(value) {
            this.$input.val(value);
            this.$clearSelection.addClass("show");
            this.sendValidMessage();
        }
    }
    
    return function(selector, placeholder) {
        var comboBox = new ComboBox(selector, placeholder);
        return {
            addItem: function($item) {
                comboBox.addItem.call(comboBox, $item);
                return this;
            },
            
            sortItems: function() {
                comboBox.sortItems.call(comboBox);
                return this;
            },
            
            clearInput: function() {
                comboBox.clearInput.call(comboBox);
                return this;
            },
            
            setInput: function(value) {
                comboBox.setInput.call(comboBox, value);
                return this;
            },
            
            setMessenger: function(messenger) {
                comboBox.setMessenger.call(comboBox, messenger);
                return this;
            },
            
            setFieldName: function(name) {
                comboBox.setFieldName.call(comboBox, name);
                return this;
            }
        };
    };
}(jQuery));

jQuery.fn.comboBoxCount = 0;
jQuery.fn.comboBoxAttrName = "combobox-id";

jQuery.fn.comboBox = function(collection, placeholder) {
    var self = jQuery.fn,
        $element = this.eq(0),
        id = $element.attr(self.comboBoxAttrName);

    if(!id) {
        $element.attr(self.comboBoxAttrName, self.comboBoxCount++);
        collection[0] = ComboBox($element, placeholder);
    }

    return $element;
};