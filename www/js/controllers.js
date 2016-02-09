angular.module('RateMyTalent.controllers', [])

.controller('WelcomeCtrl', function($scope, $state, $ionicLoading, $ionicPopup) {  
  var userRef = new Firebase("https://ratemytalent.firebaseio.com/users");
  
  userRef.onAuth(function(authData) {
    if (authData) {
      $state.go("tab.mytalents");
    } 
  });

  $scope.FbLogin = function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    userRef.authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Error',
          template: error
        });
        console.log(error);
      } else {
        $ionicLoading.hide();
        $state.transitionTo("tab.mytalents");
      };
    });
  };
})



.controller('SignupCtrl', function($scope, $state, $ionicPopup, $timeout, $ionicLoading) {
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



.controller('LoginCtrl', function($scope ,$state, $ionicPopup, $ionicLoading) {
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



.controller('MyTalentsCtrl', function($scope, myTalents, Auth) {
  Auth.$onAuth(function(authData){
    if (authData) {
      $scope.authData = authData; 
    } else { return; }
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



.controller('UploadCtrl', function($scope, $cordovaCapture, $cordovaCamera, $ionicPopup) {
  $scope.captureVideo = function() {
    var options = { limit: 3, duration: 15 };

    $cordovaCapture.captureVideo(options).then(function(videoData) {
      // Success! Video data is here! Upload to S3
    }, function(error) {
      $ionicPopup.alert({
        title: 'Error',
        template: error
      })
    });
  }
  $scope.takePhoto = function() {
    $scope.capturedImage = ''; 

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 200,
      targetHeight: 200,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.capturedImage = "data:image/jpeg;base64," + imageData;
    }, function(error) {
      $ionicPopup.alert({
        title: 'Error',
        template: error
      })
    });
  }


        // var appId = '1696067264010821';
        // var roleArn = 'arn:aws:iam::034184894538:role/ratemytalent-role';
        // var bucketName = 'ratemytalent';
        // AWS.config.region = 'us-east-1';

        // var fbUserId = '10102811994572186';
        // var bucket = new AWS.S3({
        //     params: {
        //         Bucket: bucketName
        //     }
        // });
        // var fileChooser = document.getElementById('file-chooser');
        // var button = document.getElementById('upload-button');
        // var results = document.getElementById('results');
        // button.addEventListener('click', function () {
        //   bucket.config.credentials = new AWS.WebIdentityCredentials({
        //             ProviderId: 'graph.facebook.com',
        //             RoleArn: roleArn,
        //             WebIdentityToken: "CAAYGkG7JWkUBADNrTKirpmdM8F9JU66E8wBQbBCTil7Im9Hr5CxgD4ZCTi3BTDv166VCASsWxidVjTvy4Tvljv3iKZB3P6UZAVbWvofZB4XdZCCDzed8wYzgbajrsyqOkONnZAt1mHInFIwp0v8lHl5jiRieyLsCBAreX5phIznPL2o9AhM1su9s5BnGtrKiPnBnPbjaHgJQZDZD",
        //         });
        //     var file = fileChooser.files[0];
        //     if (file) {
        //         results.innerHTML = '';
        //         //Object key will be facebook-USERID#/FILE_NAME
        //         var objKey = 'facebook-' + fbUserId + '/' + file.name;
        //         var params = {
        //             Key: objKey,
        //             ContentType: file.type,
        //             Body: file,
        //             ACL: 'public-read'
        //         };
        //         bucket.putObject(params, function (err, data) {
        //             if (err) {
        //                 results.innerHTML = 'ERROR: ' + err;
        //             } else {
        //                 listObjs();
        //             }
        //         });
        //     } else {
        //         results.innerHTML = 'Nothing to upload.';
        //     }
        // }, false);
        // function listObjs() {
        //     var prefix = 'facebook-' + fbUserId;
        //     bucket.listObjects({
        //         Prefix: prefix
        //     }, function (err, data) {
        //         if (err) {
        //             results.innerHTML = 'ERROR: ' + err;
        //         } else {
        //             var objKeys = "";
        //             data.Contents.forEach(function (obj) {
        //                 objKeys += obj.Key + "<br>";
        //             });
        //             results.innerHTML = objKeys;
        //         }
        //     });
        // }


})



.controller('RatingsCtrl', function($scope, MyHistory) {
  $scope.history = MyHistory.all();
})



.controller('SettingsCtrl', function($scope, $state, $ionicPopup, Auth) {
  var ref = new Firebase("https://ratemytalent.firebaseio.com");

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

  $scope.passwordChange = function() {
    $state.transitionTo("tab.settings-passwordchange");
  };
  $scope.logOutAccount = function(){
    ref.unauth();
    $ionicPopup.alert({
      title: 'Success',
      template: "You have successfully logged out"
    }).then( $state.go("welcome") );
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
          }).then( $state.go("welcome") );
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