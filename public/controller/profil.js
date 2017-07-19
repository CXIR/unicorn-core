'use strict';

/**
* View : my profile
*/
shareAppControllers.controller('profilCtrl',['$scope','$location','$http','$routeParams','$timeout','Current',
    function($scope,$location,$http,$routeParams,$timeout,Current){
        var user = $routeParams.user;

        /** USER INFORMATION */
        $http.get('/users/'+user)
        .then(function(res){
          if(res.data != 0){
            $scope.user = res.data;
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
        $http.get('/ride/comming/driver/'+user)
        .then(function(res){
          if(res.data.result == 1){
            $scope.d_comming = res.data.content;
          }
          else $scope.d_comming = 0;
        },function(res){ console.log('FAIL : '+res.data); });

        $http.get('/ride/comming/passenger/'+user)
        .then(function(res){
          if(res.data.result == 1){
            $scope.p_comming = res.data.content;
          }
          else $scope.p_comming = 0;
        },function(res){ console.log('FAIL : '+res.data); });

        $scope.reportUser = function(user){
          $scope.report = {show:true, display:'opacify'}
        }

        $scope.sendReport = function(message){
          var post = {
                        message: message,
                        request: 3,
                        reported: user
                      };
          $http.post('/report/new',post)
          .then(function(res){
            if(res.data.result == 1){
              $scope.notif = {
                                type:'alert-success',
                                show:true,
                                title:'Enregistré !',
                                message:'Votre signalisation a bien été prise en compte.'
                              };
            }
            else{
              $scope.notif = {
                                type:'alert-danger',
                                show:true,
                                title:'Oupss !',
                                message:'Un problème est survenu lors de l\'enregistrement.'
                              };
            }
            $scope.report = {};
            $timeout(function(){ $scope.notif = {}; },3000);
          },function(res){ console.log('FAIL : '+res.data); });
        }

        $scope.ridePop = function(ride){
          $scope.pop = { display:'opacify', show:true, ride:ride };
        }

        $scope.requestSeat = function(ride){
          var post = {ride: ride.id, user: 3};
          $http.post('/passenger_request/new',post)
          .then(function(res){
            if(res.data.result == 1){
              ride.notif = true;
            }
            else{
              $scope.notif = {
                                type:'alert-danger',
                                show:true,
                                title:'Oupss !',
                                message:'Un problème est survenu lors de l\'enregistrement.'
                              };
            }
            $timeout(closeNotif(),3000);
          },function(res){ console.log('FAIL  : '+res.data); });
        }
    }
]);
