/*
  A sample jQuery plug-in: this one converts the selected elements into a 3D
  “swivel” control.

  This plugin's options object can include:

    change: function () { }
    - Callback for whenever the control has been manipulated.


*/
(function ($) {

    // Templates for the right and left values of the switch.
    var $leftActiveTemplate = $("<p class=\"leftActive\"></p>"),
        $rightActiveTemplate = $("<p class=\"rightActive\"></p>"),
        $leftUnactiveTemplate = $("<p class=\"leftUnactive\"></p>"),
        $rightUnactiveTemplate = $("<p class=\"rightUnactive\"></p>")
        $switcher = $("<div class=\"switcher\"></div>");

    // Private plugin helpers.
    $.fn.dragSelect = function (options) {
        var $this = this,
            $current = null,
            leftValue = options.values ? (options.values.left || "Left") : "Left",
            rightValue = options.values ? (options.values.right || "Right") : "Right",
            // activeSide = options.activeSide ? ;
            $leftActiveField = $leftActiveTemplate.clone(),
            $rightActiveField = $rightActiveTemplate.clone()
            $leftUnactiveField = $leftUnactiveTemplate.clone(),
            $rightUnactiveField = $rightUnactiveTemplate.clone();
            $switcherClone = $switcher.clone(),
            anchorX = 0,
            rightClicked = false;

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
            leftPadding = parseInt($this.css("padding-left")),
            rightPadding = parseInt($this.css("padding-right")),
            sideMargin = ($this.innerWidth() / 4);

        // Center the right and left values vertically. 
        $this.find(".leftActive, .leftUnactive")
            .css("margin-top",leftMarginTop)
            .css("left", sideMargin - ($this.find(".leftActive").width() / 2));
        $this.find(".rightActive, .rightUnactive")
            .css("margin-top", rightMarginTop)
            .css("right", sideMargin - ($this.find(".rightActive").width() / 2));

        // Make the switch be as close as possible to the edges and set it to the default value.
        $this.find(".switcher")
            .css("height", $this.innerHeight() - (parseInt($this.css("padding-top")) * 2))
            .css("width", (($this.innerWidth() - leftPadding - rightPadding)/ 2))
            .css("left", leftPadding)
            .css("right", "auto");

        $this.click(function () {
            var switchClicked = $this.find(".switcher");
                
            if (switchClicked.css("left") === "auto" && parseInt(switchClicked.css("right")) === rightPadding) {
                switchClicked.css("right", "auto").css("left", leftPadding);
            } else if (switchClicked.css("right") === "auto" && parseInt(switchClicked.css("left")) === leftPadding) {
                switchClicked.css("right", rightPadding).css("left", "auto");
            } 
        });

        $this.find(".switcher")
            .mousedown(function (event) {
                $current = $(this);
                anchorX = event.pageX;
                rightClicked = $current.css("left") === "auto";
            });

        $(document)
            .mousemove(function (event) {
                if ($current) {
                    var parent = $current.parent(),
                        switchWidth = $current.width(),
                        left = event.pageX - anchorX,
                        right = parent.innerWidth() - left - switchWidth;


                    if (rightClicked) {
                        right = anchorX - event.pageX;
                        left = parent.innerWidth() - right - switchWidth;
                    }

                    if (left <= leftPadding) {
                        $current.css("left", leftPadding).css("right", "auto");
                    } else if (right <= rightPadding) {
                        $current.css("right", rightPadding).css("left", "auto");                       
                    } else {
                        $current.css("left", left).css("right", right);
                    }
                }
            })
            .mouseup(function (event) {
                if ($current) {
                    if (parseInt($current.css("left")) < parseInt($current.css("right"))) {
                        $current.css("right", rightPadding).css("left", "auto");
                    } else if (parseInt($current.css("left")) > parseInt($current.css("right"))) {
                        $current.css("right", "auto").css("left", leftPadding);
                    }
                }
                // Reset anchorX and current.
                rightClicked = false;
                anchorX = 0;
                $current = null;
            });
        
    };
}(jQuery));
