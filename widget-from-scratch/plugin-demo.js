$(function () {
    $(".drag-select-sex").dragSelect({
        values : {
            left: "Male",
            right: "Female"
        },

        change: function (oldSelection, newSelection) {
            console.log("Changed from " + oldSelection + " to " + newSelection);
        }
    });

    $(".drag-select-yesno").dragSelect({
        values : {
            left: "Yes",
            right: "no"
        },

        change: function (oldSelection, newSelection) {
            console.log("Changed from " + oldSelection + " to " + newSelection);
        }
    });

});