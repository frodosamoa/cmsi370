$(function () {

	// TODO:
    // Allow user to "unselect" character.
    // Character title with enlarged image.
    // Character items to be deleted.
    // Charatcer items popover funcitonality.

    //Create a character.
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
        // Edit the character's info.

        // Reset options for modal.

        // Hide the modal.
        $("#editModal").modal("hide");
    });

    // Delete the character.
    $("#confirm-delete-button").click(function () {
        // Delete the character from the table.

        // Hide the modal
        $("#deleteModal").modal("hide");
    });

    // Set up handlers for character clicks.
    $("#character-list-table tbody > tr").click(function () {
        // If you select a character, hide the detailed info.
        $("#detailed-info").collapse("hide");
        $("#enlarged-image").collapse("hide");
        $("#item-list").collapse("hide");

        // Change the color of the table to let the user know which
        // character is selected.
        $("#character-list-table tbody > tr:nth-child(" + ($(this).index() + 1) + ")").addClass("active");
                                                  
        // Send the character name to character info panel.                      
        $("#character-name > h3").text($(this).find("td:nth-child(1)").text());
        $("#character-info").collapse("show");
    });

    // Enlarge the characters's image.
    $("#character-title").click(function(){
        $("#enlarged-image > h2").text($(this).find("#character-name").text())

        // Hide detailed info and item list.
        $("#detailed-info").collapse("hide");
        $("#item-list").collapse("hide");

        // Show the character's enlarged image.
        $("#enlarged-image").collapse("show");
    });

    $("#test").click(function () {
        $("#test").popover("show");
    });

    // Spawn a random item.
    $("#spawn-item").click(function () {
        $("#character-items-table").append("<tr><td>Mace</td><td>Weapon</td></tr>")
    });

    // View the character's items.
    $("#view-items").click(function () {
        // Hide detailed info and enlarged picture.
        $("#detailed-info").collapse("hide");
        $("#enlarged-image").collapse("hide");

        // Show item list.
        $("#item-list").collapse("show");
    });

    // Set up handlers for character information clicks.
    $("#character-info-table tbody > tr ").click(function () {
        // Hide item list and enlarged image.
        $("#item-list").collapse("hide");
        $("#enlarged-image").collapse("hide");

        // Put the currently selected row in the table nfo title.
        $("#detailed-info > h3").text($(this).find("td:nth-child(2)").text());

        // Show detailed info.
        $("#detailed-info").collapse("show");
    });
});
