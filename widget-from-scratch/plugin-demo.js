$(function () {
    $(".swivel-this").swivel({
        change: function (oldAngle, newAngle) {
            console.log("Swiveled from " + oldAngle + " to " + newAngle);
        }
    });

    $(".drag-select-me").dragSelect({
        values : {
            left: "Male",
            right: "Female"
        },

        change: function (oldSelection, newSelection) {
            console.log("Changed from " + oldSelection + " to " + newSelection);
        }
    });
});
