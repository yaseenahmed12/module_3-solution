(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);


// DIRECTIVE
function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    },
    controller: NarrowItDownController,
    controllerAs: 'nid',
    bindToController: true
  };
  return ddo;
}

// CONTROLLER
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var nid = this;
  nid.searchTerm = "";
  nid.find = function () {
    MenuSearchService.getMatchedMenuItems(nid.searchTerm).then(function(result) {nid.found=result;});
    console.log(nid.found);
  }

  nid.foundEmpty = function() {
    if (nid.found.length==0){
      return true;
    }
    else {
      return false;
    }
  }

  nid.removeItem = function (itemIndex) {
    // MenuSearchService.removeItem(itemIndex);
    nid.found.splice(itemIndex, 1);
  };
}

// SERVICE
function MenuSearchService($http) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
  var foundItems = [];
  var response = $http({
     method: "GET",
     url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
  });
  return response.then(function (result) {
    for (var j = 0; j < result.data.menu_items.length; j++) {
      if (searchTerm!="" && result.data.menu_items[j].description.toLowerCase().includes(searchTerm.toLowerCase())) {
        console.log(result.data.menu_items[j].name);
        foundItems.push(result.data.menu_items[j]);
      }
    }
      // }
      console.log(foundItems.length);
      // console.log(foundItems);
      // if (foundItems.length==0){
      //   foundItems.push({name: "Nothing is found"});
      // }
      return foundItems;
  });
  };

  // service.removeItem = function (itemIndex) {
  //   foundItems.splice(itemIndex, 1);
  // };  
}

})();
