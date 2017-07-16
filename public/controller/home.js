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
      }
    },function(res){ console.log('FAIL : '+res.data.message); });

    $http.get('/ride/comming/driver/'+current)
    .then(function(res){
      $scope.d_comming = res.data;
    },function(res){ });

    $http.get('ride/comming/passenger/'+current)
    .then(function(res){
      $scope.p_comming = res.data;
    },function(res){ });

    $http.get('ride/passed/driver'+current)
    .then(function(res){
      $scope.passed = res.data;
      $http.get('/ride/passed/passenger/'+current)
      .then(function(res){
        $scope.passed.push(res.data);
      },function(res){ });
    },function(res){ });

    $http.get('passenger_request/sended'+current)
    .then(function(res){

    },function(res){  });

    $http.get('passenger_request/sended'+current)
    .then(function(res){

    },function(res){ });

    $scope.ridePop =  function(ride){
      $scope.r_pop = {

                      };
    }


  }
]);
