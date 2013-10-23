$(function () {

	// TODO:
    // Allow user to "unselect" character.
    // Character title with enlarged image.
    // Character items to be deleted.
    // Character items popover funcitonality.
    // Change all other classes of character list to unactive when one is chosen.



    var characterInfoRowTemplate = '<tr>' +
        '<td><strong>Class</strong></td>' +
        '<td id="character-class"></td>' +
        '</tr>' +
        '<tr>' +
        '<td><strong>Gender</strong></td>' +
        '<td id="character-gender"></td>' +
        '</tr>' + 
        '<tr>' +
        '<td><strong>Level</strong></td>' +
        '<td id="character-level"></td>' +
        '</tr>' +
        '<tr>' +
        '<td><strong>Money</strong></td>' +
        '<td id="character-money"></td>' +
        '</tr>';

    // Character Creation
	$("#confirm-create-button").click(function () {
        // Hide the modal.
		$("#createModal").modal("hide");

        // Values for character creation.
        var characterName = $("#character-name-input").val();
        var characterClass = "";
        var characterGender = "";
        var characterLevel = 0;
        var characterMoney = 0;

        // POST the character.
        $.ajax({
            type: 'POST',
            url: "http://lmu-diabolical.appspot.com/characters",
            data: JSON.stringify({
                name: characterName,
                classType: characterClass,
                gender: characterGender,
                level: characterLevel,
                money: characterMoney
            }),
            contentType: "application/json",
            dataType: "json",
            accept: "application/json",
            complete: function (jqXHR, textStatus) {
                // The new character can be accessed from the Location header.
                console.log("You may access the new character at:" +
                    jqXHR.getResponseHeader("Location"));
            }
        });

        // Update list of characters after creating a new one.
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

    // Edit the character.
    $("#confirm-edit-button").click(function () {
        // Hide the modal.
        $("#editModal").modal("hide");

        // Values for character creation.
        var characterId = 0;
        var characterName = $("#character-name-input").val();
        var characterClass = ""; 
        var characterGender = ""; 
        var characterLevel = 0; 
        var characterMoney = 0; 
        
        $.ajax({
            type: 'PUT',
            url: "http://lmu-diabolical.appspot.com/characters/" + characterId.toString(),
            data: JSON.stringify({
                id: characterId,
                name: characterName,
                classType: characterClass,
                gender: characterGender,
                level: characterLevel,
                money: characterMoney
            }),
            contentType: "application/json",
            dataType: "json",
            accept: "application/json",
            success: function (data, textStatus, jqXHR) {
                console.log("Done: no news is good news.");
            }
        });
    });

    // Delete the character.
    $("#confirm-delete-button").click(function () {
        // Hide the modal
        $("#deleteModal").modal("hide");

        $.ajax({
            type: 'DELETE',
            url: "http://lmu-diabolical.appspot.com/characters/" + "",
            success: function (data, textStatus, jqXHR) {
                console.log("Gone baby gone.");
            }
        });
    });

    // Character Selection
    $(document).on("click", "#character-list-table tbody > tr", function() {
        // Show the character info column.
        $("#character-info").collapse("show");

        // If you select a new character, hide the enlarge dimage and item list.
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
        "http://lmu-diabolical.appspot.com/characters/" + "4954004257767424",
        function (character) {
            // Send the character name to the info panel.
            $("#character-name > h3").text(character.name);

            // Do something with the character list.
            var $characterInfo = $(characterInfoRowTemplate);
            console.log(typeof($characterInfo))

            $characterInfo.find("#character-class").text(character.classType);
            $characterInfo.find("#character-gender").text(character.gender);
            $characterInfo.find("#character-level").text(character.level);
            $characterInfo.find("#character-money").text(character.money);
            $("#character-info-table > tbody").html($characterInfo);
        });


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
    });

    // Enlarge the characters's image.
    $("#character-title").click(function(){
        $("#enlarged-image > h1").text($(this).find("#character-name").text())

        // Hide item list.
        $("#item-list").collapse("hide");

        // Show the character's enlarged image.
        $("#enlarged-image").collapse("show");
    });

    $("#test").click(function () {
        $("#test").popover("show");
    });

    // View the character's items.
    $("#view-items").click(function () {
        // Hide enlarged picture.
        $("#enlarged-image").collapse("hide");

        // Show item list.
        $("#item-list").collapse("show");
    });

     // Spawn a random item.
    $("#spawn-item").click(function () {
        $("#character-items-table").append("<tr><td>Mace</td><td>Weapon</td></tr>")
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
