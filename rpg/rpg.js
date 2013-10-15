$(function () {

	// TODO:
	// Edit modal and delete modal unclickable if no characters.
	// Create and delete modal unclickable when editing character.
	// If character is clicked, create character is unclickable.


	$("#confirm-create-button").click(function () {
        $("#edit-button").removeAttr("disabled");
        $("#delete-button").removeAttr("disabled");
		$("#edit-glyph > glyphicon glyphicon-edit black").removeClass("glyphicon glyphicon-edit black").addClass("glyphicon glyphicon-edit white");
		$("#createModal").modal("hide");
    });

    $("#confirm-edit-button").click(function () {
        $("#editModal").modal("hide");
    });

    $("#confirm-delete-button").click(function () {
        $("#deleteModal").modal("hide");
    });


    // Set up handlers for character clicks.
    $("#character-list tbody > tr").click(function () {
        $("#character-info > h1").text($(this).find("td:nth-child(2)").text());
        $("#character-info").collapse("show");
    });
});
