$(function () {
    $(".drag-select-sex").dragSelect({
        values : {
            left: "Male",
            right: "Female"
        },

        shape: "round",
        activeSide : "left",
        color: "blue",
        width: 400,
        height: 100
    });

    $(".drag-select-onoff").dragSelect({
        values : {
            left: "off",
            right: "on"
        },

        color: "dark",
        width: "100%"
    });


    $(".drag-select-yesno").dragSelect({
        values : {
            left: "yes",
            right: "no"
        },

        activeSide: "right",
        shape: "round",
        color: "purple"
    });

    $(".drag-select-mf").dragSelect({
        values : {
            left: "M",
            right: "F"
        },

        width: 80,
        height: 40,
        activeSide: "right",
        shape: "round",
        color: "green"
    });

    $(".drag-select-OI").dragSelect({
        values : {
            left: "O",
            right: "I"
        },

        width: 80,
        height: 40,
        activeSide: "right",
        shape: "round",
        color: "light"
    });

    $(".drag-select-MALEFEMALE").dragSelect({
        values : {
            left: "MALE",
            right: "FEMALE"
        },

        width: 300,
        height: 70,
        activeSide: "right",
        shape: "round",
        color: "red"
    });

});
