$(function () {

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
            '</tr>',

        // Helper function to get translation from a transform matrix.
        getTranslate = function (element) {
            var matrix = element.css("-webkit-transform") ||
                element.css("-moz-transform") ||
                element.css("transform"),
                translate = 0;
            console.log(matrix)
            if (matrix !== 'none') {
                translate = Number(matrix.split('(')[1].split(')')[0].split(', ')[4]);
            } 
            return translate;
        },

        //
        // NOTE: The following function is made simply for functionality.
        // of the rpg website. This *IS* not the right way to do it, this
        // is simply done so that the switch is functional.
        //

        // Helper function to translate switch.
        translateSwitch = function (switcher, transform) {
            var newCSS = "translate(" + transform + "px)";

            switcher.css({
                "transform" : newCSS,
                "-moz-transform" : newCSS,
                "-webkit-transform": newCSS
            });
        };

/**
 *  CHARACTERS
 */
   
    /**
     *  CREATION
     */

        // Create modal.
    	$('#confirm-create').click(function () {

            // Make the create buttons be unactive.
            $('#confirm-create, #cancel-create, #spawn-character').attr('disabled', 'disabled');

            // Show the loader gif.
            $('.create-loader').show();

            // Values for character creation.
            var character = {
                    name      : $('#character-name-input').val(),
                    classType : $('#create-class').val(),
                    gender    : getTranslate($("#create-gender .switcher")) === 
                                parseInt($("#create-gender").css("margin-top"))
                                     ? 'MALE' 
                                     : 'FEMALE',
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
                    // Get the id of the character we just created.
                    var location = jqXHR.getResponseHeader("Location");   
                    var urlIndex = "characters/";
                    var id = location.substring(location.indexOf(urlIndex) + urlIndex.length);

                    // Hide the modal.
                    $('#createModal').modal('hide');

                    // Hide the loader gif.
                    $('.create-loader').hide();

                    // Clear item list.
                    $('#item-list').empty();

                    // Add the character to the character list.
                    var $characterRow = $(characterListRowTemplate);
                    $characterRow.attr('id', id);
                    $characterRow.find('td:nth-child(1)').text(character.name);
                    $('#character-list-table > tbody').append($characterRow);

                    // If the character info panes are not shown, show them
                    $('#character-info, #character-item-list').collapse('show');

                    // Send the character name to the info panel.
                    $('#character-name > h3').text(character.name);

                    // Make the confirm create button unactive.
                    $('#confirm-create, #cancel-create, #spawn-character').removeAttr('disabled');

                    // Select the new character's row and unselect any other character.
                    $('#character-list-table tbody > tr').not('#character-list-table tbody > tr:last')
                                                         .removeClass('success');
                    $('#character-list-table tbody > tr:last').toggleClass('success');

                    // Put the created character's information in their info table.
                    var $characterInfo = $(characterInfoRowTemplate);
                    $characterInfo.find('#character-class').text(character.classType);
                    $characterInfo.find('#character-gender').text(character.gender.charAt(0).toUpperCase() +
                                                                  character.gender.slice(1).toLowerCase());
                    $characterInfo.find('#character-level').text(character.level);
                    $characterInfo.find('#character-money').text(character.money);
                    $('#character-info-table > tbody').html($characterInfo);


                }
            });

        });

        // Cleanup after closure of modal.
        $('#createModal')
            .on('hidden.bs.modal', function () {
                $('#character-name-input, #create-class, #create-level, #create-money').val('');
                translateSwitch($('#create-gender .switcher'), parseInt($("#create-gender").css("margin-top")));
            })

        // Spawn random character information for character creation.
        $('#spawn-character').click(function () {
            $.getJSON(
                'http://lmu-diabolical.appspot.com/characters/spawn',
                function (character) {
                    $('#character-name-input').val(character.name);
                    $('#create-class').val(character.classType);
                    $('#create-level').val(character.level);
                    $('#create-money').val(character.money);

                    //Translate the switch according to the spawned character.
                    var transform = character.gender === "MALE" 
                                        ? parseInt($("#create-gender").css("margin-top"))
                                        : ($("#create-gender").innerWidth() - 
                                           $("#create-gender .switcher").innerWidth() - 
                                           parseInt($("#create-gender").css("margin-top")));
                    translateSwitch($('#create-gender .switcher'), transform);
                }
            );
        });

    /**
     *  EDITION
     */

        // Edit the character.
        $('#confirm-edit').click(function () {
            // Get the character's id.
            var idToEdit = $('#character-list-table tbody tr.success').attr('id');

            // Make the edit buttons be unactive.
            $('#confirm-edit, #cancel-edit').attr('disabled', 'disabled');

            // Make sure the edit character button is 'unactive' after clicking cancel.
            $('#edit-character').removeClass('active');

            // Show the loader gif.
            $('.edit-loader').show();

            // Values for character creation.
            var character = { 
                    id         : idToEdit,
                    name       : $('#character-name > h3').text(),
                    classType  : $('#edit-class').val(), 
                    gender     : getTranslate($("#edit-gender .switcher")) === 
                                 parseInt($("#edit-gender").css("margin-top")) 
                                    ? 'MALE'
                                    : 'FEMALE', 
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
                    $('#character-gender').text(character.gender.charAt(0).toUpperCase() +
                                                character.gender.slice(1).toLowerCase());
                }
            });
        });

        // Cleanup after closure of modal.
        $('#editModal')
            .on('hidden.bs.modal', function () {
                $('#edit-class').val('');
                $('#edit-character').removeClass('active');
            })
            .on('show.bs.modal', function () {
                $('#edit-character-name-input').val($('#character-name > h3').text());
                $('#edit-class').val($('#character-class').text());

                //Transform the switch according to the selected character.
                var transform = $("#character-gender").text() === "Male" 
                    ? parseInt($("#edit-gender").css("margin-top"))
                    : ($("#edit-gender").innerWidth() - 
                       $("#edit-gender .switcher").innerWidth() - 
                       parseInt($("#edit-gender").css("margin-top")));
                translateSwitch($('#edit-gender .switcher'), transform);
            });

    /**
     *  DELETION
     */

        $('#confirm-delete').click(function () {
            // Get the character's id.
            var idToDelete = $('#character-list-table tbody tr.success').attr('id');

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

                    // Clear out old character info.
                    $('#character-info-table > tbody, #character-name > h3').empty();
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
                // Send the character name to the info panel.
                $('#character-name > h3').text(character.name);

                // Do something with the character list.
                var $characterInfo = $(characterInfoRowTemplate);
                $characterInfo.find('#character-class').text(character.classType);
                $characterInfo.find('#character-gender').text(character.gender.charAt(0).toUpperCase() +
                                                              character.gender.slice(1).toLowerCase());
                $characterInfo.find('#character-level').text(character.level);
                $characterInfo.find('#character-money').text(character.money);
                $('#character-info-table > tbody').html($characterInfo);
            }
        );
    });

    // Set up handlers for character information clicks.
    $(document).on('click', '#character-info-table tbody > tr', function() {
        // Change the color of the table to let the user know which
        // attribute is selected.
        $('#character-info-table tbody > tr').not(this).removeClass('success');
        $(this).toggleClass('success');
    });

/** 
 *  ROLL
 */

    // Roll level buttons.
    $('#roll-level').click(function () {
        $('#create-level').val(Math.floor(Math.random() * MAX_LEVEL) + 1);
    });

    // Roll money button.
    $('#roll-money').click(function () {
        $('#create-money').val(Math.floor(Math.random() * MAX_MONEY) + 1);
    });

/**
 *  ITEMS
 */

     // Spawn a random item.
    $('#spawn-item').click(function () {
        $('#item-list').append('<tr><td>Not Available</td><td>At This Time</td></tr>');
    });

/**
 *  INITIAL PAGE LOAD
 */

    // Show character list loader.
    $('.character-list-loader').show();

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

    $("#create-gender").dragSelect({
        values : {
            left: "Male",
            right: "Female"
        },
        shape: "square",
        leftActive: true,
        color: "light",
        width: 510,
        height: 45
    });

    $("#edit-gender").dragSelect({
        values : {
            left: "Male",
            right: "Female"
        },
        shape: "square",
        leftActive: true,
        color: "light",
        width: 510,
        height: 45
    });

});
