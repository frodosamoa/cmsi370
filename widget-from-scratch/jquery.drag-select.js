/*
  A sample jQuery plug-in: this one converts the selected elements into a 3D
  “swivel” control.

  This plugin's options object can include:

    change: function () { }
    - Callback for whenever the control has been manipulated.

    shape: "round" || "square"
    - the default is square if no shape is assigned.

    activeSide: "left" || "right"
    - the default is left is no active side is assigned.

    height: integer
    - the default is 45 if no height is assigned.

    width: integer
    -the default is 150 if no width is assigned.

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
        // Variables to hold our drag-select, and state variables.
        var $this = this,
            $current = null,
            anchorX = 0,
            rightClicked = false,

            // Left and right values.
            leftValue = options.values ? (options.values.left || "Left") : "Left",
            rightValue = options.values ? (options.values.right || "Right") : "Right",

            // Which side is active.
            leftInitialActiveSide = options.activeSide ? options.activeSide === "left" : true,

            // Shape of the switch.
            shape = options.shape ? options.shape : "square",

            // Height and width of our switch.
            height = options.height ? options.height : 40,
            width = options.width ? options.width: 150,

            // Using templates to create clone of each div or p.
            $leftActiveField = $leftActiveTemplate.clone(),
            $rightActiveField = $rightActiveTemplate.clone()
            $leftUnactiveField = $leftUnactiveTemplate.clone(),
            $rightUnactiveField = $rightUnactiveTemplate.clone();
            $switcherClone = $switcher.clone();

        // Set the width, height, and shape for the drag-select.
        $this.css("width", width);
        $this.css("height", height);
        $this.css("border-radius", shape === "round" ? (height / 2) : 3);

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

        // Values used for centering values vertically and horizontally.
        var innerHeight = $this.innerHeight(),
            innerWidth = $this.innerWidth(),
            centerValueMargin = -($this.find(".leftActive").height() / 2),
            topBottomPadding = parseInt($this.css("padding-top")),
            leftPadding = parseInt($this.css("padding-left")),
            rightPadding = parseInt($this.css("padding-right")),
            fourthInnerWidth = (innerWidth / 4);

        // Center the right and left values vertically. 
        $this.find(".leftActive, .leftUnactive")
            .css("margin-top", centerValueMargin)
            .css("left", fourthInnerWidth + centerValueMargin);
        $this.find(".rightActive, .rightUnactive")
            .css("margin-top", centerValueMargin)
            .css("right", fourthInnerWidth + centerValueMargin);

        // Make the switch be as close as possible to the edges and set it to the default value.
        $this.find(".switcher")
            .css("height", innerHeight - (topBottomPadding * 2))
            .css("width", ((innerWidth - leftPadding - rightPadding)/ 2))
            .css("left", leftInitialActiveSide ? leftPadding : "auto")
            .css("right", leftInitialActiveSide ? "auto" : rightPadding)
            .css("border-radius", shape === "round" ? (height / 2) : 3);

        $this.click(function () {
            var switchClicked = $this.find(".switcher"),
                leftCSS = switchClicked.css("left"),
                rightCSS = switchClicked.css("right"),
                leftActive = rightCSS === "auto",
                rightActive = leftCSS === "auto";

            switchClicked
                .css("left", leftActive ? "auto" : leftPadding)
                .css("right", rightActive ? "auto" : rightPadding);
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
                    var leftCSS = $current.css("left"),
                        rightCSS = $current.css("right"),
                        leftGreater;

                    if (leftCSS === "auto") {
                        leftGreater = false;
                    } else if (rightCSS === "auto") {
                        leftGreater = true;
                    } else {
                        leftGreater = parseInt(leftCSS) > parseInt(rightCSS);
                    }

                    $current.css("right", leftGreater ? "auto" : rightPadding)
                        .css("left", leftGreater ? leftPadding : "auto");

                    // Reset anchorX, current, and rightClicked.
                    rightClicked = false;
                    anchorX = 0;
                    $current = null;
                }
            });
        
    };
}(jQuery));