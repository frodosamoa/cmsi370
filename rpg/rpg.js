$(function () {

	// TODO:
	// Edit modal and delete modal unclickable if no characters.
	// Create and delete modal unclickable when editing character.
	// If character is clicked, create character is unclickable.


	$("#confirm-create-button").click(function () {

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
        $("#edit-button").removeAttr("disabled");
        $("#delete-button").removeAttr("disabled");
        
        // Change glyph colors.
        $("#edit-glyph").removeClass("glyphicon glyphicon-edit black").addClass("glyphicon glyphicon-edit white");
        $("#delete-glyph").removeClass("glyphicon glyphicon-trash black").addClass("glyphicon glyphicon-trash white");
                                          
                                          
        $("#character-info > h1").text($(this).find("td:nth-child(2)").text());
        $("#character-info").collapse("show");
        $("#create-button").attr("disabled", "disabled");
    });
});
