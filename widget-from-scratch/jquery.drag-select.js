/*
  A sample jQuery plug-in: this one converts the selected elements into a 3D
  “swivel” control.

  This plugin's options object can include:

    change: function () { }
    - Callback for whenever the control has been manipulated.
*/
(function ($) {

    // Templates for the right and left values of the switch.
    var $leftActiveTemplate = $("<div class=\"leftActive\"></div>"),
        $rightActiveTemplate = $("<div class=\"rightActive\"></div>"),
        $leftUnactiveTemplate = $("<div class=\"leftUnactive\"></div>"),
        $rightUnactiveTemplate = $("<div class=\"rightUnactive\"></div>")
        $switcher = $("<div class=\"switcher\"></div>");

    // Private plugin helpers.
    $.fn.dragSelect = function (options) {
        var $this = this,
            $current = null,
            leftValue = options.values ? (options.values.left || "Left") : "Left",
            rightValue = options.values ? (options.values.right || "Right") : "Right",
            $leftActiveField = $leftActiveTemplate.clone(),
            $rightActiveField = $rightActiveTemplate.clone()
            $leftUnactiveField = $leftUnactiveTemplate.clone(),
            $rightUnactiveField = $rightUnactiveTemplate.clone();
            $switcherClone = $switcher.clone();

        // Put in the user defined values into the divs.
        $leftActiveField.text(leftValue);
        $rightActiveField.text(rightValue);
        $leftUnactiveField.text(leftValue);
        $rightUnactiveField.text(rightValue);

        // Append the right value, left value, and the selector to our drag select div.
        $this.addClass("drag-select")
            .append($leftActiveField, $rightActiveField,
                    $leftUnactiveField, $rightUnactiveField,
                    $switcherClone);


        var leftMarginTop = -($this.find(".leftValue").height() / 2),
            rightMarginTop = -($this.find(".rightValue").height() / 2),
            sideMargin = ($this.find(".switcher").width() / 4);

        // Center the right and left values vertically. 
        $this.find(".leftActive, .leftUnactive")
            .css("margin-top",leftMarginTop)
            .css("left", sideMargin);
        $this.find(".rightActive, .rightUnactive")
            .css("margin-top", rightMarginTop)
            .css("right", sideMargin);

        // Make the switch be as close as possible to the edges.
        $this.find(".switcher")
            .css("height", $this.innerHeight() - (parseInt($this.css("padding-top")) * 2));

        // $this.find(".selector").css("width", Math.max(left.width(), right.width()))

        $this.find(".switcher")
            .mousedown(function (event) {
                $current = $(this);
                $current.css("right", 50);
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
