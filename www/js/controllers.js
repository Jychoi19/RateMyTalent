angular.module('RateMyTalent.controllers', [])

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
