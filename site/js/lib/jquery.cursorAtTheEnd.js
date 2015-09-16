jQuery.fn.putCursorAtEnd = function() {
    return this.each(function() {
        $(this).focus()
        if (this.setSelectionRange) {
            var len = $(this).val().length * 2;
            this.setSelectionRange(len, len);
        }
        else {
            $(this).val($(this).val());
        }
        this.scrollTop = 999999;
    });
};