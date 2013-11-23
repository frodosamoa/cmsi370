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

        // Put in the values into the div templates.
        $leftActiveField.text(leftValue);
        $rightActiveField.text(rightValue);
        $leftUnactiveField.text(leftValue);
        $rightUnactiveField.text(rightValue);

        // Append the right value, left value, and the selector to our drag select div.
        $this.addClass("drag-select")
            .append($leftActiveField, $leftUnactiveField,
                    $rightActiveField, $rightUnactiveField,
                    $switcherClone);

        var leftMarginTop = -($this.find(".leftActive").height() / 2),
            rightMarginTop = -($this.find(".rightActive").height() / 2),
            sideMargin = ($this.innerWidth() / 4);

        // Center the right and left values vertically. 
        $this.find(".leftActive, .leftUnactive")
            .css("margin-top",leftMarginTop)
            .css("left", sideMargin - ($this.find(".leftActive").width() / 2));
        $this.find(".rightActive, .rightUnactive")
            .css("margin-top", rightMarginTop)
            .css("right", sideMargin - ($this.find(".rightActive").width() / 2));

        // Make the switch be as close as possible to the edges.
        $this.find(".switcher")
            .css("height", $this.innerHeight() - (parseInt($this.css("padding-top")) * 2))
            .css("width", ($this.innerWidth() / 2))

        $this.click(function () {
            var switchClicked = $this.find(".switcher");
            if (switchClicked.css("left")) {
                switchClicked.css("right", parseInt($this.css("padding-left")))
            } else if (switchClicked.css("right"))
            $this.find(".switcher").css("left", parseInt($this.css("padding-left")));            
        })

        $this.find(".switcher")
            .mousedown(function (event) {
                $current = $(this);
            });

        $(document)
            .mousemove(function (event) {
                if ($current) {
                    $current.css("left", (event.screenX % $current.width()));
                }
            })
            .mouseup(function (event) {
                $current = null;
            });

    };
}(jQuery));
