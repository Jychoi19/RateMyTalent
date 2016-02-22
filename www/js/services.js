angular.module('RateMyTalent.services', [])

.factory('myTalents', function(){
  var myUploadedTalents = [{
    id: 0,
    title: 'Airchair',
    type: 'picture',
    uploadDate: 'Jan 27, 2016',
    viewCount: '877',
    voters: '55',
    averageRating: '6.7',
    source: 'img/talents/airchair.jpg',
    description: 'My first airchair at a jam'
  }, {
    id: 1,
    title: 'My Set',
    type: 'video',
    uploadDate: 'Jan 15, 2016',
    viewCount: '5,559',
    voters: '334',
    averageRating: '9.7',
    source: 'img/talents/myset.mp4',
    description: 'This was one of my sets from 5 years ago!!'
  }, {
    id: 2,
    title: 'Drawing',
    type: 'picture',
    uploadDate: 'Jan 9, 2016',
    viewCount: '3,567',
    voters: '278',
    averageRating: '9.1',
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
  var totalTalents = [{
    id: 0,
    title: 'Barstars',
    type: 'picture',
    uploadDate: 'Dec 7, 2015',
    viewCount: '8127',
    voters: '551',
    averageRating: '6.7',
    source: 'img/talents/barstars.jpg',
    description: 'BARSTARRRZZZZZ'
  }, {
    id: 1,
    title: 'Girl Drawing',
    type: 'picture',
    uploadDate: 'Dec 14, 2015',
    viewCount: '2967',
    voters: '118',
    averageRating: '3.2',
    source: 'img/talents/girl-drawing.jpg',
    description: 'My first animation drawing'
  }, {
    id: 2,
    title: 'Kanye',
    type: 'picture',
    uploadDate: 'Dec 15, 2016',
    viewCount: '13,203',
    voters: '875',
    averageRating: '8.1',
    source: 'img/talents/kanye.jpg',
    description: 'I wish this was me rapping'
  }, {
    id: 3,
    title: 'Girl Singing',
    type: 'picture',
    uploadDate: 'Dec 18, 2015',
    viewCount: '17,111',
    voters: '2,001',
    averageRating: '9.7',
    source: 'img/talents/girl-singing.jpg',
    description: "Im singing a cover of Alessia Cara's Here" 
  }, {
    id: 4,
    title: 'Guitar Playing',
    type: 'picture',
    uploadDate: 'Dec 24, 2015',
    viewCount: '5017',
    voters: '758',
    averageRating: '1.2',
    source: 'img/talents/guitar-playing.jpg',
    description: 'I started guitar two months ago!'
  }, {
    id: 5,
    title: 'jumping-pic',
    type: 'picture',
    uploadDate: 'Jan 1, 2016',
    viewCount: '4,143',
    voters: '298',
    averageRating: '5.1',
    source: 'img/talents/jumping-pic.jpg',
    description: "How's our jumping timing??"
  }, {
    id: 6,
    title: '물구나무',
    type: 'picture',
    uploadDate: 'Jan 21, 2016',
    viewCount: '4567',
    voters: '116',
    averageRating: '4.7',
    source: 'img/talents/handstand.jpg',
    description: "45세인나....물구나무 처음해본다"
  }, {
    id: 7,
    title: 'toy',
    type: 'video',
    uploadDate: 'Nov 11, 2015',
    viewCount: '777',
    voters: '111',
    averageRating: '4.1',
    source: 'img/talents/small.mp4',
    description: "Guess what this is??"
  }];

  return {
    all: function() {
      return totalTalents;
    },
    remove: function(talent) {
      totalTalents.splice(totalTalents.indexOf(talent), 1);
    },
    random: function(talent){
      var shuffled = [];
        while(talent.length) {
            var index = Math.floor(Math.random() * (talent.length));
            shuffled.push(talent[index]);
            talent.splice(index, 1);
        }
        return shuffled;
    },
    get: function(talentId) {
      for (var i = 0; i < totalTalents.length; i++) {
        if (totalTalents[i].id === parseInt(talentId)) {
          return totalTalents[i];
        }
      }
      return null;
    }
  };
})



.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https//ratemytalent.firebaseio.com/users");
  return $firebaseAuth(usersRef);
})