angular.module('RateMyTalent.controllers', [])

.controller('HomeCtrl', function($scope, $state, Auth) {
  Auth.$getAuth(function(authData) {
    if (authData !== null) {
      $state.go("tab.mytalents");
    }
  });
  $scope.FbLogin = function() {
    Auth.$authWithOAuthRedirect("facebook").then(Auth.$onAuth(function(authData) {
      // User successfully logged in
      if (authData !== null) {
        $state.go("tab.mytalents");
      }
    })).catch(function(error) {
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
    })
  };

  $scope.emailImgUrl = "./img/buttons/email-button.png"
  $scope.facebookImgUrl = "./img/buttons/facebook-button.png"
  $scope.onTouchFb = function() {
    $scope.facebookImgUrl = "./img/buttons/facebook-button-click.png";
  }
  $scope.onReleaseFb = function() {
    $scope.facebookImgUrl = "./img/buttons/facebook-button.png";
    $scope.FbLogin();
  }  
  $scope.onTouchEmail = function() {
    $scope.emailImgUrl = "./img/buttons/email-button-click.png";
  }
  $scope.onReleaseEmail = function() {
    $scope.emailImgUrl = "./img/buttons/email-button.png";
    $state.transitionTo("signup");
  }
})

.controller('SignupCtrl', function($scope, $state, $ionicPopup) {
  $scope.user = {};
  var ref = new Firebase("https://ratemytalent.firebaseio.com");

  $scope.createAccount = function(){
    if($scope.user.password === $scope.user.passwordConfirmation) {
      ref.createUser({
        email    : $scope.user.email,
        password : $scope.user.password
      }, function(error, userData) {
        $scope.$apply(function(){
          if (error) {
            $ionicPopup.alert({
              title: 'Error',
              template: error
            });
          } else {
            ref.authWithPassword({
              email    : $scope.user.email,
              password : $scope.user.password
            }, function(){});
            $ionicPopup.alert({
              title: 'Success',
              template: "Welcome to RateMyTalent!"
            }).then( $state.go("tab.mytalents") );
          }
        });
      });
    } else {
      $ionicPopup.alert({
        title: 'Error',
        template: "The passwords do not match."
      });
    }
  }

})

.controller('LoginCtrl', function($scope ,$state, $ionicPopup) {
  $scope.user = {};
  var ref = new Firebase("https://ratemytalent.firebaseio.com");
  $scope.loginAccount = function() {
    ref.authWithPassword({
      email    : $scope.user.email,
      password : $scope.user.password
    }, function(error, authData) {
          if (error) {
            $ionicPopup.alert({
              title: 'Error',
              template: error
            });
          } else {
            $ionicPopup.alert({
              title: 'Success',
              template: 'Welcome back ' + authData.password.email
            }).then( $state.go("tab.mytalents") );
          }
        });
  };
})

.controller('MyTalentsCtrl', function($scope, Auth) {
  Auth.$onAuth(function(authData) {
    if (authData === null) {
      console.log("Not logged in yet");
    } else {
      console.log("Logged in via", authData.provider);
    }
    $scope.authData = authData; // This will display the user's name in our view
  }); 
})

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

.controller('SettingsCtrl', function($scope, $state, $ionicPopup, Auth) {
  var ref = new Firebase("https://ratemytalent.firebaseio.com");
  $scope.logOutAccount = function(){
    ref.unauth();
    $ionicPopup.alert({
      title: 'Success',
      template: "You have successfully logged out"
    }).then( $state.go("home") );
  };
  $scope.confirmLogOutAccount = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Log Out',
      template: 'Are you sure you want to log out?'
    });
    confirmPopup.then(function(res) {
      if(res) { $scope.logOutAccount() };
    });
  };
  $scope.deleteAccount = function(password) {
    $scope.user.password = password;
      ref.removeUser({
        email    : Auth.$getAuth().password.email,
        password : $scope.user.password
      }, function(error) {
        if (error === null) {
          $ionicPopup.alert({
            title: 'Success',
            template: "You have successfully deleted the account"
          }).then( $state.go("home") );
        } else {
          $ionicPopup.confirm({
            title: 'Error',
            template: error
          });
        }
      }); 
  };
  $scope.confirmDeleteAccount = function() {
    $scope.user = {};
    var myPopup = $ionicPopup.show({
      template: '<input type="password" ng-model="user.passwordConfirm">',
      title: 'Are you sure you want to delete your account?',
      subTitle: 'Please enter your password to continue',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        { 
          text: '<b>Delete</b>',
          type: 'button-assertive',
          onTap: function(e) {
            if (!$scope.user.passwordConfirm) {
              e.preventDefault();
            } else {
              return $scope.user.passwordConfirm;
            }
          }
        }
      ]
    });
    myPopup.then(function(password) {
      $scope.deleteAccount(password);
    });
  };
  $scope.settings = {
    enableVisibility: true,
    enableContact: false
  };
});