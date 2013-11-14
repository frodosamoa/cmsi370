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
            if (touch.target.createdBox == null) {
                touch.target.createdBox = {initialX: touch.pageX, initialY: touch.pageY};
                var tempBox = "<div id=\"" + touch.identifier + "\" class=\"box\"style=\"width: 0px; " +
                              "height: 0px; left: " + touch.pageX +
                              "px; top: " + touch.pageY + "px\"></div>";
                $("#drawing-area").append(tempBox);
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
                console.log(touch.target.movingBox);
                // Reposition the object.
                touch.target.movingBox.offset({
                    left: touch.pageX - touch.target.deltaX,
                    top: touch.pageY - touch.target.deltaY
                });

            // But if we are.
            } else if (touch.target.createdBox) {
                console.log($('#' + touch.identifier));
                touch.target.createdBox = {
                    initialX : touch.target.createdBox.initialX,
                    initialY : touch.target.createdBox.initialY,
                    width   : touch.pageX > touch.target.createdBox.initialX ? touch.pageX - touch.target.createdBox.initialX : touch.target.createdBox.initialX - touch.pageX,
                    height  : touch.pageY > touch.target.createdBox.initialY ? touch.pageY - touch.target.createdBox.initialY : touch.target.createdBox.initialY - touch.pageY,
                    left    : touch.pageX > touch.target.createdBox.initialX ? touch.target.createdBox.initialX : touch.pageX,
                    top     : touch.pageY > touch.target.createdBox.initialY ? touch.target.createdBox.initialY : touch.pageY
                };

                var tempBox = "<div id=\"" + touch.identifier + "\" class=\"box\" style=\"width: " + touch.target.createdBox.width + 
                          "px; height: " + touch.target.createdBox.height + "px; left: " + touch.target.createdBox.left +
                          "px; top: " + touch.target.createdBox.top + "px\"></div>";
                $('#' + touch.identifier).replaceWith(tempBox);
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
            } else if (touch.target.createdBox) {
                // If we created a box, append it to the drawing area.
                $('#' + touch.identifier).remove();
                var box = touch.target.createdBox;
                var div = "<div class=\"box\"style=\"width: " + box.width + 
                          "px; height: " + box.height + "px; left: " + box.left +
                          "px; top: " + box.top + "px\"></div>";
                $('#drawing-area').append(div);

                touch.target.createdBox = null;
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

            // if (box is oustide) {
            //    $(touch.target).removeClass("box-highlight");
            //    $(touch.target).addClass("box-delete");    
            // } else if (is inside) {
            //    $(touch.target).removeClass("box-delete");
            //    $(touch.target).addClass("box-highlight");
            // }
        });

        // Eat up the event so that the drawing area does not
        // deal with it.
        event.stopPropagation();
    }

};