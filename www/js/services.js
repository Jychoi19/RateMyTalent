angular.module('RateMyTalent.services', [])

.factory('myTalents', function(){
    var myUploadedTalents = [{
    id: 0,
    name: 'Airchair',
    type: 'picture',
    uploadDate: 'Jan 27, 2016',
    viewCount: '877',
    voters: '55',
    averageRating: '6.7',
    source: 'img/talents/airchair.jpg',
    description: 'My first airchair at a jam'
  }, {
    id: 1,
    name: 'My Set',
    type: 'video',
    uploadDate: 'Jan 15, 2016',
    viewCount: '5,559',
    voters: '334',
    averageRating: '9.7',
    source: 'img/talents/myset.mp4',
    description: 'This was one of my sets from 5 years ago!!'
  }, {
    id: 2,
    name: 'Drawing',
    type: 'picture',
    uploadDate: 'Jan 9, 2016',
    viewCount: '3567',
    voters: '278',
    averageRating: '9.2',
    source: 'img/talents/drawing.jpg',
    description: 'My drawing of an eye'
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
    type: 'picture',
    uploadDate: 'Dec 7, 2015',
    viewCount: '8127',
    voters: '551',
    averageRating: '6.7',
    source: 'img/talents/barstars.jpg',
    description: 'BARSTARRRZZZZZ'
  }, {
    id: 1,
    name: 'Girl Drawing',
    type: 'picture',
    uploadDate: 'Dec 14, 2015',
    viewCount: '2967',
    voters: '118',
    averageRating: '3.2',
    source: 'img/talents/girl-drawing.jpg',
    description: 'My first animation drawing'
  }, {
    id: 2,
    name: 'Kanye',
    type: 'picture',
    uploadDate: 'Dec 15, 2016',
    viewCount: '13,203',
    voters: '875',
    averageRating: '8.1',
    source: 'img/talents/kanye.jpg',
    description: 'I wish this was me rapping'
  }, {
    id: 3,
    name: 'Girl Singing',
    type: 'picture',
    uploadDate: 'Dec 18, 2015',
    viewCount: '17,111',
    voters: '2,001',
    averageRating: '9.7',
    source: 'img/talents/girl-singing.jpg',
    description: "Im singing a cover of Alessia Cara's Here" 
  }, {
    id: 4,
    name: 'Guitar Playing',
    type: 'picture',
    uploadDate: 'Dec 24, 2015',
    viewCount: '5017',
    voters: '758',
    averageRating: '1.2',
    source: 'img/talents/guitar-playing.jpg',
    description: 'I started guitar two months ago!'
  }, {
    id: 5,
    name: 'jumping-pic',
    type: 'picture',
    uploadDate: 'Jan 1, 2016',
    viewCount: '4,143',
    voters: '298',
    averageRating: '5.1',
    source: 'img/talents/jumping-pic.jpg',
    description: "How's our jumping timing??"
  }, {
    id: 6,
    name: 'handstand',
    type: 'picture',
    uploadDate: 'Jan 21, 2016',
    viewCount: '4567',
    voters: '116',
    averageRating: '4.7',
    source: 'img/talents/handstand.jpg',
    description: "I'm 45 and I want to learn how to bboy! Practicing handstands for the first time"
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
