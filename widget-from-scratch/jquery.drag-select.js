/*
  A sample jQuery plug-in: this one converts the selected elements into a 3D
  “swivel” control.

  This plugin's options object can include:

    change: function () { }
    - Callback for whenever the control has been manipulated.
*/
(function ($) {

    // Templates for the right and left values of the switch.
    var $leftTemplate = $("<div id=\"left\" class=\"leftValue\"></div>"),
        $rightTemplate = $("<div id=\"right\" class=\"rightValue\"></div>");
        $selector = $("<div class=\"selector\"></div>")

    // Private plugin helpers.
    $.fn.dragSelect = function (options) {
        var $this = this,
            $current = null,
            leftValue = options.values ? (options.values.left || "Left") : "Left",
            rightValue = options.values ? (options.values.right || "Right") : "Right",
            $leftField = $leftTemplate.clone(),
            $rightField = $rightTemplate.clone();
            $selector = $selector.clone();

        // Put in the user defined values into the divs.
        $leftField.text(leftValue);
        $rightField.text(rightValue);

        // Append the right value, left value, and the selector to our drag select div.
        $this.addClass("drag-select").append($leftField, $rightField, $selector);

        $this.find(".selector")
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
