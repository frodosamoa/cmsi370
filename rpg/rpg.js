$(function () {

	// TODO:
	// Edit modal and delete modal unclickable if no characters.
	// Create and delete modal unclickable when editing character.
	// If cahracter is clicked, create character is unclickable.


	$("#confirm-create-button").click(function () {
		console.log("Character created.");
        $('#createModal').modal('hide');
    });

    $("#confirm-edit-button").click(function () {
    	console.log("Character edited.");
        $('#editModal').modal('hide');
    });

    $("#confirm-delete-button").click(function () {
    	console.log("Character delted.");
        $('#deleteModal').modal('hide');
    });

});
