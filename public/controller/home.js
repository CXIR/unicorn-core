'use strict';

shareAppControllers.controller('homeCtrl',['$scope','$location','$http',
  function($scope,$location,$http){
    var current = 3;

    $http.get('/users/'+current)
    .then(function(res){
      if(res.data.result == 0){

      }
      else{
        $scope.user = res.data;

        $http.get('ride/comming/driver/'+res.data.id)
        .then(function(res){
          $scope.rides = res.data;
        }, function(res){ console.log('FAIL : '.res.data); });

      }
    },function(res){ console.log('FAIL : '+res.data.message); });

  }
]);
