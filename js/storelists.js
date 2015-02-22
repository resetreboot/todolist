/* Small library to deal with the localStorage with in a simpler way. I also expect it'll make the
   code clearer to read and minimize errors */

// Now time for some constants
var PREFIX = "ToDoList_";

// Now time for some GETs
function getListTitle(listID) {
  return localStorage.getItem(PREFIX + 'list' + listID);
}

function getListItemCount(listID) {
  return localStorage.getItem(PREFIX + listID + '_element_count');
}

function getAllLists() {
  var maxLists = localStorage.getItem('ToDoList_LastID');
  var allLists = [];
  
  for(var count = 0; count < maxLists; count++) {
    listTitle = getListTitle(count);
    if (listTitle) {
      allLists.push({listID: count, title: listTitle});
    }
  }
  
  return allLists;
}

function getItemText(listID, itemID) {
  return localStorage.getItem(PREFIX + listID + '_element_' + itemID);
}

function isItemChecked(listID, itemID) {
  var checked = localStorage.getItem(PREFIX + listID + '_element_' + itemID + '_checked');
  return checked == 'true';
}

function itemExists(listID, itemID) {
  if (localStorage.getItem(PREFIX + listID + '_element_' + itemID)) {
    return true;
  } else {
    return false;
  }
}

// INSERTs and SETs
function createList(text) {
  var lastID = 0;
  if(localStorage.getItem('ToDoList_LastID')) {
    lastID = localStorage.getItem('ToDoList_LastID');
  }
  
  var finalID = 0;
  if(lastID !== 0) {
    var count = 0;
    while((localStorage.getItem('ToDoList_list' + count)) && (count < lastID)) {
      count++;      
    }
    
    if(count < lastID) {
      finalID = lastID;
    } else {
      finalID = lastID;
      lastID++;
    }
  }
  
  localStorage.setItem('ToDoList_list' + finalID, newListName);
  localStorage.setItem('ToDoList_LastID', lastID);
  
  return finalID;
}
function insertItem(listID, text) {
  var numElements = getListItemCount(listID);
  var elementPosition = 0;
  
  if((numElements) && (numElements > 0)) {
    var count = 0;
    while ((itemExists(listID, count)) && (count < numElements)) {
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
  
  localStorage.setItem(PREFIX + listID + '_element_' + elementPosition, text);
  localStorage.setItem(PREFIX + listID + '_element_' + count + '_checked', 'false');
  
  localStorage.setItem(PREFIX + listID + '_element_count', numElements);
}