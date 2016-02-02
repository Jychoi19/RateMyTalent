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
  }];

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
    name: 'Barstars',
    uploadDate: 'Dec 7, 2015',
    viewCount: '8127',
    voters: '551',
    averageRating: '6.7',
    image: 'img/talents/barstars.jpg'
  }, {
    id: 1,
    name: 'Girl Drawing',
    uploadDate: 'Dec 14, 2015',
    viewCount: '2967',
    voters: '118',
    averageRating: '3.2',
    image: 'img/talents/girl-drawing.jpg'
  }, {
    id: 2,
    name: 'Kanye',
    uploadDate: 'Dec 15, 2016',
    viewCount: '13,203',
    voters: '875',
    averageRating: '8.1',
    image: 'img/talents/kanye.jpg'
  }, {
    id: 3,
    name: 'Girl Singing',
    uploadDate: 'Dec 18, 2015',
    viewCount: '17,111',
    voters: '2,001',
    averageRating: '9.7',
    image: 'img/talents/girl-singing.jpg'
  }, {
    id: 4,
    name: 'Guitar Playing',
    uploadDate: 'Dec 24, 2015',
    viewCount: '5017',
    voters: '758',
    averageRating: '1.2',
    image: 'img/talents/guitar-playing.jpg'
  }, {
    id: 5,
    name: 'jumping-pic',
    uploadDate: 'Jan 1, 2016',
    viewCount: '4,143',
    voters: '298',
    averageRating: '5.1',
    image: 'img/talents/jumping-pic.jpg'
  }, {
    id: 6,
    name: 'handstand',
    uploadDate: 'Jan 21, 2016',
    viewCount: '4567',
    voters: '116',
    averageRating: '4.7',
    image: 'img/talents/handstand.jpg'
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
