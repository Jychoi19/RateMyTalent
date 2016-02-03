angular.module('RateMyTalent.controllers', [])

.controller('HomeCtrl', function($scope, $state) {  
  var userRef = new Firebase("https://ratemytalent.firebaseio.com/users");
  userRef.onAuth(function(authData) {
    if (authData) {
      $state.go("tab.mytalents");
    } 
  });
  $scope.FbLogin = function() {
    //userRef.authWithOAuthRedirect("facebook", function(error) {
      //if (error.code === "TRANSPORT_UNAVAILABLE") {
        userRef.authWithOAuthPopup("facebook", function(authData) {
          // User successfully logged in. We can log to the console
          // since we’re using a popup here
          $state.transitionTo("tab.mytalents");
        });
      //} else {
        // Another error occurred
       // console.log(error);
      //}
    //});
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
  $scope.resetPasswordConfirmation = function() {
    $ionicPopup.show({
      template: '<input type="text" ng-model="user.sendEmail">',
      title: 'Password Reset',
      subTitle: 'Please enter your email address to continue',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        { 
          text: '<b>Send</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.user.sendEmail) {
              e.preventDefault();
            } else {
              $scope.resetPassword($scope.user.sendEmail);
            }
          }
        }
      ]
    })
  };
  $scope.resetPassword = function(email) {
    ref.resetPassword({
      email : email
    }, function(error) {
      if (error === null) {
        $ionicPopup.alert({
          title: 'Success',
          template: "Password reset email sent successfully"
        })
      } else {
        $ionicPopup.alert({
          title: 'Error',
          template: error
        })
      }
    })
  };
})

.controller('PasswordChangeCtrl', function($scope ,$state, $ionicPopup) {
  $scope.user = {};
  var ref = new Firebase("https://ratemytalent.firebaseio.com");
  $scope.changePassword = function() {
    if($scope.user.newPassword === $scope.user.newPasswordConfirmation) {
      ref.changePassword({
        email       : $scope.user.email,
        oldPassword : $scope.user.oldPassword,
        newPassword : $scope.user.newPassword
      }, function(error) {
        if (error === null) {
          $ionicPopup.alert({
            title: 'Success',
            template: "Password changed successfully"
          }).then(function(res) {
            if(res) { $state.transitionTo('tab.settings') };
    });;
        } else {
          $ionicPopup.alert({
            title: 'Error',
            template: error
          });
        }
      });
    } else {
      $ionicPopup.alert({
        title: 'Error',
        template: "The new passwords do not match!"
      });  
    };
  };
})

.controller('MyTalentsCtrl', function($scope, Auth, myTalents) {
  Auth.$onAuth(function(authData) {
    if (authData !== null) {
      if (authData.password) {
        console.log("Logged in as " + authData.password.email)
      } else {
        console.log("Logged in as " + authData.facebook.displayName);
      }
      $scope.authData = authData; 
    } else {
      console.log("Not logged in")
    }
  }); 

  $scope.talents = myTalents.all();
})

.controller('HistoryCtrl', function($scope, MyHistory) {
  $scope.history = MyHistory.all();
  $scope.remove = function(talent) {
    MyHistory.remove(talent);
  };
})

.controller('HistoryDetailCtrl', function($scope, $stateParams, MyHistory) {
  $scope.history = MyHistory.get($stateParams.talentId);
})

.controller('RatingsCtrl', function($scope, MyHistory) {
  $scope.history = MyHistory.all();
})

.controller('SettingsCtrl', function($scope, $state, $ionicPopup, Auth) {
  var ref = new Firebase("https://ratemytalent.firebaseio.com");
  $scope.passwordChange = function() {
    $state.transitionTo("tab.settings-passwordchange");
  }
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
    if (Auth.$getAuth().password) {
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
    } else {
      return;
    }
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