angular.module('RateMyTalent.services', [])

.factory('myTalents', function(){
    var myUploadedTalents = [{
    id: 0,
    name: 'Airchair',
    uploadDate: 'Jan 27, 2016',
    viewCount: '877',
    voters: '55',
    averageRating: '6.7',
    image: 'img/talents/airchair.jpg'
  }, {
    id: 1,
    name: 'Drawing',
    uploadDate: 'Jan 24, 2016',
    viewCount: '3567',
    voters: '278',
    averageRating: '9.2',
    image: 'img/talents/drawing.jpg'
  }, {
    id: 2,
    name: 'handstand',
    uploadDate: 'Jan 21, 2016',
    viewCount: '4567',
    voters: '116',
    averageRating: '4.7',
    image: 'img/talents/handstand.jpg'
  },

  ];

  return {
    all: function() {
      return myUploadedTalents;
    },
    remove: function(talent) {
      myUploadedTalents.splice(myUploadedTalents.indexOf(talent), 1);
    },
    get: function(talentId) {
      for (var i = 0; i < myUploadedTalents.length; i++) {
        if (myUploadedTalents[i].id === parseInt(talentId)) {
          return myUploadedTalents[i];
        }
      }
      return null;
    }
  };
})

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
})

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https//ratemytalent.firebaseio.com/users");
  return $firebaseAuth(usersRef);
});
