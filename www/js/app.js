angular.module('RateMyTalent', ['ionic', 'RateMyTalent.controllers', 'RateMyTalent.services', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {  
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: 'templates/home.html'
    })  
    .state('signup', {
      url: '/signup',
      controller: 'SignupCtrl',
      templateUrl: 'templates/signup.html'
    })
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tab.mytalents', {
      url: '/mytalents',
      views: {
        'tab-mytalents': {
          templateUrl: 'templates/tab-mytalents.html',
          controller: 'MyTalentsCtrl'
        }
      }
    })
    .state('tab.history', {
      url: '/history',
      views: {
        'tab-history': {
          templateUrl: 'templates/tab-history.html',
          controller: 'HistoryCtrl'
        }
      }
    })
    .state('tab.history-detail', {
      url: '/history/:talentId',
      views: {
        'tab-history-detail': {
          templateUrl: 'templates/history-detail.html',
          controller: 'HistoryDetailCtrl'
        }
      }
    })
    .state('tab.ratings', {
      url: '/ratings',
      views: {
        'tab-ratings': {
          templateUrl: 'templates/tab-ratings.html',
          controller: 'RatingsCtrl'
        }
      }
    })
    .state('tab.settings', {
      url: '/settings',
      views: {
        'tab-settings': {
          templateUrl: 'templates/tab-settings.html',
          controller: 'SettingsCtrl'
        }
      }
    });
});
