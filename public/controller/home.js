'use strict';

shareAppControllers.controller('homeCtrl',['$scope','$location','$http','Current','$timeout',
  function($scope,$location,$http,Current,$timeout){

    var car = null;
    var valid = 0;
    var driveFirst = 0;

    $scope.next = 0;




    /*************************** USER INFORMATION ******************************/



    $http.get('/users/'+Current.user.info.id)
    .then(function(res){
      if(res.data.result == 1){
        $scope.current = res.data.content;
        $http.get('/vehicle/byuser/'+res.data.content.id)
        .then(function(res){
          if(res.data.result == 1){
            $scope.car = res.data.content;
          }
          else if(res.data.result == 0){
            $scope.car = 0;
          }
          else{
            $scope.car = 0;
            $scope.notif = {
                              type:'alert-danger',
                              show:true,
                              title:'Oupss !',
                              message:'Nous ne parvenons pas à récupérer votre véhicule.'
                            };
          }
          $timeout(function(){ $scope.notif = {}; },3000);
        },function(res){ console.log('FAIL : '+res.data); });
      }
      else $scope.logout();
    },function(res){ console.log('FAIL : '+res.data); });




    /***************************** COMMING RIDES ******************************/



    $http.get('/ride/comming/driver/'+Current.user.info.id)
    .then(function(res){
      if(res.data.result == 1){
        $scope.d_comming = res.data.content;
        $scope.next = res.data.content[0];
        $scope.next.driver = true;
        driveFirst = 1;
      }
      else $scope.d_comming = 0;
    },function(res){ console.log('FAIL : '+res.data); });

    $http.get('/ride/comming/passenger/'+Current.user.info.id)
    .then(function(res){
      if(res.data.result == 1){
        $scope.p_comming = res.data.content;
        if(driveFirst == 0){
          $scope.next = res.data.content[0];
          $scope.next.driver = false;
        }
      }
      else $scope.p_comming = 0;
    },function(res){ console.log('FAIL : '+res.data); });




    /***************************** PASSED RIDES *******************************/



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
      $location.path('/proposal');
    }



    /***************************** SHOW POP ***********************************/



    $scope.ridePop = function(ride){
      $scope.pop = { display:'opacify', show:true, ride:ride };
    }

    $scope.userPop = function(user){
      $scope.upop = { show:true, display:'opacify', user:user }
    }

    $scope.ridePopSpecial = function(ride){
      $scope.special = { show:true, display:'opacify', ride:ride };
    }



    /*********************** TREATE PASSENGER REQUEST *************************/



    $scope.acceptAsk = function(ask,ride){
      var post = { request:ask.id, ride:ride.id, user:ask.user.id };

      $http.post('/passenger_request/accept',post)
      .then(function(res){
        if(res.data.result == 1){
          ask.acceptedDate = new Date();
        }
        else{
          $scope.special = {};
          $scope.notif = {
                            type:'alert-danger',
                            show:true,
                            title:'Oupsss !',
                            message:'Nous rencontrons des problèmes lors du traitement des requêtes.'
                          };
          $timeout(function(){ $scope.notif = {}; },3000);
        }
      },function(res){ console.log('FAIL : '+res.data); });
    }

    $scope.refuseAsk = function(ask,ride){
      var post = { request:ask.id, ride:ride.id };

      $http.post('/passenger_request/refuse',post)
      .then(function(res){
        if(res.data.result == 1){
          ask.refusedDate = new Date();
        }
        else{
          $scope.special = {};
          $scope.notif = {
                            type:'alert-danger',
                            show:true,
                            title:'Oupsss !',
                            message:'Nous rencontrons des problèmes lors du traitement des requêtes.'
                          };
          $timeout(function(){ $scope.notif = {}; },3000);
        }
      },function(res){ console.log('FAIL : '+res.data); });
    }

    /***************************** MARK A DRIVER ******************************/

    $scope.mark = function(){
      
    }

  }
]);
