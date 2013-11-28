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

    color: "blue" || "red" || "purple" || "green" || "light" || "dark"
    -the default is light if no color is assigned.

*/

(function ($) {
    // Default values stored as "constants".
    var defaults = {
            width   : 40,
            height  : 150,
            shape   : "square",
            color   : "light"
        },

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
            leftActive = false,

            // Margin lengths and widths.
            rightMargin = 3, 
            leftMargin = 3,
            topMargin = 3,
            bottomMargin = 3,

            // Left and right values.
            leftValue = options.values ? (options.values.left || "Left") : "Left",
            rightValue = options.values ? (options.values.right || "Right") : "Right",

            // Which side is active.
            leftInitialActiveSide = options.activeSide ? options.activeSide === "left" : true,
            leftActive = leftInitialActiveSide,

            // Shape of the switch.
            shape = options.shape ? options.shape : defaults.shape,

            // Color of the switch.
            color = options.color ? options.color : defaults.color,
            backgroundColor,
            switchColor,
            fontColor,

            // Height and width of our switch.
            height = options.height ? options.height : defaults.width,
            width = options.width ? options.width: defaults.height,

            // Using templates to create clone of each div or p.
            $leftValue = $leftValueTemplate.clone(),
            $rightValue = $rightValueTemplate.clone()
            $switcherClone = $switcher.clone(),

            snapSide = function (event, move) {
                // Make sure we are tracking a switch.
                if ($current) {
                    var transform = event.pageX - anchorX,
                        maxTranslate = $current.parent().width() - $current.width(),
                        middlePoint = $current.parent().width() / 4,
                        newCSS;

                    if (transform === 0) {
                        transform = leftActive ? maxTranslate - rightMargin : leftMargin;
                    } else if (transform < middlePoint) {
                        transform = leftMargin;
                    } else if (transform > middlePoint) {
                        transform = maxTranslate - rightMargin;
                    }

                    leftActive = !leftActive;
                    newCSS = "translate(" + transform + "px)";

                    $current.css({
                        "transform" : newCSS,
                        "-moz-transform" : newCSS,
                        "-webkit-transform": newCSS
                    });

                    // Reset state variables.
                    anchorX = 0;
                    $current = null;
                }
            };


        // Set the width, height, shape, and color for the drag-select.
        $this.css({
            "width": width,
            "height": height,
            "border-radius": shape === "round" ? (height / 2) : 3 
        });

        // Put in the values into the div templates.
        $leftValue.text(leftValue);
        $rightValue.text(rightValue);

        // Append the right value, left value, and the selector to our drag select div.
        $this.addClass("drag-select")
            .append($leftValue, $rightValue, $switcherClone);

        // Values used for centering values vertically and horizontally.
        var innerHeight = $this.innerHeight(),
            innerWidth = $this.innerWidth(),
            rightValueWidth = $this.find(".right").width(),
            rightValueHeight = $this.find(".right").height(),
            leftValueWidth = $this.find(".left").width(),
            leftValueHeight = $this.find(".left").height(),
            fourthInnerWidth = (innerWidth / 4),
            halfInnerHeight = (innerHeight / 2);

        // Center the right and left values vertically. 
        $this.find(".left")
            .css("margin-top", halfInnerHeight - (leftValueHeight / 2))
            .css("margin-left", fourthInnerWidth - (leftValueWidth / 2))
            .css("color", fontColor);
        $this.find(".right")
            .css("margin-top", halfInnerHeight - (rightValueHeight / 2))
            .css("margin-left", (fourthInnerWidth * 3) - (rightValueWidth / 2))
            .css("color", fontColor);

        var newCSS = "translate(" + (leftActive ? leftMargin : (innerWidth - (innerWidth / 2) - rightMargin)) + "px)";

        // Make the switch be as close as possible to the edges and set it to the default value.
        $this.find(".switcher").css({
            "height": innerHeight - topMargin - bottomMargin,
            "width": (innerWidth/ 2),
            "border-radius": shape === "round" ? (height / 2) : 3,
            "background": switchColor,
            "transform" : newCSS,
            "margin-top" : topMargin,
            "-moz-transform" : newCSS,
            "-webkit-transform": newCSS
        });



        // Depeding on what the user provided, assign the colors.
        switch (color) {
            case "red":
                $this.addClass("red-drag-select");
                $this.find(".switcher").addClass("red-switcher");
                $this.find(".left").addClass("red-font");
                $this.find(".right").addClass("red-font");
                break;
            case "blue":
                $this.addClass("blue-drag-select");
                $this.find(".switcher").addClass("blue-switcher");
                $this.find(".left").addClass("blue-font");
                $this.find(".right").addClass("blue-font");
                break;
            case "green":
                $this.addClass("green-drag-select");
                $this.find(".switcher").addClass("green-switcher");
                $this.find(".left").addClass("green-font");
                $this.find(".right").addClass("green-font");
                break;
            case "purple":
                $this.addClass("purple-drag-select");
                $this.find(".switcher").addClass("purple-switcher");
                $this.find(".left").addClass("purple-font");
                $this.find(".right").addClass("purple-font");
                break;
            case "light":
                $this.addClass("light-drag-select");
                $this.find(".switcher").addClass("light-switcher");
                $this.find(".left").addClass("light-font");
                $this.find(".right").addClass("light-font");
                break;
            case "dark":
                $this.addClass("dark-drag-select");
                $this.find(".switcher").addClass("dark-switcher");
                $this.find(".left").addClass("dark-font");
                $this.find(".right").addClass("dark-font");
                break;
        }


        // If we click on a switch...
        $this.find(".switcher")
            .mousedown(function (event) {
                $current = $this.find(".switcher");
                anchorX = event.pageX;
            })
            .mouseup(snapSide);

        $(document)
            .mousemove(function (event) {
                if ($current) {
                    // Hold left and right values.
                    var transform = event.pageX - anchorX,
                        maxTranslate = $current.parent().width() - $current.width(),
                        newCSS;

                    if (leftActive) {
                        transform = anchorX - event.pageX; 
                    }

                    if (transform < leftMargin) {
                        transform = leftMargin;
                    } else if (transform > maxTranslate - rightMargin) {
                        transform = maxTranslate - rightMargin;

                    }

                    if (!leftActive) {
                        leftActive = !leftActive;
                    }

                    newCSS = "translate(" + transform + "px)";

                    $current.css({
                        "transform" : newCSS,
                        "-moz-transform" : newCSS,
                        "-webkit-transform": newCSS
                    });
                }
            })

            // If we let go of a click, not on a switch...
            .mouseup(snapSide);
        
    };
}(jQuery));