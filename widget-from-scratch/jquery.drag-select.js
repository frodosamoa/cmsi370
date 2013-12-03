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
            width       : 40,
            height      : 150,
            shape       : "square",
            color       : "light",
            leftActive  : true
        },

        // Templates for the right and left values, and the switch.
        $leftValueTemplate = $("<p class=\"left\"></p>"),
        $rightValueTemplate = $("<p class=\"right\"></p>"),
        $switcher = $("<div class=\"switcher\"></div>");

    // Private plugin helpers.
    $.fn.dragSelect = function (options) {
        // State variables.
        var $this = this,
            $current = null,
            anchorX = 0,
            currentTranslate = 0,

            // Switch margin.
            switchMargin = 3, 

            // Left and right values.
            leftValue = options.values ? (options.values.left || "Left") : "Left",
            rightValue = options.values ? (options.values.right || "Right") : "Right",

            // Which side is active.
            leftActive = typeof(options.leftActive) !== "undefined" 
                            ? options.leftActive
                            : defaults.leftActive,

            // Shape of the drag select and switch.
            shape = options.shape ? options.shape : defaults.shape,

            // Colors.
            color = options.color ? options.color : defaults.color,
            dragSelectColor = "drag-select-" + color,
            switcherColor = "switcher-" + color,
            fontColor = "font-" + color,

            // Height and width of our drag select.
            height = options.height ? options.height : defaults.width,
            width = options.width ? options.width: defaults.height,

            // Clones of templates with values put in.
            $leftValue = $leftValueTemplate.clone().text(leftValue),
            $rightValue = $rightValueTemplate.clone().text(rightValue),
            $switcherClone = $switcher.clone(),

            // Snaps the switch to a specific side.
            snapSide = function (event) {
                // Make sure we are tracking a switch.
                if ($current) {
                    var transform = event.pageX - anchorX + currentTranslate,
                        maxTranslate = $current.parent().width() - $current.width(),
                        middlePoint = $current.parent().innerWidth() / 4;

                    if (event.pageX === anchorX) { // If the click was in the same spot...
                        transform = leftActive ? (maxTranslate - switchMargin) : switchMargin;
                    } else if (transform < middlePoint) { 
                        transform = switchMargin;
                    } else if (transform > middlePoint) {
                        transform = maxTranslate - switchMargin;
                    }

                    // Translate our switch.
                    translateSwitch($current, transform);

                    // If the switch changed sides, change the active variable.
                    if ((leftActive && (transform === (maxTranslate - switchMargin))) || 
                       ((!leftActive) && transform === switchMargin)) {
                        leftActive = !leftActive;
                    }

                    // Reset state variables.
                    $current = null;
                    anchorX = 0;
                    currentTranslate = 0;
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

                        console.log(leftActive)


        // DRAG SELECT
        // Add "drag-select" color classes. Append left value, right value, 
        // switcher. Add CSS and mousedown event.
        $this.addClass("drag-select")
            .addClass(dragSelectColor)
            .append($leftValue, $rightValue, $switcherClone)
            .css({
                "width": width,
                "height": height,
                "border-radius": shape === "round" ? (height / 2) : 3 
            })
                // .mousedown(function (event) {
                //     startMouseDown(switcher, event.pageX, getTranslate(switcher))
                // });

        // Values used for centering values vertically and horizontally and
        // for creating the switch size.
        var switcher = $this.find(".switcher"),
            right = $this.find(".right"),
            left = $this.find(".left"),
            innerHeight = $this.innerHeight(),
            innerWidth = $this.innerWidth(),
            initialSwitcherTransform = leftActive
                                        ? switchMargin 
                                        : (innerWidth - (innerWidth / 2)),
            initialSwitcherCSS = "translate(" + initialSwitcherTransform + "px)";

        // LEFT VALUE
        // Add CSS, color, and mousedown event.
        left.css({
                "margin-top": (innerHeight / 2) - (left.height() / 2),
                "margin-left": (innerWidth / 4) - (left.width() / 2)
            })
            .addClass(fontColor)
            .mousedown(function (event) {
                if (leftActive) {
                    startMouseDown(switcher, event.pageX, getTranslate(switcher));
                }
            });

        // RIGHT VALUE
        // Ass CSS, color, and mousedown event.
        right.addClass(fontColor)
            .css({
                "margin-top": (innerHeight / 2) - (right.height() / 2),
                "margin-left": ((innerWidth / 4) * 3) - (right.width() / 2)
            })
            .mousedown(function (event) {
                if (!leftActive) {
                    startMouseDown(switcher, event.pageX, getTranslate(switcher));
                }
            });

        // SWITCHER
        // Add CSS, color, and mousedown event.
        switcher.css({
                    "height": innerHeight - (2 * switchMargin),
                    "width": (innerWidth/ 2) - switchMargin,
                    "border-radius": shape === "round" ? (height / 2) : switchMargin,
                    "margin-top" : switchMargin,
                    "transform" : initialSwitcherCSS,
                    "-moz-transform" : initialSwitcherCSS,
                    "-webkit-transform": initialSwitcherCSS
                })
                .addClass(switcherColor)
                .mousedown(function (event) {
                    startMouseDown(switcher, event.pageX, getTranslate(switcher));
                });

        // Mouse move and mouse up events for the whole document.
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

}(jQuery));