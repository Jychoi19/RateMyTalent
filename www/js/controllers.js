angular.module('RateMyTalent.controllers', [])

.controller('HomeCtrl', function($scope, $state, Auth) {
  $scope.login = function() {
    Auth.$authWithOAuthRedirect("facebook").then(function(authData) {
      // User successfully logged in
    }).catch(function(error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        Auth.$authWithOAuthPopup("facebook").then(function(authData) {
          // User successfully logged in. We can log to the console
          // since we’re using a popup here
          console.log(authData);
          $state.transitionTo("tab.mytalents");
        });
      } else {
        // Another error occurred
        console.log(error);
      }
    });
  };
  // $scope.loggedIn = function(){
  //   Auth.$onAuth(function(authData) {
  //     if (authData === null) {
  //       console.log("Not logged in yet");
  //     } else {
  //       console.log("Logged in as", authData.uid);
  //     }
  //     $scope.authData = authData; // This will display the user's name in our view
  //   });
  // };
  $scope.emailImgUrl = "./img/buttons/email-button.png"
  $scope.facebookImgUrl = "./img/buttons/facebook-button.png"
  $scope.onTouchFb = function() {
    $scope.facebookImgUrl = "./img/buttons/facebook-button-click.png";
  }
  $scope.onTouchEmail = function() {
    $scope.emailImgUrl = "./img/buttons/email-button-click.png";
  }
  $scope.onReleaseFb = function() {
    $scope.facebookImgUrl = "./img/buttons/facebook-button.png";
    $scope.login();
  }
  $scope.onReleaseEmail = function() {
    $scope.emailImgUrl = "./img/buttons/email-button.png";
    $state.transitionTo("signup");
  }
})

.controller('SignupCtrl', function($scope, $state) {
  $scope.user = {};
  $scope.errors = null;
  var ref = new Firebase("https://ratemytalent.firebaseio.com");

  $scope.createAccount = function(){
    if($scope.user.password === $scope.user.passwordConfirmation) {
      ref.createUser({
        email    : $scope.user.email,
        password : $scope.user.password
      }, function(error, userData) {
        $scope.$apply(function(){
          if (error) {
            console.log(error);
            $scope.errors = "" + error;
          } else {
            console.log("Successfully created user account with uid:", userData.uid);
            $state.transitionTo("tab.mytalents");
          }
        });
      });
    } else {
      $scope.errors = "Error: The passwords do not match.";
    }
  }
})

.controller('MyTalentsCtrl', function($scope) {})

.controller('HistoryCtrl', function($scope, MyHistory) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

$scope.history = MyHistory.all();
$scope.remove = function(talent) {
  MyHistory.remove(talent);
};
})

.controller('HistoryDetailCtrl', function($scope, $stateParams, MyHistory) {
  $scope.history = MyHistory.get($stateParams.talentId);
})

.controller('RatingsCtrl', function($scope) {})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableVisibility: true,
    enableContact: false
  };
});
