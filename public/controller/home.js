'use strict';

shareAppControllers.controller('homeCtrl',['$scope','$location','$http','Current',
  function($scope,$location,$http,Current){

    var car = null;
    var valid = 0;

    /** current INFORMATION */

    $http.get('/users/'+Current.user.info.id)
    .then(function(res){
      if(res.data != 0){
        $scope.current = res.data;
        $http.get('/vehicle/byuser/'+res.data.id)
        .then(function(res){
          if(res.data.result != 0){
            $scope.car = res.data;
            return res.data.result;
          }
        },function(res){ console.log('FAIL : '+res.data); });
      }
    },function(res){ console.log('FAIL : '+res.data); });

    /** COMMING RIDES */

    $http.get('/ride/comming/driver/'+Current.user.info.id)
    .then(function(res){
      if(res.data.result == 1){
        $scope.d_comming = res.data.content;
      }
      else $scope.d_comming = 0;
    },function(res){ console.log('FAIL : '+res.data); });

    $http.get('/ride/comming/passenger/'+Current.user.info.id)
    .then(function(res){
      if(res.data.result == 1){
        $scope.p_comming = res.data.content;
      }
      else $scope.p_comming = 0;
    },function(res){ console.log('FAIL : '+res.data); });

    var getNext = function(){
      if($scope.d_comming != 0) return $scope.d_comming;
      else if ($scope.p_comming != 0) return $scope.p_comming;
      else return 0;
    }; getNext();

    /** PASSED RIDES */

    $http.get('/ride/passed/driver/'+Current.user.info.id)
    .then(function(res){
        if(res.data.result == 1){
          $scope.d_passed = res.data.content;
        }
        else $scope.d_passed = 0;
    },function(res){ console.log('FAIL : '+res.data); });

    $http.get('/ride/passed/passenger/'+Current.user.info.id)
    .then(function(res){
      if(res.data.result == 1){
        $scope.p_passed = res.data.content;
      }
      else $scope.p_passed = 0;
    },function(res){ console.log('FAIL : '+res.data); });

    /** RIDES REQUESTS */

    $http.get('passenger_request/sended/'+Current.user.info.id)
    .then(function(res){
      if(res.data.result == 1){
        $scope.s_requests = res.data.content;
      }
    },function(res){  console.log('FAIL : '+res.data); });

    $http.get('passenger_request/received/'+Current.user.info.id)
    .then(function(res){
      if(res.data.result == 1){
        $scope.r_requests = res.data.content;
      }
    },function(res){ console.log('FAIL : '+res.data); });

    $scope.proposeRide = function(){
      $location.path('/proposal/'+Current.user.info.id);
    }

    /** POP */

    $scope.userPop = function(user){

    }

    $scope.ridePop = function(ride){

    }

  }
]);
