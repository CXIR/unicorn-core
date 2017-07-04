'use strict';

/**
* View : rides
*/
shareAppControllers.controller('ridesCtrl',['$scope','$location',
    function($scope,$location){
      $scope.loaded = false;

      /** Get all comming rides **/
      var getRides = function() {
        $http.get('/rides/comming')
        .then(function(res){
          if(res.data.result == -1){
            console.log('FAIL : '+ res.data.message);
          }
          else {
            $scope.rides = res.data;
            $scope.loaded = true;
          }
        },function(res){ console.log('FAIL : '+ res.data); });
      }; getRides();
]);
