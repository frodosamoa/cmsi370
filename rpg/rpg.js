$(function () {

    // TODO:
    // Find out actual way of seeing which radio button the user chose for gender.
    // Reset create modal after hitting cancel.
    // Reset edit modal after hitting cancel.
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

        // Hide the modal.
		$('#createModal').modal('hide');

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
                // The new character can be accessed from the Location header.
                console.log('You may access the new character at:' +
                    jqXHR.getResponseHeader('Location'));
            }
        });

        // Reset values in character creation modal.

        // Make the create character button be 'unactive' after creation.
        $('#create-character').removeClass('active')

        // Update list of characters after creating a new one.
        updateCharacterList;

        // Hide character info and detailed info after creation.
        $('#character-info, #item-list').collapse('hide');

        //Show the newly created character.

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

    // Spawn character.
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

        $('#edit-character').removeClass('active');

        // Hide the modal.
        $('#editModal').modal('hide');

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
            url: 'http://lmu-diabolical.appspot.com/characters/' + character.id.toString(),
            data: JSON.stringify(character),
            contentType: 'application/json',
            dataType: 'json',
            accept: 'application/json',
            success: function (data, textStatus, jqXHR) {
                console.log('Done: no news is good news.');
            }
        });
    });

    $('#cancel-edit').click(function () {
        $('#edit-character').removeClass('active');
    });

    /**
     *  DELETION
     */

    $('#confirm-delete').click(function () {
        // Hide the modal
        $('#deleteModal').modal('hide');

        $.ajax({
            type: 'DELETE',
            url: 'http://lmu-diabolical.appspot.com/characters/' + $('#character-name > h3').attr('id'),
            success: function (data, textStatus, jqXHR) {
                console.log('Gone baby gone.');
            }
        });

        // Hide character info and detailed info after deletion.
        $('#character-info, #character-item-list').collapse('hide');

        // Update the character list.
        updateCharacterList;
    });

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
        $('#character-items-table').append('<tr><td>Mace</td><td>Weapon</td></tr>')

        // var itemRowTemplate = '<tr id='test' data-container='body' data-toggle='popover' data-placement='right' data-content='Delete'>' +
        //     '<td>Sword</td>' +
        //     '<td>Weapon</td>' +
        //     '</tr>';

        // $.getJSON(
        //     'http://lmu-diabolical.appspot.com/items/spawn',
        //     {
        //         level: 50,
        //         slot: 'body'
        //     },
        //     function (item) {
        //         // Mmmmm, new item.
        //         console.log(item);
        //     }
        // );
    });


    // Updates the character list.
    var updateCharacterList = $.getJSON(
            'http://lmu-diabolical.appspot.com/characters',
            function (characters) {
                // If there are any characters there, remove them.
                 $('#character-list-table > tbody').empty();

                // Do something with the character list.
                characters.forEach(function (character) {
                    var $characterRow = $(characterListRowTemplate);
                    $characterRow.attr('id', character.id);
                    $characterRow.find('td:nth-child(1)').text(character.name);
                    $('#character-list-table > tbody').append($characterRow);
                });
            }
            console.log('Characters updated');
        );

    // Get the characters when the page loads.
    updateCharacterList;
});
