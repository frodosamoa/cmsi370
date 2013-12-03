$(function() {

    var cache = {};

    window.BoxesTouch = {
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
                // Save the inital x and y coordinates of our initial touch along
                // with setting the initial width and height of our touch.
                var touchCache = {};
                cache[touch.identifier] = touchCache;
                touchCache.creatingBox = {};
                touchCache.initialX = touch.pageX;
                touchCache.initialY = touch.pageY;
                touchCache.creatingBox.height = 0;
                touchCache.creatingBox.width = 0;

                // Create a stringy version of our initial box from out touchCache.
                //
                // JD: Alternatively, you can define this "template" as a standalone
                //     string at the top, then set its attributes via jQuery, e.g.:
                //
                //     var TEMP_BOX_TEMPLATE = $('<div class="box"></div>');
                //
                //     ...
                //
                //     var tempBox = $(TEMP_BOX_TEMPLATE)
                //             .attr({ id: touch.identifier })
                //             .width(touchCache.creatingBox.width)
                //             .height(touchCache.creatingBox.height)
                //             ...;
                //
                //     You may find this approach to be a little more readable and
                //     less error-prone.
                //
                var tempBox = "<div id=\"" + 
                              touch.identifier + "\" class=\"box\"style=\"width: " +
                              touchCache.creatingBox.width + "px; height: " + 
                              touchCache.creatingBox.height + "px; left: " + 
                              touchCache.initialX + "px; top: " +
                              touchCache.initialY + "px\"></div>";

                // Add our tempBox to the drawing area.
                $(touch.target).append(tempBox);

                // Highlight our div for creation.
                $("#" + touch.identifier).addClass("box-create");

                // Add event listeners for all boxes.
                $(touch.target).find("div.box").each(function (index, element) {
                    element.addEventListener("touchstart", BoxesTouch.startMove, false);
                    element.addEventListener("touchend", BoxesTouch.unhighlight, false);
                });
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
                    var boxParent = $(touch.target.movingBox).parent(),
                        parentWidth = boxParent.width(),
                        parentHeight = boxParent.height(),
                        parentBottom = parentWidth + boxParent.offset().top,
                        parentRight = parentHeight + boxParent.offset().left,
                        outsideDrawingArea = touch.target.movingBox.offset().left > parentRight ||
                                             touch.target.movingBox.offset().top > parentBottom;


                    console.log(parentRight + " " + touch.target.movingBox.offset().left)
                    // Reposition the object.
                    touch.target.movingBox.offset({
                        left: touch.pageX - touch.target.deltaX,
                        top: touch.pageY - touch.target.deltaY
                    });

                    // If the box is outside the drawing area, highlight it for
                    // deletion. If it is not, change it back.
                    (touch.target.movingBox)
                            .removeClass(outsideDrawingArea ? "box-highlight" : "box-delete")
                            .addClass(outsideDrawingArea ? "box-delete" : "box-highlight");  
                }

                // But if we are tracking something.
                var touchCache = cache[touch.identifier];
                if (touchCache && touchCache.creatingBox) {
                    var touchX = touch.pageX,
                        touchY = touch.pageY,
                        touchXGreater = touch.pageX > touchCache.initialX,
                        touchYGreater = touch.pageY > touchCache.initialY;

                    // Update the creatingBox with its properties.
                    touchCache.creatingBox = {
                        width   : touchXGreater ? touchX - touchCache.initialX : touchCache.initialX - touchX,
                        height  : touchYGreater ? touchY - touchCache.initialY : touchCache.initialY - touchY,
                        left    : touchXGreater ? touchCache.initialX : touchX,
                        top     : touchYGreater ? touchCache.initialY : touchY
                    };
                    // JD: Nicely consolidated code here :)

                    // Update the box's style in the drawing area.
                    $('#' + touch.identifier)
                            .css('width', touchCache.creatingBox.width)
                            .css('height', touchCache.creatingBox.height)
                            .css('left', touchCache.creatingBox.left)
                            .css('top', touchCache.creatingBox.top);

                    // JD: You can "coalesce" multiple CSS properties into a single object:
                    //
                    //     $('#' + touch.identifier).css({
                    //         width: touchCache.creatingBox.width,
                    //         height: touchCache.creatingBox.height,
                    //         left: touchCache.creatingBox.left,
                    //         top: touchCache.creatingBox.top
                    //     });
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
                // If we are tracking something...
                if (touch.target.movingBox) {
                    var boxParent = $(touch.target.movingBox).parent(),
                        parentWidth = boxParent.width(),
                        parentHeight = boxParent.height(),
                        parentBottom = parentWidth + boxParent.offset().top,
                        parentRight = parentHeight + boxParent.offset().left,
                        // JD: Don't forget left and top---easy to miss because the drawing area
                        //     is near the upper-left of the page, but still grounds for deletion.
                        outsideDrawingArea = touch.target.movingBox.offset().left > parentRight ||
                                             touch.target.movingBox.offset().top > parentBottom;

                    // If out box is outside of the drawing area, remove it.
                    if (outsideDrawingArea) {
                        (touch.target.movingBox).remove();
                    }

                    // Change state to "not-moving-anything" by clearing out
                    // touch.target.movingBox.
                    touch.target.movingBox = null;
                } 

                // If we have created something...
                var touchCache = cache[touch.identifier];
                if (touchCache && touchCache.creatingBox) {
                    // JD: "20" is another good candidate for a "constant" variable
                    //     declaration at the top of this function.
                    var boxTooSmall = touchCache.creatingBox.width < 20 &&
                                      touchCache.creatingBox.height < 20;

                    // Remove the box create class.
                    $('#' + touch.identifier).removeClass('box-create');

                    // If the box is too small before the user ends their touch,
                    // remove it right away.
                    if (boxTooSmall) {
                        $('#' + touch.identifier).remove();
                    }

                    // Change state to "not-creating-anything" by clearing out
                    // touchCache.
                    delete touchCache;
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
});