'use strict';

/**
* View : my profil 
*/
shareAppControllers.controller('homeCtrl',['$scope','$location','$http','Current','$timeout',
  function($scope,$location,$http,Current,$timeout){
    if(Current.user.valid != 1) $location.path('/login');
    else if(Current.user.info == null) $location.path('/login');
    else{

      var car = null;
      var valid = 0;
      var driveFirst = 0;

      $scope.next = 0;
      $scope.notifications = 0;

      $scope.proposeRide = function(){
        $location.path('/proposal');
      }


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


      var getCommingRidesDriver = function(){
        $http.get('/ride/comming/driver/'+Current.user.info.id)
        .then(function(res){
          if(res.data.result == 1){
            $scope.d_comming = res.data.content;
            $scope.next = res.data.content[0];
            $scope.next.drive = true;
            driveFirst = 1;
          }
          else $scope.d_comming = 0;
        },function(res){ console.log('FAIL : '+res.data); });
      }; getCommingRidesDriver();

      var getCommingRidePassenger = function(){
        $http.get('/ride/comming/passenger/'+Current.user.info.id)
        .then(function(res){
          if(res.data.result == 1){
            $scope.p_comming = res.data.content;
            if(driveFirst == 0){
              $scope.next = res.data.content[0];
              $scope.next.drive = false;
            }
          }
          else $scope.p_comming = 0;
        },function(res){ console.log('FAIL : '+res.data); });
      }; getCommingRidePassenger();


      /***************************** PASSED RIDES *******************************/


      var getPassedRidesDriver = function(){
        $http.get('/ride/passed/driver/'+Current.user.info.id)
        .then(function(res){
            if(res.data.result == 1){
              $scope.d_passed = res.data.content;
            }
            else $scope.d_passed = 0;
          },function(res){ console.log('FAIL : '+res.data); });
      }; getPassedRidesDriver();

      var getPassedRidesPassenger = function(){
        $http.get('/ride/passed/passenger/'+Current.user.info.id)
        .then(function(res){
          if(res.data.result == 1){
            $scope.p_passed = res.data.content;
          }
          else $scope.p_passed = 0;
        },function(res){ console.log('FAIL : '+res.data); });
      }; getPassedRidesPassenger();

      /***************************** RIDES REQUESTS *****************************/

      /* Get sended requests */
      $http.get('/ride/sended/'+Current.user.info.id)
      .then(function(res){
        if(res.data.result == 1){
          $scope.s_requests = res.data.content;
        }
        else $scope.s_requests = 0;
      },function(res){  console.log('FAIL : '+res.data); });

      /* Received requests table is based on comming rides */


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



      $scope.acceptRequest = function(request,ride){
        var post = { ride:ride.id, user:request.id };

        $http.post('/ride/passenger',post)
        .then(function(res){
          if(res.data.result == 1){
            $scope.notif = {
                              type:'alert-success',
                              show:true,
                              title:'Enregistré !',
                              message:'Ce passager a bien été ajouté.'
                            };
            getCommingRidesDriver();
          }
          else{
            $scope.notif = {
                              type:'alert-danger',
                              show:true,
                              title:'Oupss !',
                              message:'Nous ne parvenons pas à enregistrer ce passager.'
                            };
          }
          $timeout(function(){ $scope.notif = {}; },3000);
        },function(res){ console.log('FAIL : '+res.data); });
      }

      $scope.refuseRequest = function(request,ride){
        var post = { request:ask.id, ride:ride.id };

        $http.post('/ride/refuse',post)
        .then(function(res){
          if(res.data.result == 1){
            $scope.notif = {
                              type:'alert-warning',
                              show:true,
                              title:'Enregistré !',
                              message:'Votre refus a bien été enregistré.'
                            };
            getCommingRidesDriver();
          }
          else{
            $scope.notif = {
                              type:'alert-danger',
                              show:true,
                              title:'Oupss !',
                              message:'Nous ne parvenons pas à enregistrer votre refus.'
                            };
          }
          $timeout(function(){ $scope.notif = {}; },3000);
        },function(res){ console.log('FAIL : '+res.data); });
      }

      /************************** MARK A DRIVER BY RIDE ***************************/

      $scope.mark = function(ride,type){
        var post = {
                      rated:ride.driver.id,
                      rater:Current.user.info.id,
                      ride:ride.id,
                      type: (type == 1) ? 'positive' : 'negative'
                    };
        $http.post('/ride/mark',post)
        .then(function(res){
          if(res.data.result == 1){
            $scope.notif = {
                              type:'alert-success',
                              show:true,
                              title:'Enregistré !',
                              message:'Votre note a bien été enregistrée.'
                            };
            getPassedRidesPassenger();
          }
          else{
            $scope.notif = {
                              type:'alert-danger',
                              show:true,
                              title:'Oupss !',
                              message:'Nous ne parvenons pas à enregistrer votre note.'
                            };
          }
          $timeout(function(){ $scope.notif = {}; },3000);
        },function(res){ console.log('FAIL : '+res.data); });
      }


      /**************************** DELETE A RIDE *******************************/


      $scope.dropRide = function(ride){
        $scope.special = {};
        $scope. dialog = {
                            type:'panel-danger',
                            display:'opacify',
                            show:true,
                            title:'Attention !',
                            message:'Êtes vous sûr de vouloir supprimer ce trajet ?',
                            content:ride
                         };
      }

      $scope.agree = function(ride){
        $scope.dialog = {};

        $http.delete('/ride/'+ride.id)
        .then(function(res){
          if(res.data.result == 1){
            $scope.notif = {
                              type:'alert-success',
                              show:true,
                              title:'Fait !',
                              message:'Le trajet a bien été supprimé.'
                            };
            driveFirst = 0;
            getCommingRidesDriver();
            getCommingRidePassenger();
          }
          else{
            $scope.notif = {
                              type:'alert-danger',
                              show:true,
                              title:'Oupss !',
                              message:'Nous n\'avons pas réusi à supprimer ce trajet.'
                            };
          }
          $timeout(function(){ $scope.notif = {}; },3000);
        },function(res){ console.log('FAIL : '+res.data); });

      }

    }

  }
]);
