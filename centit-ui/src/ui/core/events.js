define(function(require) {
    require('jquery');

    var PREFIX = '$';

    var Events = {
        on: function(event, handle) {
            $(document).on(PREFIX+event, handle);
        },

        trigger: function(event) {
            var args = Array.prototype.slice.call(arguments, 1);

            return $(document).trigger(PREFIX+event, args);
        }
    };

    return Events;
});