/*
  A sample jQuery plug-in: this one converts the selected elements into a 3D
  “swivel” control.

  This plugin's options object can include:

    change: function () { }
    - Callback for whenever the control has been manipulated.
*/
(function ($) {
    // Private plugin helpers.
    $.fn.dragSelect = function (options) {
        var $this = this,
            $current = null,
            left = options.values ? (options.values.left || "Left") : "Left",
            right = options.values ? (options.values.right || "Right") : "Right";
            console.log(options)

        $this.addClass("drag-select")
            .mousedown(function (event) {
                $current = $(this);
            });

        $(document)
            .mousemove(function (event) {
                if ($current) {
                    
                }
            })
            .mouseup(function (event) {
                $current = null;
            });

    };
}(jQuery));
