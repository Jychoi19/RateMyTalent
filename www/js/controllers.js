angular.module('RateMyTalent.controllers', [])

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
