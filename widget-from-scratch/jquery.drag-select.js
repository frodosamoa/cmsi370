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
// JD: Nicely-done documentation block.  Though now you probably mean
//     "switch" rather than "swivel" :)

(function ($) {
    // Default values stored as "constants".
    var defaults = { // JD: You can retain the convention of all-caps to indicate
                     //     the intention that a variable be "constant."  Of course
                     //     there is no way to enforce that in JavaScript, but the
                     //     capitalization will at least remind you of the intent
                     //     when you see the variable references elsewhere.
            width       : 40,
            height      : 150,
            shape       : "square",
            color       : "light",
            leftActive  : true
        },

        // Templates for the right and left values, and the switch.

        // JD: To eliminate the backslash, you can mix quote delimiters,
        //     e.g., '<p class="left"></p>'
        //
        //     A little more readable that way, yes?
        $leftValueTemplate = $("<p class=\"left\"></p>"),
        $rightValueTemplate = $("<p class=\"right\"></p>"),
        $switcher = $("<div class=\"switcher\"></div>");

    // Private plugin helpers.
    $.fn.dragSelect = function (options) {
        // State variables.
        var $this = this,
            $current = null,
            initialClicked = null,
            anchorX = 0,
            currentTranslate = 0,
            clickValid = false,

            // Switch margin.
            switchMargin = 3, // JD: Looks like another candidate for constant.

            // Left and right values.
            leftValue = options.values ? (options.values.left || "Left") : "Left",
            rightValue = options.values ? (options.values.right || "Right") : "Right",

            // Which side is active.
            leftActive = typeof(options.leftActive) !== "undefined" // JD: Falsy wasn't enough?
                            ? options.leftActive
                            : defaults.leftActive,

            // Shape of the drag select and switch.
            shape = options.shape ? options.shape : defaults.shape,

            // Colors.
            color = options.color ? options.color : defaults.color,
            // JD: ^^^Why not use the a || b idiom for shape and color too?

            dragSelectColor = "drag-select-" + color,
            switcherColor = "switcher-" + color,
            fontColor = "font-" + color,

            // Height and width of our drag select.
            height = options.height ? options.height : defaults.width,
            width = options.width ? options.width: defaults.height,
            // JD: ^^^Ditto a || b

            // Clones of templates with values put in.
            $leftValue = $leftValueTemplate.clone().text(leftValue),
            $rightValue = $rightValueTemplate.clone().text(rightValue),
            $switcherClone = $switcher.clone(),

            // Snaps the switch to a specific side.
            snapSide = function (event) {
                // Make sure we are tracking a switch.
                if ($current) {
                    var transform = event.pageX - anchorX + currentTranslate,
                        minTranslate = switchMargin,
                        maxTranslate = $current.parent().width() - $current.width() - switchMargin;
                        middlePoint = $current.parent().innerWidth() / 4;

                    // If the click was valid or in the same spot,
                    // translate the switch accordingly.
                    if (clickValid) {
                        transform = transform < middlePoint ? minTranslate : maxTranslate;
                    } else if (event.pageX === anchorX) {
                        transform = leftActive ? maxTranslate : minTranslate;
                    }

                    if (clickValid || event.pageX === anchorX) {
                        translateSwitch($current, transform);
                    }

                    // If the switch changed sides, change the active variable.
                    if ((leftActive && (transform === maxTranslate)) || 
                       ((!leftActive) && transform === minTranslate)) {
                        leftActive = !leftActive;
                    }

                    // Reset state variables.
                    $current, initialClicked = null;
                    anchorX = 0;
                    currentTranslate = 0;
                    clickValid = false;
                }
            },

            // Mouse down event helper function.
            startMouseDown = function (switcher, event) {
                initialClicked = event.target;
                $current = switcher;
                anchorX = event.pageX;
                currentTranslate = getTranslate(switcher);
            },

            // Gets the translate from the transform matrix of a switch.
            getTranslate = function (switcher) {
                var matrix = switcher.css("-webkit-transform") ||
                    switcher.css("-moz-transform") ||
                    switcher.css("transform"),
                    translate = 0;
                if (matrix !== 'none') {
                    // JD: Hmm, this one looks a little fragile...a regex might
                    //     be easier to read.
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
            .mousedown(function (event) {
                startMouseDown(switcher, event);
            });

        // Values used for centering values vertically and horizontally and
        // for creating the switch size.
        var switcher = $this.find(".switcher"),
            right = $this.find(".right"),
            left = $this.find(".left"),
            innerHeight = $this.innerHeight(),
            innerWidth = $this.innerWidth(),
            initialSwitcherTransform = leftActive // JD: The indentation here diverges from the others.
                                        ? switchMargin 
                                        : (innerWidth - (innerWidth / 2)),
            initialSwitcherCSS = "translate(" + initialSwitcherTransform + "px)";

        // LEFT VALUE
        // Add CSS, color, and mousedown event.
        left.addClass(fontColor)
            .css({
                "margin-top": (innerHeight / 2) - (left.height() / 2),
                "margin-left": (innerWidth / 4) - (left.width() / 2)
            });

        // RIGHT VALUE
        // Ass CSS, color, and mousedown event.
        right
            .addClass(fontColor)
            .css({
                "margin-top": (innerHeight / 2) - (right.height() / 2),
                "margin-left": ((innerWidth / 4) * 3) - (right.width() / 2)
            });

        // SWITCHER
        // Add CSS, color, and mousedown event.
        switcher
            .addClass(switcherColor)
            .css({
                "height": innerHeight - (2 * switchMargin),
                "width": (innerWidth/ 2) - switchMargin,
                "border-radius": shape === "round" ? (height / 2) : switchMargin,
                "margin-top" : switchMargin,
                "transform" : initialSwitcherCSS,
                "-moz-transform" : initialSwitcherCSS,
                "-webkit-transform": initialSwitcherCSS
            });

        // Mouse move and mouse up events for the whole document.
        $(document)
            .mousemove(function (event) {
                if ($current) {
                    // Hold left and right values.
                    var transform = event.pageX - anchorX + currentTranslate,
                        minTranslate = switchMargin,
                        maxTranslate = $current.parent().width() - $current.width() - switchMargin;
                    
                    // Sees if a click is valid, clicked on elements on the
                    // side where the switcher is or on the switch itself.
                    clickValid = (leftActive && (initialClicked === left[0])) ||
                                 (!leftActive && (initialClicked === right[0])) ||
                                 initialClicked === switcher[0];

                    // Keep the switch bounded inside the drag select.
                    if (clickValid) {
                        if (transform < minTranslate) {
                            transform = minTranslate;
                        } else if (transform > maxTranslate) {
                            transform = maxTranslate;
                        }

                        translateSwitch($current, transform);
                    } 
                }
            })
            .mouseup(snapSide); // JD: Nice choice.
    };

}(jQuery));