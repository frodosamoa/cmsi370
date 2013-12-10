$(function () {
    // JD: Again, nicely diverse.  Your approach to the initial values
    //     is noted, though if you recall how Bootstrap does it, you
    //     can also use different classes to define each variant.  That
    //     way, the user just assigns the classes.
    //
    //     e.g., for the first one, you might have assigned the classes:
    //
    //         <div class="drag-select-sex drag-select-square drag-select-blue"></div>
    //
    //     width and height, because they are instance-specific, can be
    //     reasonably left to instance-specific CSS (e.g., .drag-select-sex).
    //     You can apply a min-width and min-height so that the element can't
    //     be too small.
    //
    //     Anyway, just a few ideas.  What you have is not bad; it's just
    //     that when you see more APIs like Bootstrap you begin to get a
    //     finer-grained feel for what gets set as an option and what is
    //     left as a CSS class.
    $(".drag-select-sex").dragSelect({
        values : {
            left: "Male",
            right: "Female"
        },

        shape: "square",
        leftActive : true,
        color: "blue",
        width: 530,
        height: 45
    });

    $(".drag-select-onoff").dragSelect({
        values : {
            left: "off",
            right: "on"
        },

        color: "dark",
        width: "100%",
        height: 60
    });

    $(".drag-select-yesno").dragSelect({
        values : {
            left: "yes",
            right: "no"
        },

        leftActive: false,
        shape: "round",
        color: "purple"
    });

    $(".drag-select-mf").dragSelect({
        values : {
            left: "M",
            right: "F"
        },

        width: "60%",
        height: 40,
        leftActive: true,
        shape: "round",
        color: "green"
    });

    $(".drag-select-OI").dragSelect({
        values : {
            left: "O",
            right: "I"
        },

        width: 160,
        height: 80,
        leftActive: false,
        shape: "round"
    });

    $(".drag-select-MALEFEMALE").dragSelect({
        values : {
            left: "MALE",
            right: "FEMALE"
        },

        width: 300,
        height: 70,
        leftActive: true,
        shape: "square",
        color: "red"
    });

});
