$(function () {

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
