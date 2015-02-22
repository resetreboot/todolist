/* Small library to deal with the localStorage with in a simpler way. I also expect it'll make the
   code clearer to read and minimize errors */

// Now time for some constants
var PREFIX = "ToDoList_";

// Now time for some GETs
function getListTitle(listID) {
  return localStorage.getItem(PREFIX + 'list' + listID);
}

function getListItemCount(listID) {
  return parseInt(localStorage.getItem(PREFIX + listID + '_element_count'));
}

function getAllLists() {
  var maxLists = parseInt(localStorage.getItem('ToDoList_LastID'));
  console.log('LastID: ' + maxLists);
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
  if(localStorage.getItem(PREFIX + 'LastID')) {
    lastID = parseInt(localStorage.getItem(PREFIX + 'LastID'));
  } else {
    localStorage.setItem(PREFIX + 'LastID', 0);
  }
  
  var finalID = 0;
  if(lastID != 0) {
    var count = 0;
    while((localStorage.getItem(PREFIX + 'list' + count)) && (count < lastID)) {
      count++;      
    }
    
    if(count < lastID) {
      finalID = count;
    } else {
      finalID = lastID;
      lastID++;
      localStorage.setItem(PREFIX + 'LastID', lastID);
    }
  } else {
    finalID = 0;
    lastID = 1;
    localStorage.setItem(PREFIX + 'LastID', lastID);
  }
  
  localStorage.setItem(PREFIX + 'list' + finalID, text);
  
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
  localStorage.setItem(PREFIX + listID + '_element_' + elementPosition + '_checked', 'false');
  
  localStorage.setItem(PREFIX + listID + '_element_count', numElements);
  
  return elementPosition;
}

function checkItem(listID, itemID) {
  if(itemExists(listID, itemID)) {
    localStorage.setItem(PREFIX + listID + '_element_' + itemID + '_checked', 'true'); 
  }
}

function uncheckItem(listID, itemID) {
  if(itemExists(listID, itemID)) {
    localStorage.setItem(PREFIX + listID + '_element_' + itemID + '_checked', 'false'); 
  }
}

// Delete functions
function deleteItem(listID, itemID) {
  var maxElementID = getListItemCount(listID);
  
  if(itemExists(listID, itemID)) {
    localStorage.removeItem(PREFIX + listID + '_element_' + itemID);
    localStorage.removeItem(PREFIX + listID + '_element_' + itemID + '_checked');
    
    if(itemID == (maxElementID - 1)) {
      localStorage.setItem(PREFIX + listID + '_element_count', itemID);
    }
  }
}

function deleteList(listID) {
  var maxItemID = getListItemCount(listID);
  
  for(var count = 0; count < maxItemID; count++) {
    deleteItem(listID, count);
  }
  
  localStorage.removeItem(PREFIX + listID + '_element_count');
  localStorage.removeItem(PREFIX + 'list' + listID);
  
  if (listID == (localStorage.getItem(PREFIX + 'LastID') - 1)) {
    localStorage.setItem(PREFIX + 'LastID', listID);
  }
  
  if (listID == 0) {
    localStorage.removeItem(PREFIX + 'LastID');
  }
}