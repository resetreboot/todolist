// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded

// Dexie to the rescue
var db = new Dexie("ToDoList");
  
db.version(1).stores({
 lists: "++id",
 items: "++id"
});

db.version(2).stores({
 lists: "++id",
 items: "++id,listID"
});


db.open();

function openList(elementClicked) {
  var listID = elementClicked.data('listID');
  
  db.lists.get(listID).then(function(list) {
    var listTitle = list.name;
    $('#list_title').text(listTitle);
    $('ul#list_display').find('li').remove();
  
    db.items.where('listID').equals(listID).each(function(item) {
     console.log(item);
     var text = item.text;
     var identification;
      
     identification = listID + '_' + item.id;
     var list_display = $('#new_elem_text');
     if (item.checked) {
       list_display.before('<li id="element_' + identification +'"><span id="check_' + identification + '" class="icon check"></span>' + text + '</li>');
     } else {
       list_display.before('<li id="element_' + identification +'"><span id="check_' + identification + '" class="icon minimize"></span>' + text + '</li>');
     }
     $('#check_' + identification).data('listID', listID);
     $('#check_' + identification).data('itemID', item.id);
     $('#check_' + identification).click(function () {
      itemClicked($(this));
     });
    });
    
    $('#add_new_item').data('currentlist', listID);
    $('#delete_list').data('currentlist', listID);
    $.afui.loadContent('#list_panel', false, false, "slide"); 
  }).catch(function(err) { console.error(err); });
}

function itemClicked(elementClicked) {
  var listID = elementClicked.data('listID');
  var itemID = elementClicked.data('itemID');
  
  var identification = listID + '_' + itemID;
  db.items.get(itemID).then(function(item) {
    if(!item.checked) {
      db.items.update(item.id, {checked: true});
      $('#check_' + identification).removeClass('minimize');
      $('#check_' + identification).addClass('check');
    } else {
      db.items.update(item.id, {checked: false});
      $('#check_' + identification).removeClass('check');
      $('#check_' + identification).addClass('minimize');
    }
  });
}

function addItemToListClicked(list_ID, txt) {
  console.log('listID ' + list_ID);
  db.items.add({text: txt, listID: list_ID, checked: false}).then(function(itemID) {
    console.log('Adding new item ' + itemID);
    var list_display = $('#new_elem_text');
    var identification = list_ID + '_' + itemID;
    console.log(identification);
    list_display.before('<li id="element_' + identification +'"><span id="check_' + identification + '" class="icon minimize"></span>' + txt + '</li>');
    $('#check_' + identification).data('listID', list_ID);
    $('#check_' + identification).data('itemID', itemID);
    $('#check_' + identification).click(function () {
      itemClicked($(this));
    });
  });
}

function addNewListClicked(newListName) {
  db.lists.add({name: newListName}).then(function(listID) {
    $('li#add_list_last_elem').before('<li><a id="list_' + listID + '">' + newListName + '</li>');
    $('a#list_' + listID).data('listID', listID);
    $('a#list_' + listID).click(function () { openList($(this)); });
    // $.afui.goBack();
  });
}

function deleteListClicked(listID) {
  db.lists.delete(listID);
  
  db.items.where('listID').equals(listID).each(function(item) {
    db.items.delete(item.id);
  });
  
  $('a#list_' + listID).parent().remove();
  $('a#list_' + listID).remove();
  $.afui.goBack();
} 

// Loads the lists in the Store element
function loadLists() {
  console.log('Recovering data');
  
  db.lists.each(function(list) {
    $('li#add_list_last_elem').before('<li><a id="list_' + list.id + '">' + list.name + '</li>');
    $('a#list_' + list.id).click(function () { openList($(this)); });
    $('a#list_' + list.id).data('listID', list.id);
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
      // $.afui.setTitle(translate('new_list'));
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
      
      $('#new_elem_text').val('');
      
    });
    
    $('#delete_list').click(function() {
      var listID = $('#delete_list').data('currentlist');
      deleteListClicked(listID);
    });
    
    $('#reset_app').click(function() {
      $.afui.popup({
        title: translate('warning_popup_title'),
        message: translate('warning_popup_message'),
        cancelText: translate('warning_popup_cancel'),
        doneText: translate('warning_popup_done'),
        doneCallback: function() {
          $('ul#list_of_lists').find('[id^=list_]').parent().remove();
          db.lists.clear();
          db.items.clear();
        },
        cancelOnly: false
      });
    });
  }
});
