$(function () {

	// TODO:
    // Allow user to "unselect" character.
    // Character title with enlarged image.
    // Character items to be deleted.
    // Character items popover funcitonality.
    // Change all other classes of character list to unactive when one is chosen.



    var characterInfoRowTemplate = '<tr>' +
        '<td><strong>Class</strong></td>' + 
        '<td></td>' +
        '</tr>' +
        '<tr>' +
        '<td><strong>Gender</strong></td>' +
        '<td></td>' + 
        '</tr>' + 
        '<tr>' +
        '<td><strong>Level</strong></td>' +
        '<td></td>' +
        '</tr>' +
        '<tr>' +
        '<td><strong>Money</strong></td>' +
        '<td></td>' +
        '</tr>';

    // Character Creation
	$("#confirm-create-button").click(function () {
        // Add row to character list.
        $("#character-list-table").append("<tr><td>" + $("#character-name-input").val() + "</td></tr>");

        // Add info to character info.

        // Reset all options for modal.

        // Hide the modal.
		$("#createModal").modal("hide");

    });

    // Character Selection
    $(document).on("click", "#character-list-table tbody > tr", function() {
        // Show the character info column.
        $("#character-info").collapse("show");

        // If you select a cnewharacter, hide the detailed info.
        $("#detailed-info").collapse("hide");
        $("#enlarged-image").collapse("hide");
        $("#item-list").collapse("hide");

        // Change the color of the table to let the user know which
        // character is selected. "Unselect" unselected users.
        $("#character-list-table tbody > tr").not(this).removeClass("success");
        $(this).toggleClass("success");

        // Remove old table.
        // $("#character-info-table").empty()

        // Put in new table.
        $.getJSON(
        "http://lmu-diabolical.appspot.com/characters/4954004257767424",
        function (character) {
            // Send the character name to the info panel.
            $("#character-name > h3").text(character.name);

            // Do something with the character list.
            var $characterInfo = $(characterInfoRowTemplate);
            $characterInfo.find("tr:eq(1) td:eq(2)").text(character.classType);
            $characterInfo.find("tr:eq(2) td:eq(2)").text(character.gender);
            $characterInfo.find("tr:eq(3) td:eq(2)").text(character.level);
            $characterInfo.find("tr:eq(4) td:eq(2)").text(character.money);
            $("#character-info-table > tbody").html($characterInfo);
        });


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
    $(document).on("click", "#character-info-table tbody > tr", function() {
        // Change the color of the table to let the user know which
        // attribute is selected.
        $("#character-info-table tbody > tr").not(this).removeClass("success");
        $(this).toggleClass("success");

        // Hide item list and enlarged image.
        $("#item-list").collapse("hide");
        $("#enlarged-image").collapse("hide");

        // Put the currently selected row in the table nfo title.
        $("#detailed-info > h3").text($(this).find("td:nth-child(1)").text() +  " : " + $(this).find("td:nth-child(2)").text());

        // Show detailed info.
        $("#detailed-info").collapse("show");
    });

    var characterListRowTemplate = '<tr>' +
        '<td></td>'+
        '</tr>';

    $.getJSON(
        "http://lmu-diabolical.appspot.com/characters",
        function (characters) {
            // Do something with the character list.
            characters.forEach(function (character) {
                var $characterRow = $(characterListRowTemplate);
                $characterRow.find("td:nth-child(1)").text(character.name);
                $("#character-list-table > tbody").append($characterRow);
            });
        }
    );
});
