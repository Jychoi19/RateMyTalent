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
      }, function(error, authData) {
        // $scope.$apply(function(){
          if (error) {
            $ionicPopup.alert({
              title: 'Error',
              template: error
            });
          } else {
            // create username
            ref.child("users").child(authData.uid).set({
              provider: 'password',
              username: $scope.user.username
            })
            // authenticate into homepage
            ref.authWithPassword({
              email    : $scope.user.email,
              password : $scope.user.password
            }, function(){});
            $ionicPopup.alert({
              title: 'Success',
              template: "Welcome to RateMyTalent!"
            }).then( $state.go("tab.mytalents") );
          }
        // });
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
  var ref = new Firebase("https://ratemytalent.firebaseio.com");
  $scope.user = {};

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



.controller('UploadCtrl', function($scope, $cordovaCapture, $cordovaCamera, $cordovaFileTransfer, $ionicPopup, $ionicLoading) {
  var ref = new Firebase("https://ratemytalent.firebaseio.com/users");
  ref.onAuth(function(authData) { $scope.authData = authData; });
  var userRef = ref.child($scope.authData.uid);

  $scope.sizeLimit = 10585760; // 10MBs
  $scope.file = {};
  $scope.talent = {};

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
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.capturedImage = "data:image/jpeg;base64," + imageData;
      $scope.picData = imageData;

    }, function(error) {
      $ionicPopup.alert({
        title: 'Error',
        template: error
      })
    });
  }

  $scope.creds = {
    appId: '1112944755382281',
    roleArn: 'arn:aws:iam::034184894538:role/ratemytalent-role',
    bucket: 'ratemytalent',
    access_key: 'AKIAJVT37IJN2NFTM4PQ',
    secret_key: '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'
  }
   
  $scope.upload = function() {
    // // Configure The S3 Object 
    // AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
    // AWS.config.region = 'us-east-1';
    var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });


    // Initialize the Amazon Cognito credentials provider
    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:63bb9540-a8a6-4307-983d-da0df34168bd',
        Logins: { 'graph.facebook.com': 'FBTOKEN' }
    });

    // Initialize the Cognito Sync client
    AWS.config.credentials.get(function(){
      var syncClient = new AWS.CognitoSyncManager();
      syncClient.openOrCreateDataset('myDataset', function(err, dataset) {
        // // Read Records
        // dataset.get('myRecord', function(err, value) {
        //   console.log('myRecord: ' + value);
        // });
        // // Write Records
        // dataset.put('newRecord', 'newValue', function(err, record) {
        //   console.log(record);
        // });

        // // Delete Records
        // dataset.remove('oldKey', function(err, record) {
        //   console.log(success);
        // });
        dataset.put('myKey', 'myValue', function(err, record){
          dataset.synchronize({
            onSuccess: function(data, newRecords) {
              console.log(newRecords);
              // Your handler code here
            }
          });
        });
      });
    })

    // Upload from camera to S3
    // if($scope.capturedImage) {
    //   var options = {
    //     filekey: "file",
    //     fileName: "image.jpeg",
    //     chunkedMode: false,
    //     mimeType: "image/jpeg",
    //   }
    //   $cordovaFileTransfer.upload("https://ratemytalent.s3.amazonaws.com/", $scope.picData, options)
    //     .then(function(result) {
    //         // Success!
    //         // Let the user know the upload is completed
    //         console.log('upload to s3 success ', result);

    //     }, function(err) {
    //         // Error
    //         // Uh oh!
    //         $ionicLoading.show({template : 'Upload Failed', duration: 3000});
    //         console.log('upload to s3 fail ', err);
    //     }, function(progress) {
            
    //         // constant progress updates
    //     })
    //   }



    if($scope.file) {
      
      // Perform File Size Check First
      var fileSize = Math.round(parseInt($scope.file.size));
      if (fileSize > $scope.sizeLimit) {
        $ionicPopup.alert({
          title: 'File Too Large',
          template: 'Sorry, your attachment is too big. <br/> Maximum '  + $scope.fileSizeLabel() + ' file attachment allowed',
        });
        return false;
      }
      // Prepend Unique String To Prevent Overwrites
      var uniqueFileName = $scope.uniqueString() + '-' + $scope.file.name;

      var params = { Key: uniqueFileName, ContentType: $scope.file.type, Body: $scope.file };
      
      if (params.ContentType === "image/jpeg" || 
          params.ContentType === "image/png"  ||
          params.ContentType === "video/mp4"  ||
          params.ContentType === "video/ogg"  ||
          params.ContentType === "video/webm") {
        bucket.putObject(params, function(err, data) {
          if(err) {
            // There Was An Error With Your S3 Config
            $ionicPopup.alert({
              title: 'Error',
              template: err.message,
            })
            return false;
          }
          else {
            // Upload Information to firebase
            var newParamsKey = params.Key.replace(/\..+$/, '');
            userRef.child("uploads").child(newParamsKey).set({ 
              source: ("https://s3.amazonaws.com/ratemytalent/" + params.Key),
              title: $scope.talent.title,
              description: $scope.talent.description,
              uploadDate: Firebase.ServerValue.TIMESTAMP,
            });
            // Success!
            $ionicPopup.alert({
              title: 'Success',
              template: 'Upload Complete',
            });

            // Reset The Progress Bar
            setTimeout(function() {
              $scope.uploadProgress = 0;
              $scope.$digest();
            }, 4000);
          }
        })
        .on('httpUploadProgress',function(progress) {
          // Log Progress Information
          $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
          $scope.$digest();
        });
      } else {
        $ionicPopup.alert({
          title: 'Error',
          template: 'This is not a valid file',
        });
      }
    }
    else {
      // No File Selected
      $ionicPopup.alert({
        title: 'Error',
        template: 'No File Selected',
      });
    }
  }

  $scope.fileSizeLabel = function() {
    // Convert Bytes To MB
    return Math.round($scope.sizeLimit / 1024 / 1024) + 'MB';
  };

  $scope.uniqueString = function() {
    var text     = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }


        // var appId = '1112944755382281';
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



.controller('UploadDetailCtrl', function($scope, $controller) {
  $controller('UploadCtrl', {$scope: $scope});
})



.controller('RatingsCtrl', function($scope, MyHistory) {
  $scope.data = MyHistory.random(MyHistory.all());
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
      template: 'Are you sure you want to log out?',
      buttons: [
        { text: 'Cancel' },
        { 
          text: '<b>Log Out</b>',
          type: 'button-dark',
          onTap: function(e) { return e; }
        }
      ]
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