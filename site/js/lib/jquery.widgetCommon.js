var WidgetCommon = {
    sendMessage: function(message) {
        this.messenger.trigger("message", message);
    },

    sendValidMessage: function() {
        if(!this.messenger) return;
        
        var self = this;
        this.sendMessage({
            fieldName: self.fieldName,
            valid: true,
    		value: self.$input.val().trim()
        }); 
    },
    
    sendInvalidMessage: function() {
        if(!this.messenger) return;
        
        var self = this;
        this.sendMessage({
            fieldName: self.fieldName,
            valid: false,
            value: self.$input.val().trim()
        });
    },
    
    sendUniqueInput: function() {
        if(!this.messenger) return;
        
        var self = this;
        this.sendMessage({
            fieldName: self.fieldName,
            uniqueInput: true,
            value: self.$input.val().trim()
        });
    },
    
    setInput: function(value) {
        if(value) this.$input.val(value);
    },
        
    setMessenger: function(messenger) {
        this.messenger = messenger;    
    },
        
    setFieldName: function(name) {
        this.fieldName = name;    
    }
};