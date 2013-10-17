$(function () {

	// TODO:
	// Edit modal and delete modal unclickable if no characters.
	// Create and delete modal unclickable when editing character.
	// If character is clicked, create character is unclickable.

    // Close all modals when thier respective "confirm" button is clicked.
	$("#confirm-create-button").click(function () {
        $("#character-list > tbody:last").append($("<tr><td>1</td><td>Poop</td></tr>"));
		$("#createModal").modal("hide");
    });

    $("#confirm-edit-button").click(function () {
        //$("#character-list") Edit the character's info.
        $("#editModal").modal("hide");
    });

    $("#confirm-delete-button").click(function () {
        //$("#character-list") Delete the character from the table.
        $("#deleteModal").modal("hide");
    });

    // Set up handlers for character clicks.
    $("#character-list tbody > tr").click(function () {
        // If a character is chosen, let them be edited and deleted. Change
        // the glypp icons for editing and deleting.
        $("#edit-button").removeAttr("disabled");
        $("#edit-glyph").removeClass("black").addClass("white");
        $("#delete-button").removeAttr("disabled");
        $("#delete-glyph").removeClass("black").addClass("white");

        // If a character if chosen, let no new characters be created.
        $("#create-button").attr("disabled", "disabled");
        $("#create-glyph").removeClass("white").addClass("black");

        // Change the color of the table to let the user know which
        // character is selected.
        var rowClicked = $(this).index() + 1;
        $("#character-list tbody > tr:nth-child(" + rowClicked + ")").addClass("active");
                                                  
        // Send the character name to character info panel.                      
        $("#character-info > #character-name > h3").text($(this).find("td:nth-child(2)").text());
        $("#character-info").collapse("show");

    });

    // View the character's items.
    $("#view-items").click(function () {
        $("#character-detailed-info").collapse("show");
    });

    // Set up handlers for character information clicks.
    $("#character-info-table tbody > tr ").click(function () {
        $("#character-detailed-info > h3").text($(this).find("td:nth-child(2)").text());
        $("#character-detailed-info").collapse("show");
    });
});
