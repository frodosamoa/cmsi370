$(function () {
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
