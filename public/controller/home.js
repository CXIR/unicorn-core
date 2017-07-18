'use strict';

shareAppControllers.controller('homeCtrl',['$scope','$location','$http',
  function($scope,$location,$http){

    var online = 3;
    var car = null;
    var valid = 0;

    /** current INFORMATION */

    $http.get('/users/'+online)
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

    $http.get('/ride/comming/driver/'+online)
    .then(function(res){
      if(res.data.result == 1){
        var comming = res.data.content;
        for(var o of comming){

        }
        $scope.d_comming = comming;
      }
      else $scope.d_comming = 0;
    },function(res){ console.log('FAIL : '+res.data); });

    $http.get('/ride/comming/passenger/'+online)
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

    $scope.next = getNext();
    console.log($scope.next);

    /** PASSED RIDES */

    $http.get('/ride/passed/driver/'+online)
    .then(function(res){
        if(res.data.result == 1){
          $scope.d_passed = res.data.content;
        }
        else $scope.d_passed = 0;
    },function(res){ console.log('FAIL : '+res.data); });

    $http.get('/ride/passed/passenger/'+online)
    .then(function(res){
      if(res.data.result == 1){
        $scope.p_passed = res.data.content;
      }
      else $scope.p_passed = 0;
    },function(res){ console.log('FAIL : '+res.data); });

    /** RIDES REQUESTS */

    $http.get('passenger_request/sended/'+online)
    .then(function(res){
      if(res.data.result == 1){
        $scope.s_requests = res.data.content;
      }
    },function(res){  console.log('FAIL : '+res.data); });

    $http.get('passenger_request/received/'+online)
    .then(function(res){
      if(res.data.result == 1){
        $scope.r_requests = res.data.content;
      }
    },function(res){ console.log('FAIL : '+res.data); });

    $scope.proposeRide = function(){
      $location.path('/proposal/'+online);
    }

    /** POP */

    $scope.userPop = function(user){

    }

    $scope.ridePop = function(ride){

    }

  }
]);
