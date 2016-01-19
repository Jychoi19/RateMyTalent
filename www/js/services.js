angular.module('RateMyTalent.services', [])

.factory('MyHistory', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var viewedTalents = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return viewedTalents;
    },
    remove: function(talent) {
      viewedTalents.splice(viewedTalents.indexOf(talent), 1);
    },
    get: function(talentId) {
      for (var i = 0; i < viewedTalents.length; i++) {
        if (viewedTalents[i].id === parseInt(talentId)) {
          return viewedTalents[i];
        }
      }
      return null;
    }
  };
});
