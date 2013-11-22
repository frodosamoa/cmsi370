$(function () {
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
