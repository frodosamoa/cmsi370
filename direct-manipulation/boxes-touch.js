var BoxesTouch = {
    /**
     * Sets up the given jQuery collection as the drawing area(s).
     */
    setDrawingArea: function (jQueryElements) {
        // Set up any pre-existing box elements for touch behavior.
        jQueryElements
            .addClass("drawing-area")
            
            // Event handler setup must be low-level because jQuery
            // doesn't relay touch-specific event properties.
            .each(function (index, element) {
                element.addEventListener("touchstart", BoxesTouch.startDrag, false);
                element.addEventListener("touchmove", BoxesTouch.trackDrag, false);
                element.addEventListener("touchend", BoxesTouch.endDrag, false);
            })

            .find("div.box").each(function (index, element) {
                element.addEventListener("touchstart", BoxesTouch.startMove, false);
                element.addEventListener("touchend", BoxesTouch.unhighlight, false);
            });
    },

    /**
     * Starts a box creation as a finger draws on the drawing area.
     */
    startDrag: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            if (touch.target.creatingBox == null) {
                touch.target.initialX = touch.pageX;
                touch.target.initialY = touch.pageY;

                var tempBox = "<div id=\"" + touch.identifier + "\" class=\"box\"style=\"width: 0px; " +
                              "height: 0px; left: " + touch.pageX +
                              "px; top: " + touch.pageY + "px\"></div>";
                $("#drawing-area").append(tempBox);
                console.log($("#drawing-area > div:last-child"));

                touch.target.creatingBox = $("#" + touch.identifier);
                (touch.target.creatingBox).addClass("box-create");
            }
        });  

        // Don't do any touch scrolling.
        event.preventDefault();      
    },

    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    trackDrag: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Don't bother if we aren't tracking anything.
            if (touch.target.movingBox) {
                // Reposition the object.
                touch.target.movingBox.offset({
                    left: touch.pageX - touch.target.deltaX,
                    top: touch.pageY - touch.target.deltaY
                });

                if (touch.target.movingBox) {
                   $(touch.target).removeClass("box-highlight").addClass("box-delete");    
                } else if (is inside) {
                   $(touch.target).removeClass("box-delete").addClass("box-highlight");
                }

            // But if we are.
            } else if (touch.target.creatingBox) {
                var touchXGreater = touch.pageX > touch.target.initialX,
                    touchYGreater = touch.pageY > touch.target.initialY;

                touch.target.creatingBox = {
                    width   : touchXGreater ? touch.pageX - touch.target.initialX : touch.target.initialX - touch.pageX,
                    height  : touchYGreater ? touch.pageY - touch.target.initialY : touch.target.initialY - touch.pageY,
                    left    : touchXGreater ? touch.target.initialX : touch.pageX,
                    top     : touchYGreater ? touch.target.initialY : touch.pageY
                };

                $('#' + touch.identifier)
                        .css('width', touch.target.creatingBox.width)
                        .css('height', touch.target.creatingBox.height)
                        .css('left', touch.target.creatingBox.left)
                        .css('top', touch.target.creatingBox.top);
            }
        });
        
        // Don't do any touch scrolling.
        event.preventDefault();
    },

    /**
     * Concludes a drawing or moving sequence.
     */
    endDrag: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            if (touch.target.movingBox) {
                // Change state to "not-moving-anything" by clearing out
                // touch.target.movingBox.
                touch.target.movingBox = null;
            } else if (touch.target.creatingBox) {
                // Remove id field since we don't need the touch.identifier anymore.
                $('#' + touch.identifier)
                        .removeClass('box-create')
                        .removeAttr('id');

                $("#drawing-area").find("div.box").each(function (index, element) {
                    element.addEventListener("touchstart", BoxesTouch.startMove, false);
                    element.addEventListener("touchend", BoxesTouch.unhighlight, false);
                });

                // Change state to "not-creating-anything" by clearing out
                // touch.target.creating.
                touch.target.creatingBox = null;
            }
        });
    },

    /**
     * Indicates that an element is unhighlighted.
     */
    unhighlight: function () {
        $(this).removeClass("box-highlight");
    },

    /**
     * Begins a box move sequence.
     */
    startMove: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Highlight the element.
            $(touch.target).addClass("box-highlight");

            // Take note of the box's current (global) location.
            var jThis = $(touch.target),
                startOffset = jThis.offset();

            // Set the drawing area's state to indicate that it is
            // in the middle of a move.
            touch.target.movingBox = jThis;
            touch.target.deltaX = touch.pageX - startOffset.left;
            touch.target.deltaY = touch.pageY - startOffset.top;
        });
        // Eat up the event so that the drawing area does not
        // deal with it.
        event.stopPropagation();
    }

};