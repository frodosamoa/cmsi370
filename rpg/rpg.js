$(function () {

	// TODO:
    // Row numbers for characters.

    // Close all modals when thier respective "confirm" button is clicked.
	$("#confirm-create-button").click(function () {
        // Add row to character list.
        $("#character-list-table").append("<tr><td>" + $("#character-name-input").val() + "</td></tr>");

        // Add info to character info.

        // Reset all options for modal.

        // Hide the modal.
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
    $("#character-list-table tbody > tr").click(function () {
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
        $("#character-list-table tbody > tr:nth-child(" + ($(this).index() + 1) + ")").addClass("active");
                                                  
        // Send the character name to character info panel.                      
        $("#character-info > #character-title > #character-name > h3").text($(this).find("td:nth-child(1)").text());
        $("#character-info").collapse("show");

    });

    // Enlarge the characters's image.
    $("#character-image").click(function(){});

    // Spawn a random item.
    $("#spawn-item").click(function () {

    });

    // View the character's items.
    $("#view-items").click(function () {
        // Show item list.
        $("#item-list").collapse("show");
        
        // Hide detailed info.
        $("#detailed-info").collapse("hide");
    });

    // Set up handlers for character information clicks.
    $("#character-info-table tbody > tr ").click(function () {
        // Hide item list.
        $("#item-list").collapse("hide");

        // Put the currently selescted info title.
        $("#detailed-info > h3").text($(this).find("td:nth-child(2)").text());

        // Show detailed info.
        $("#detailed-info").collapse("show");
    });
});
