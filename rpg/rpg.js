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

    // Edit the character.
    $("#confirm-edit-button").click(function () {
        //$("#character-list-table") Edit the character's info.
        $("#editModal").modal("hide");
    });

    // Delete the character.
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

        // Change the color of the table to let the user know which
        // character is selected.
        $("#character-list-table tbody > tr:nth-child(" + ($(this).index() + 1) + ")").addClass("active");
                                                  
        // Send the character name to character info panel.                      
        $("#character-name > h3").text($(this).find("td:nth-child(1)").text());
        $("#character-info").collapse("show");

        // Hide detailed information or item list.
        $("#detailed-info").collapse("hide");
        $("#item-list").collapse("hide");
        $("#character-enlarged-image").collapse("hide");
    });

    // Enlarge the characters's image.
    $("#character-title").click(function(){
        // Show the character's enlarged image.
        $("#character-enlarged-image").collapse("show");

        // Hide detailed info and item list.
        $("#detailed-info").collapse("hide");
        $("#item-list").collapse("hide");
    });

    // Spawn a random item.
    $("#spawn-item").click(function () {

    });

    // View the character's items.
    $("#view-items").click(function () {
        // Show item list.
        $("#item-list").collapse("show");
        
        // Hide detailed info and enlarged picture.
        $("#detailed-info").collapse("hide");
        $("#character-enlarged-image").collapse("hide");
    });

    // Set up handlers for character information clicks.
    $("#character-info-table tbody > tr ").click(function () {


        // Put the currently selescted info title.
        $("#detailed-info > h3").text($(this).find("td:nth-child(2)").text());

        // Show detailed info.
        $("#detailed-info").collapse("show");

        // Hide item list and enlarged image.
        $("#item-list").collapse("hide");
        $("#character-enlarged-image").collapse("hide");

    });
});
