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
    // Default values stored as "constants".
    var DEFAULT_WIDTH = 40,
        DEFAULT_HEIGHT = 150,
        DEFAULT_SHAPE = "square",
        DEFAULT_COLOR = "white",

        // Color values.
        BLUE = {
            background : "#1589FF",
            switcher   : "#82CAFF",
            font       : "#1029CC"
        },
        RED = {
            background : "#AD0C2F",
            switcher : "#ED3B62",
            font : "#610B23"
        }
        GREEN = {
            background : "#1A871D",
            switcher : "#24D62A",
            font : "#0B610E"
        }
        PURPLE = {
            background : "#4D1C9C",
            switcher : "#875CCC",
            font : "#A87ACF"
        }
        LIGHT = {
            background : "#D0D0D0",
            switcher : "#FFFFFF",
            font : "#454545"
        }
        DARK = {
            background : "#505050",
            switcher : "#808080",
            font : "#C7C7C7"
        }

        // Templates for the right and left values of the switch.
        $leftValueTemplate = $("<p class=\"left\"></p>"),
        $rightValueTemplate = $("<p class=\"right\"></p>"),
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
            shape = options.shape ? options.shape : DEFAULT_SHAPE,

            // Color of the switch.
            color = options.color ? options.color : DEFAULT_COLOR,
            backgroundColor,
            switchColor,
            fontColor,

            // Height and width of our switch.
            height = options.height ? options.height : DEFAULT_WIDTH,
            width = options.width ? options.width: DEFAULT_HEIGHT,

            // Using templates to create clone of each div or p.
            $leftValue = $leftValueTemplate.clone(),
            $rightValue = $rightValueTemplate.clone()
            $switcherClone = $switcher.clone();


        switch (color) {

            case "red":
                backgroundColor = RED.background;
                switchColor = RED.switcher;
                fontColor = RED.font;
            break;

            case "blue":
                backgroundColor = BLUE.background;
                switchColor = BLUE.switcher;
                fontColor = BLUE.font;
            break;

            case "green":
                backgroundColor = GREEN.background;
                switchColor = GREEN.switcher;
                fontColor = GREEN.font;
            break;

            case "purple":
                backgroundColor = PURPLE.background;
                switchColor = PURPLE.switcher;
                fontColor = PURPLE.font;
            break;

            case "light":
                backgroundColor = LIGHT.background;
                switchColor = LIGHT.switcher;
                fontColor = LIGHT.font;
            break;

            case "dark":
                backgroundColor = DARK.background;
                switchColor = DARK.switcher;
                fontColor = DARK.font;
            break;
        }

        // Set the width, height, shape, and color for the drag-select.
        $this
            .css("width", width).css("height", height)
            .css("border-radius", shape === "round" ? (height / 2) : 3)
            .css("background", backgroundColor)
            .css("border-color", backgroundColor);


        // Put in the values into the div templates.
        $leftValue.text(leftValue);
        $rightValue.text(rightValue);

        // Append the right value, left value, and the selector to our drag select div.
        $this.addClass("drag-select")
            .append($leftValue, $rightValue, $switcherClone);

        // Values used for centering values vertically and horizontally.
        var innerHeight = $this.innerHeight(),
            innerWidth = $this.innerWidth(),
            centerValueMargin = -($this.find(".left").height() / 2),
            topBottomPadding = parseInt($this.css("padding-top")),
            leftPadding = parseInt($this.css("padding-left")),
            rightPadding = parseInt($this.css("padding-right")),
            fourthInnerWidth = (innerWidth / 4);

        // Center the right and left values vertically. 
        $this.find(".left")
            .css("margin-top", centerValueMargin)
            .css("left", fourthInnerWidth - ($this.find(".left").width() / 2))
            .css("color", fontColor);
        $this.find(".right")
            .css("margin-top", centerValueMargin)
            .css("right", fourthInnerWidth - ($this.find(".right").width() / 2))
            .css("color", fontColor);

        // Make the switch be as close as possible to the edges and set it to the default value.
        $this.find(".switcher")
            .css("height", innerHeight - (topBottomPadding * 2))
            .css("width", ((innerWidth - leftPadding - rightPadding)/ 2))
            .css("left", leftInitialActiveSide ? leftPadding : "auto")
            .css("right", leftInitialActiveSide ? "auto" : rightPadding)
            .css("border-radius", shape === "round" ? (height / 2) : 3)
            .css("background", switchColor)
            .css("border-color", switchColor);

        $this.click(function() {
            var switchClicked = $this.find(".switcher"),
                leftCSS = switchClicked.css("left"),
                rightCSS = switchClicked.css("right"),
                leftActive = rightCSS === "auto",
                rightActive = leftCSS === "auto";

            switchClicked
                .css("left", leftActive ? "auto" : leftPadding)
                .css("right", rightActive ? "auto" : leftPadding);
        })

        $this.find(".switcher")
            .mousedown(function (event) {
                $current = $this.find(".switcher");
                rightClicked = $current.css("left") === "auto";
                anchorX = event.pageX;
            })

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
                        snapSide;

                    if (leftCSS === "auto") {
                        snapSide = false;
                    } else if (rightCSS === "auto") {
                        snapSide = true;
                    } else {
                        snapSide = parseInt(leftCSS) > parseInt(rightCSS);
                    }

                    $current.css("right", snapSide ? "auto" : rightPadding)
                        .css("left", snapSide ? leftPadding : "auto");

                    // Reset current and rightClicked.
                    anchorX = 0;
                    rightClicked = false;
                    $current = null;
                }
            });
        
    };
}(jQuery));