// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded

function openList(elementClicked) {
  var listID = elementClicked.data('listID');
  var listTitle = getListTitle(listID);
  $('ul#list_display').find('li').remove();
  
  var numElements = getListItemCount(listID);
  if((numElements) && (numElements > 0)) {
     var text;
     for(var count = 0; count < numElements; count++) {
       text = getItemText(listID, count);
       if(text) {
         var list_display = $('#new_elem_text');
         if (isItemChecked(listID, count)) {
           list_display.before('<li id="element_' + listID + '_' + count +'"><span class="icon check"></span>' + text + '</li>');
         } else {
           list_display.before('<li id="element_' + listID + '_' + count +'"><span class="icon minimize"></span>' + text + '</li>');
         }
       }
     }  
  }
  
  $('#add_new_item').data('currentlist', listID);
  $.afui.loadContent('#list_panel', false, false, "slide");
  $.afui.setTitle(listTitle);
}

function addItemToListClicked(listID, text) {
  insertItem(listID, text);
  
  var list_display = $('#new_elem_text');
  list_display.before('<li id="element_' + listID + '_' + count +'"><span class="icon minimize"></span>' + text + '</li>');
}

function addNewListClicked(newListName) {
  var listID = createList(newListName);
    
  $('li#add_list_last_elem').before('<li><a id="list_' + listID + '">' + newListName + '</li>');
  $('a#list_' + listID).click(function () { openList('a#list_' + listID); });
  $('a#list_' + count).data('listID', listID);
}

// Loads the lists in the Store element
function loadLists() {
  console.log('Recovering data');
  
  var listData = getAllLists();
    
  listData.forEach(function(list, count) {
    console.log('Adding list item ' + count);
    $('li#add_list_last_elem').before('<li><a id="list_' + list.listID + '">' + list.title + '</li>');
    $('a#list_' + list.listID).click(function () { openList($(this)); });
    $('a#list_' + list.listID).data('listID', list.listID);
  });
}

window.addEventListener('DOMContentLoaded', function() {

  // We'll ask the browser to use strict code to help us catch errors earlier.
  // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
  'use strict';

  var translate = navigator.mozL10n.get;

  // We want to wait until the localisations library has loaded all the strings.
  // So we'll tell it to let us know once it's ready.
  navigator.mozL10n.once(start);

  // ---

  function start() {

    // var message = document.getElementById('message');

    // We're using textContent because inserting content from external sources into your page using innerHTML can be dangerous.
    // https://developer.mozilla.org/Web/API/Element.innerHTML#Security_considerations
    // message.textContent = translate('message');
    
    loadLists();
    
    $('#add_list').click(function(){
      $.afui.loadContent('#new_list', false, false, "slide");
    });

    $('#add_new_list_button').click(function(){
      var newListName = $('#new_list_name_input').val();
      
      if((newListName.length > 0) && (newListName != '')) {
         addNewListClicked(newListName);
      
         $('#new_list_name_input').val('');
      
         $.afui.goBack(); 
      }
    });
    
    $('#add_new_item').click(function() {
      var text = $('#new_elem_text').val();
      
      if((text) && (text.length > 0)) {
        var listID = $('#add_new_item').data('currentlist');
        addItemToListClicked(listID, text);
      }
      
    });
  }
});
