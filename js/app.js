// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded

function openList(elementClicked) {
  var listID = elementClicked.data('listID');
  var listTitle = localStorage.getItem('ToDoList_list' + listID);
  $('ul#list_display').find('li').remove();
  
  var numElements = localStorage.getItem('ToDoList_' + listID + '_element_count');
  if((numElements) && (numElements > 0)) {
     var text;
     for(var count = 0; count < numElements; count++) {
       text = localStorage.getItem('ToDoList_' + listID + '_element_' + count);
       if(text) {
         var checked = localStorage.getItem('ToDoList_' + listID + '_element_' + count + '_checked');
         var list_display = $('#new_elem_text');
         if (checked == 'true') {
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

function addItemToList(listID, text) {
  var numElements = localStorage.getItem('ToDoList_' + listID + '_element_count');
  var elementPosition = 0;
  if((numElements) && (numElements > 0)) {
    var count = 0;
    while ((localStorage.getItem('ToDoList_' + listID + '_element_' + count)) && (count < numElements)) {
      count++;
    }
    
    if(count < numElements) {
      elementPosition = count;
    } else {
      elementPosition = numElements;
      numElements++;
    }
  } else {
    elementPosition = 0;
    numElements = 1;
  }
  
  localStorage.setItem('ToDoList_' + listID + '_element_' + elementPosition, text);
  localStorage.setItem('ToDoList_' + listID + '_element_' + count + '_checked', 'false');
  
  localStorage.setItem('ToDoList_' + listID + '_element_count', numElements);
  
  var list_display = $('#new_elem_text');
  list_display.before('<li id="element_' + listID + '_' + count +'"><span class="icon minimize"></span>' + text + '</li>');
}

function addNewList(newListName) {
  var lastID = 0;
  if(localStorage.getItem('ToDoList_LastID')) {
    lastID = localStorage.getItem('ToDoList_LastID');
  }
  
  var emptyID = 0;
  if(lastID !== 0) {
    var count = 0;
    while((localStorage.getItem('ToDoList_list' + count)) && (count < lastID)) {
      count++;      
    }
    
    if(count < lastID) {
      emptyID = lastID;
    }
  }
  
  if(emptyID !== 0) {
    localStorage.setItem('ToDoList_list' + lastID, newListName);
    $('li#add_list_last_elem').before('<li><a id="list_' + lastID + '">' + newListName + '</li>');
    $('a#list_' + lastID).click(function () { openList(lastID); });
    lastID++;
    localStorage.setItem('ToDoList_LastID', lastID);  
  } else {
    localStorage.setItem('ToDoList_list' + emptyID, newListName);
    $('li#add_list_last_elem').before('<li><a id="list_' + emptyID + '">' + newListName + '</li>');
    $('a#list_' + emptyID).click(function () { openList(emptyID); });
  }
}

// Loads the lists in the Store element
function loadLists() {
  console.log('Recovering data');
  var maxLists = localStorage.getItem('ToDoList_LastID');
  if(maxLists) {
    console.log('Lists found: ' + maxLists);
    var listData;
    for(var count = 0; count < maxLists; count++) {
       listData = localStorage.getItem('ToDoList_list' + count);
       if(listData) {
          console.log('Adding list item ' + count);
          $('li#add_list_last_elem').before('<li><a id="list_' + count + '">' + listData + '</li>');
          $('a#list_' + count).click(function () { openList($(this)); });
          $('a#list_' + count).data('listID', count);
       }
    }
  }
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
         addNewList(newListName);
      
         $('#new_list_name_input').val('');
      
         $.afui.goBack(); 
      }
    });
    
    $('#add_new_item').click(function() {
      var text = $('#new_elem_text').val();
      
      if((text) && (text.length > 0)) {
        var listID = $('#add_new_item').data('currentlist');
        addItemToList(listID, text);
      }
      
    });
  }
});
