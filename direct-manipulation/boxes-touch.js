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
            if (touch.creatingBox == null) {
                touch.initialX = touch.pageX;
                touch.initialY = touch.pageY;

                var tempBox = "<div id=\"" + 
                              touch.identifier + 
                              "\" class=\"box\"style=\"width: 0px; height: 0px; left: " + 
                              touch.pageX + "px; top: " +
                              touch.pageY + "px\"></div>";
                $("#drawing-area").append(tempBox);

                touch.creatingBox = $("#" + touch.identifier);
                (touch.creatingBox).addClass("box-create");
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
                var drawingAreaWidth = $("#drawing-area").width(),
                    drawingAreaHeight = $("#drawing-area").height(),
                    outsideDrawingArea = touch.target.movingBox.offset().left > drawingAreaWidth ||
                                         touch.target.movingBox.offset().top > drawingAreaHeight;

                // Reposition the object.
                touch.target.movingBox.offset({
                    left: touch.pageX - touch.target.deltaX,
                    top: touch.pageY - touch.target.deltaY
                });

                if (outsideDrawingArea) {
                   $(touch.target.movingBox).removeClass("box-highlight").addClass("box-delete");  
                } else {
                   $(touch.target.movingBox).removeClass("box-delete").addClass("box-highlight");
                }

            // But if we are.
            } else if (touch.creatingBox) {
                var touchXGreater = touch.pageX > touch.initialX,
                    touchYGreater = touch.pageY > touch.initialY;

                touch.creatingBox = {
                    width   : touchXGreater ? touch.pageX - touch.initialX : touch.initialX - touch.pageX,
                    height  : touchYGreater ? touch.pageY - touch.initialY : touch.initialY - touch.pageY,
                    left    : touchXGreater ? touch.initialX : touch.pageX,
                    top     : touchYGreater ? touch.initialY : touch.pageY
                };

                $('#' + touch.identifier)
                        .css('width', touch.creatingBox.width)
                        .css('height', touch.creatingBox.height)
                        .css('left', touch.creatingBox.left)
                        .css('top', touch.creatingBox.top);
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
                var drawingAreaWidth = $("#drawing-area").width(),
                    drawingAreaHeight = $("#drawing-area").height(),
                    outsideDrawingArea = touch.target.movingBox.offset().left > drawingAreaWidth ||
                                         touch.target.movingBox.offset().top > drawingAreaHeight;

                if (outsideDrawingArea) {
                    console.log(touch.target.movingBox);
                    $("#" + touch.target.movingBox.attr('id')).remove();
                }

                // Change state to "not-moving-anything" by clearing out
                // touch.target.movingBox.
                touch.target.movingBox = null;
            } else if (touch.creatingBox) {
                // Remove id field since we don't need the touch.identifier anymore.
                $('#' + touch.identifier)
                        .removeClass('box-create');

                $("#drawing-area").find("div.box").each(function (index, element) {
                    element.addEventListener("touchstart", BoxesTouch.startMove, false);
                    element.addEventListener("touchend", BoxesTouch.unhighlight, false);
                });

                // Change state to "not-creating-anything" by clearing out
                // touch.creating.
                touch.creatingBox = null;
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