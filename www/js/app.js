angular.module('RateMyTalent', ['ionic', 
  'RateMyTalent.controllers', 
  'RateMyTalent.services', 
  'RateMyTalent.directives', 
  'firebase', 
  'ngCordova'])

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
  $urlRouterProvider.otherwise('/welcome');
  $stateProvider
    .state('welcome', {
      url: '/welcome',
      controller: 'WelcomeCtrl',
      templateUrl: 'templates/authentication/welcome.html'
    })  
    .state('signup', {
      url: '/signup',
      controller: 'SignupCtrl',
      templateUrl: 'templates/authentication/signup.html'
    })
    .state('login', {
      url: '/login',
      controller: 'LoginCtrl',
      templateUrl: 'templates/authentication/login.html'
    })     
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs/tabs.html'
    })
    .state('tab.mytalents', {
      url: '/mytalents',
      views: {
        'tab-mytalents': {
          templateUrl: 'templates/tabs/tab-mytalents.html',
          controller: 'MyTalentsCtrl'
        }
      }
    })
    .state('tab.history', {
      url: '/history',
      views: {
        'tab-history': {
          templateUrl: 'templates/tabs/tab-history.html',
          controller: 'HistoryCtrl'
        }
      }
    })
    .state('tab.history-detail', {
      url: '/history/:talentId',
      views: {
        'tab-history': {
          templateUrl: 'templates/tabs/tab-history-detail.html',
          controller: 'HistoryDetailCtrl'
        }
      }
    })
    .state('tab.upload', {
      url: '/upload',
      views: {
        'tab-upload': {
          templateUrl: 'templates/tabs/tab-upload.html',
          controller: 'UploadCtrl'
        }
      }
    })
    .state('tab.upload-detail', {
      url: '/upload-detail',
      views: {
        'tab-upload': {
          templateUrl: 'templates/tabs/tab-upload-detail.html',
          controller: 'UploadCtrl'
        }
      }
    })   
    .state('tab.ratings', {
      url: '/ratings',
      views: {
        'tab-ratings': {
          templateUrl: 'templates/tabs/tab-ratings.html',
          controller: 'RatingsCtrl'
        }
      }
    })
    .state('tab.settings', {
      url: '/settings',
      views: {
        'tab-settings': {
          templateUrl: 'templates/tabs/tab-settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })
    .state('tab.settings-passwordchange', {
      url: '/settings/passwordchange',
      views: {
        'tab-settings': {
        templateUrl: 'templates/authentication/passwordchange.html',
        controller: 'PasswordChangeCtrl'
      }
    }
  })  
});
