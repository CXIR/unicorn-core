'use strict';

/**
* View : a profile
*/
shareAppControllers.controller('profilCtrl',['$scope','$location','$http','$routeParams','$timeout','Current',
    function($scope,$location,$http,$routeParams,$timeout,Current){
      if(Current.user.valid != 1) $location.path('/login');
      else if(Current.user.info == null) $location.path('/login');
      else{

        var url = $location.path().split(/\//g);
        var user = url[2];




        /*************************** USER INFORMATIONS ******************************/




        $http.get('/users/'+user)
        .then(function(res){
          if(res.data.result == 1){
            $scope.user = res.data.content;
            $http.get('/vehicle/byuser/'+user)
            .then(function(res){
              if(res.data.result == 1){
                $scope.car = res.data.content;
              }
            },function(res){ console.log('FAIL : '+res.data); });
          }
          else $location.path('/users');
        },function(res){ console.log('FAIL : '+res.data); });



        /*************************** USER RIDES ******************************/



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



        /*************************** PROFIL ACTIONS ******************************/



        $scope.reportUser = function(user){
          $scope.report = {show:true, display:'opacify'}
        }

        $scope.sendReport = function(message){
          var post = {
                        message: message,
                        request: Current.user.info.id,
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
            else if(res.data.result == 0){
              $scope.notif = {
                                type:'alert-warning',
                                show:true,
                                title:'Déjà Fait !',
                                message:'Vous avez déjà signalé cet utilisateur.'
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
          var post = {ride: ride.id, user: Current.user.info.id};
          $http.post('/ride/request',post)
          .then(function(res){
            if(res.data.result == 1){
              $scope.notif = {
                                type:'alert-success',
                                show:true,
                                title:'Envoyé !',
                                message:'Votre demande de place pour ce trajet à bien été envoyée.'
                              };
            }
            else if(res.data.result == 0){
              $scope.notif = {
                                type:'alert-warning',
                                show:true,
                                title:'Déjà Fait !',
                                message:'Vous avez déjà demandé une place pour ce trajet.'
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
            $timeout(function(){ $scope.notif = {}; },3000);
          },function(res){ console.log('FAIL  : '+res.data); });
        }

      }
    }
]);
