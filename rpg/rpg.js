$(function () {

    // Show a newly created character.

    var MAX_LEVEL = 100,
        MAX_MONEY = 1000000,
        characterInfoRowTemplate = '<tr>' +
            '<td><strong>Class</strong></td>' +
            '<td id="character-class" align="right"></td>' +
            '</tr>' +
            '<tr>' +
            '<td><strong>Gender</strong></td>' +
            '<td id="character-gender" align="right"></td>' +
            '</tr>' + 
            '<tr>' +
            '<td><strong>Level</strong></td>' +
            '<td id="character-level" align="right"></td>' +
            '</tr>' +
            '<tr>' +
            '<td><strong>Money</strong></td>' +
            '<td id="character-money" align="right"></td>' +
            '</tr>',
        characterListRowTemplate = '<tr>' +
            '<td></td>'+
            '</tr>';

/**
 *  CHARACTERS
 */
   
    /**
     *  CREATION
     */

        // Create modal.
    	$('#confirm-create').click(function () {

            // Make the create buttons be unactive.
            $('#confirm-create, #cancel-create').attr('disabled', 'disabled');

            // Show the loader gif.
            $('.create-loader').show();

            // Make the create character button be 'unactive' after creation.
            $('#create-character').removeClass('active')

            // Values for character creation.
            var character = {
                    name      : $('#character-name-input').val(),
                    classType : $('#create-class').val(),
                    gender    : $('#create-male').hasClass('active') ? 'MALE' : 'FEMALE',
                    level     : $('#create-level').val(),
                    money     : $('#create-money').val()
                };

            // POST the character.
            $.ajax({
                type: 'POST',
                url: 'http://lmu-diabolical.appspot.com/characters',
                data: JSON.stringify(character),
                contentType: 'application/json',
                dataType: 'json',
                accept: 'application/json',
                complete: function (jqXHR, textStatus) {   
                        console.log("You may access the new character at:" +
                            typeof(jqXHR));     
                    // Hide the modal.
                    $('#createModal').modal('hide');

                    // Hide the loader gif.
                    $('.create-loader').hide();

                    // Clear item list.
                    $('#item-list').empty();

                    // Add the character to the character list.
                    var $characterRow = $(characterListRowTemplate);
                    $characterRow.attr('id', character.id);
                    $characterRow.find('td:nth-child(1)').text(character.name);
                    $('#character-list-table > tbody').append($characterRow);

                    // If the character info panes are not shown, show them
                    $('#character-info, #character-item-list').collapse('hide');

                    // Send the character Id to the header id.
                    $('#character-name > h3').attr('id', character.id);

                    // Make the confirm create button unactive.
                    $('#confirm-create, #cancel-create').removeAttr('disabled');

                    // Send the character name to the info panel.
                    $('#character-name > h3').text(character.name);

                    // Put the created character's information in their info table.
                    if ($('#characters').is(':empty')) {
                    
                    } else {
                        $('#character-class').text(character.classType);
                        $('#character-gender').text(character.gender.charAt(0).toUpperCase() + character.gender.slice(1).toLowerCase());
                        $('#character-level').text(character.level);
                        $('#character-money').text(character.money);
                    }
                }
            });

        });
        
        // Cancel creation.
        $('#cancel-create').click( function () {
            $('#create-character').removeClass('active')
        });

        // Cleanup after closure of modal.
        $('#createModal').on('hidden.bs.modal', function () {
            $('#character-name-input, #create-class, #create-level, #create-money').val('');
            $('#create-male, #create-female').removeClass('active');
            $('#character-name-input, #create-class, #roll-level, #roll-money, #create-male, #create-female, #spawn-character').removeAttr('disabled');
        });

        // Spawn random character information for character creation.
        $('#spawn-character').click(function () {
            $(this).attr('disabled', 'disabled');
            $('#character-name-input, #create-class, #roll-level, #roll-money').attr('disabled', 'disabled');

            $.getJSON(
                'http://lmu-diabolical.appspot.com/characters/spawn',
                function (character) {
                    $('#character-name-input').val(character.name);
                    $('#create-class').val(character.classType);
                    if (character.gender === 'MALE') {
                        $('#create-male').addClass('active');
                        $('#create-female').attr('disabled', 'disabled');
                    } else {
                        $('#create-female').addClass('active');
                        $('#create-male').attr('disabled', 'disabled');
                    }
                    $('#create-level').val(character.level);
                    $('#create-money').val(character.money);
                }
            );
        });

    /**
     *  EDITION
     */

        // Edit modal.
        $('#edit-character').click(function () {
            $('#edit-character-name-input').val($('#character-name > h3').text())
            $('#edit-class').val($('#character-class').text())
            if ($('#character-gender').text().toUpperCase() === 'MALE') {
                $('#edit-male').addClass('active');
            } else {
                $('#edit-female').addClass('active');
            }
        });

        // Edit the character.
        $('#confirm-edit').click(function () {

            // Get the character's id.
            var idToEdit = $('#character-name > h3').attr('id');

            // Make the edit buttons be unactive.
            $('#confirm-edit, #cancel-edit').attr('disabled', 'disabled');

            // Make sure the edit character button is 'unactive' after clicking cancel.
            $('#edit-character').removeClass('active');

            // Show the loader gif.
            $('.edit-loader').show();

            // Values for character creation.
            var character = { 
                    id         : $('#character-name > h3').attr('id'),
                    name       : $('#character-name > h3').text(),
                    classType  : $('#edit-class').val(), 
                    gender     : $('#edit-male').hasClass('active') ? 'MALE' : 'FEMALE', 
                    level      : $('#character-level').text(), 
                    money      : $('#character-money').text()
                };

            $.ajax({
                type: 'PUT',
                url: 'http://lmu-diabolical.appspot.com/characters/' + idToEdit,
                data: JSON.stringify(character),
                contentType: 'application/json',
                dataType: 'json',
                accept: 'application/json',
                success: function (data, textStatus, jqXHR) {
                    // Hide the modal.
                    $('#editModal').modal('hide');

                    // Hide the loader gif.
                    $('.edit-loader').hide();

                    // Make the edit buttons be active.
                    $('#confirm-edit, #cancel-edit').removeAttr('disabled');

                    // Put the changed information into the character info table.
                    $('#character-class').html(character.classType);
                    $('#character-gender').text(character.gender.charAt(0).toUpperCase() + character.gender.slice(1).toLowerCase());
                }
            });
        });

        // Cleanup after closure of modal.
        $('#editModal').on('hidden.bs.modal', function () {
            $('#edit-class').val('');
            $('#edit-male, #edit-female').removeClass('active');
        });

        // Made the edit button be 'unactive' after hitting cancel.
        $('#cancel-edit').click(function () {
            $('#edit-character').removeClass('active');
        });

    /**
     *  DELETION
     */

        $('#confirm-delete').click(function () {

            // Get the character's id.
            var idToDelete = $('#character-name > h3').attr('id');


            // Make the delete buttons be unactive.
            $('#confirm-delete, #cancel-delete').attr('disabled', 'disabled');

            // Show the loader gif.
            $('.delete-loader').show();

            $.ajax({
                type: 'DELETE',
                url: 'http://lmu-diabolical.appspot.com/characters/' + idToDelete,
                success: function (data, textStatus, jqXHR) {
                    // Remove the row.
                    $('#' + idToDelete).remove();

                    //Hide the loader .gif.
                    $('.delete-loader').hide();

                    // Hide the modal.
                    $('#deleteModal').modal('hide');

                    // Make the delete buttons be active.
                    $('#confirm-delete, #cancel-delete').removeAttr('disabled');

                    // Clear item list.
                    $('#item-list').empty();

                    // Make the delete button 'unactive'.
                    $('#delete-character').removeClass('active');

                    // Hide character info and detailed info after deletion.
                    $('#character-info, #character-item-list').collapse('hide');
                }
            });


        });

        // Make the delete button 'unactive' after hitting cancel.
        $('#cancel-delete').click(function () {
            $('#delete-character').removeClass('active');
        })

/**
 *  HELP MODAL
 */

    $('#confirm-help-button').click(function () {
        $('#helpModal').modal('hide');
    });

/**
 *  CHARACTER INFO
 */

    // Handlers for individual character clicks.
    $(document).on('click', '#character-list-table tbody > tr', function() {
        // Show the character info column.
        $('#character-info').collapse('show');

        // Show their items.
        $('#character-item-list').collapse('show');

        // Change the color of the table to let the user know which
        // character is selected. 'Unselect' unselected users.
        $('#character-list-table tbody > tr').not(this).removeClass('success');
        $(this).toggleClass('success');

        // Clear item list.
        $('#item-list').empty();

        // Put in new table.
        $.getJSON(
        'http://lmu-diabolical.appspot.com/characters/' + $(this).attr('id'),
        function (character) {
            // Send the character Id to the header id.
            $('#character-name > h3').attr('id', character.id);

            // Send the character name to the info panel.
            $('#character-name > h3').text(character.name);

            // Do something with the character list.
            var $characterInfo = $(characterInfoRowTemplate);
            $characterInfo.find('#character-class').text(character.classType);
            $characterInfo.find('#character-gender').text(character.gender.charAt(0).toUpperCase() + character.gender.slice(1).toLowerCase());
            $characterInfo.find('#character-level').text(character.level);
            $characterInfo.find('#character-money').text(character.money);
            $('#character-info-table > tbody').html($characterInfo);
        });
    });

    // Set up handlers for character information clicks.
    $(document).on('click', '#character-info-table tbody > tr', function() {
        // Change the color of the table to let the user know which
        // attribute is selected.
        $('#character-info-table tbody > tr').not(this).removeClass('success');
        $(this).toggleClass('success');

        // Hide item list and enlarged image.
        $('#item-list').collapse('hide');
    });

/** 
 *  ROLL
 */

    // Disable roll level buttons.
    $('#roll-level').click(function () {
        $(this).attr('disabled', 'disabled');
        $('#create-level').val(Math.floor(Math.random() * MAX_LEVEL) + 1);
    });

    // Disable roll money button.
    $('#roll-money').click(function () {
        $(this).attr('disabled', 'disabled');
        $('#create-money').val(Math.floor(Math.random() * MAX_MONEY) + 1);
    });

/**
 *  ITEMS
 */

     // Spawn a random item.
    $('#spawn-item').click(function () {
        $('#character-items-table').append('<tr><td>Not Available</td><td>At This Time</td></tr>')
    });


/**
 *  INITIAL PAGE LOAD
 */

    // Show character list loader.
    $('.character-list-loader').show()

    // Get the character list.
    $.getJSON(
        'http://lmu-diabolical.appspot.com/characters',
        function (characters) {
            // Hide loader.
            $('.character-list-loader').hide();

            characters.forEach(function (character) {
                var $characterRow = $(characterListRowTemplate);
                $characterRow.attr('id', character.id);
                $characterRow.find('td:nth-child(1)').text(character.name);
                $('#character-list-table > tbody').append($characterRow);
            });
        }
    );

});
