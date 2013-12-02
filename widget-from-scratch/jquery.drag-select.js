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

        // Templates for the right and left values, and the switch.
        $leftValueTemplate = $("<p class=\"left\"></p>"),
        $rightValueTemplate = $("<p class=\"right\"></p>"),
        $switcher = $("<div class=\"switcher\"></div>");

    // Private plugin helpers.
    $.fn.dragSelect = function (options) {
        // State variables.
        var $current = null,
            anchorX = 0,
            leftActive = false,
            currentTranslate = 0,

            // Switch margin.
            switchMargin = 3, 

            // Left and right values.
            leftValue = options.values ? (options.values.left || "Left") : "Left",
            rightValue = options.values ? (options.values.right || "Right") : "Right",

            // Which side is active.
            leftActive = options.activeSide ? options.activeSide === "left" : options.activeSide !== "left",

            // Shape of the switch.
            shape = options.shape ? options.shape : defaults.shape,

            // Color of the switch.
            color = options.color ? options.color : defaults.color,
            dragSelectColor = "drag-select-" + color,
            switcherColor = "switcher-" + color,
            fontColor = "font-" + color,

            // Height and width of our switch.
            height = options.height ? options.height : defaults.width,
            width = options.width ? options.width: defaults.height,

            // Clones of templates.
            $leftValue = $leftValueTemplate.clone(),
            $rightValue = $rightValueTemplate.clone(),
            $switcherClone = $switcher.clone(),

            // Snaps the switch to a specific side.
            snapSide = function (event) {
                // Make sure we are tracking a switch.
                if ($current) {
                    var transform = event.pageX - anchorX + currentTranslate,
                        maxTranslate = $current.parent().width() - $current.width(),
                        middlePoint = $current.parent().innerWidth() / 4;

                    if (event.pageX === anchorX) {
                        transform = leftActive ? (maxTranslate - switchMargin) : switchMargin;
                    } else if (transform < middlePoint) {
                        transform = switchMargin;
                    } else if (transform > middlePoint) {
                        transform = maxTranslate - switchMargin;
                    }

                    // If the switch changed sides, change the active variable.
                    if ((leftActive && (transform === (maxTranslate - switchMargin))) || 
                       ((!leftActive) && transform === switchMargin)) {
                        leftActive = !leftActive;
                    }

                    translateSwitch($current, transform);
                    
                    // Reset state variables.
                    transform = 0;
                    anchorX = 0;
                    $current = null;
                }
            },

            // Mouse down event helper function.
            startMouseDown = function (switcher, clickX, switcherTranslate) {
                $current = switcher;
                anchorX = clickX;
                currentTranslate = switcherTranslate;
            },

            // Gets the translate from the transform matrix of a switch.
            getTranslate = function (switcher) {
                var matrix = switcher.css("-webkit-transform") ||
                    switcher.css("-moz-transform") ||
                    switcher.css("transform"),
                    translate = 0;
                if (matrix !== 'none') {
                    translate = Number(matrix.split('(')[1].split(')')[0].split(', ')[4]);
                } 
                return translate;
            },

            // Translates a switch.
            translateSwitch = function (switcher, transform) {
                var newCSS = "translate(" + transform + "px)";

                switcher.css({
                    "transform" : newCSS,
                    "-moz-transform" : newCSS,
                    "-webkit-transform": newCSS
                });
            };


        // Set the width, height, and shape for the drag-select.
        this.addClass(dragSelectColor)
            .css({
                "width": width,
                "height": height,
                "border-radius": shape === "round" ? (height / 2) : 3 
            })
            .mousedown(function (event) {
                startMouseDown(switcher, event.pageX, getTranslate(switcher))
            });

        // Put the right and left values into their templates.
        $leftValue.text(leftValue);
        $rightValue.text(rightValue);

        // Append the right value, left value, and the switcher to our drag select div.
        this.addClass("drag-select")
            .append($leftValue, $rightValue, $switcherClone);

        // Values used for centering values vertically and horizontally.
        var switcher = this.find(".switcher"),
            currentRight = this.find(".right"),
            currentLeft = this.find(".left"),
            innerHeight = this.innerHeight(),
            innerWidth = this.innerWidth(),
            rightValueWidth = currentRight.width(),
            rightValueHeight = currentRight.height(),
            leftValueWidth = currentLeft.width(),
            leftValueHeight = currentLeft.height(),
            fourthInnerWidth = (innerWidth / 4),
            halfInnerHeight = (innerHeight / 2);

        // Center the right and left values vertically and horizontally. 
        this.find(".left")
                .addClass(fontColor)
                .css({
                    "margin-top": halfInnerHeight - (leftValueHeight / 2),
                    "margin-left": fourthInnerWidth - (leftValueWidth / 2)
                })
                .mousedown(function (event) {
                    if (leftActive) {
                        startMouseDown(switcher, event.pageX, getTranslate(switcher));
                    }
                });

        this.find(".right")
                .addClass(fontColor)
                .css({
                    "margin-top": halfInnerHeight - (rightValueHeight / 2),
                    "margin-left": (fourthInnerWidth * 3) - (rightValueWidth / 2)
                })
                .mousedown(function (event) {
                    if (!leftActive) {
                        startMouseDown(switcher, event.pageX, getTranslate(switcher));
                    }
                });

        // Inital transform for the switcher.
        var initalTransform = leftActive ? switchMargin : (innerWidth - (innerWidth / 2)),
            initialCSS = "translate(" + initalTransform + "px)";

        // Make the switch be as close as possible to the edges and set it to the default value.
        switcher.addClass(switcherColor)
                .css({
                    "height": innerHeight - (2 * switchMargin),
                    "width": (innerWidth/ 2) - switchMargin,
                    "border-radius": shape === "round" ? (height / 2) : 3,
                    "margin-top" : switchMargin,
                    "transform" : initialCSS,
                    "-moz-transform" : initialCSS,
                    "-webkit-transform": initialCSS
                })
                .mousedown(function (event) {
                    startMouseDown(switcher, event.pageX, getTranslate(switcher));
                });

        $(document)
            .mousemove(function (event) {
                if ($current) {
                    // Hold left and right values.
                    var transform = event.pageX - anchorX + currentTranslate,
                        maxTranslate = $current.parent().width() - $current.width();

                    // Keep the switch bounded inside the drag select.
                    if (transform < switchMargin) {
                        transform = switchMargin;
                    } else if (transform > maxTranslate - switchMargin) {
                        transform = maxTranslate - switchMargin;
                    }

                    // Translate the switch.
                    translateSwitch($current, transform);
                }
            })
            .mouseup(snapSide);  
    };


    $.fn.dragSelect.flickSwitch = function (side) {
        console.log(this);
    };
}(jQuery));