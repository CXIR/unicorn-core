'use strict';

/**
* View : rides
*/
shareAppControllers.controller('ridesCtrl',['$scope','$location','$http',
    function($scope,$location,$http){
      $scope.loaded = false;

      /** Get all comming rides **/
      var getRides = function() {
        $http.get('/ride/comming')
        .then(function(res){
          if(res.data.result == -1){
            console.log('FAIL : '+ res.data.message);
          }
          else {
            $scope.rides = res.data;
            $scope.loaded = true;
          }
        }, function(res){ console.log('FAIL : '+ res.data); });
      }; getRides();

    }
]);
