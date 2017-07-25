'use strict';

/**
* View : rides
*/
shareAppControllers.controller('ridesCtrl',['$scope','$location','$http','$timeout','Current',
    function($scope,$location,$http,$timeout,Current){
      if(Current.user.valid != 1) $location.path('/login');
      else if(Current.user.info == null) $location.path('/login');
      else{

      $scope.loaded = false;
      $scope.rideFilter = '';
      var rides = {};


      /*************************** PRECISE SEARCH ******************************/


      /** Date Input Verification */
      var dateVerify = function(dt){
        if(dt == null || dt == '') return 0;

        if(dt.length == 10){
          var date = dt.split(/\//g);
          if(date.length == 3){
            if(angular.isNumber(parseInt(date[0])) && angular.isNumber(parseInt(date[1])) && angular.isNumber(parseInt(date[2]))){
              var d = parseInt(date[0]);
              var m = parseInt(date[1]);
              var y = parseInt(date[2]);
              if(d > 1 || d < 31 || m > 1 || m < 12 || y > 2015 || y < 2100){
                if(d.toString().length == 1) d = '0'+d;
                if(m.toString().length == 1) m = '0'+m;
                y = y.toString();

                return {'d':d,'m':m,'y':y};
              }
            }
          }
        }
        return 0;
      }

      /** Sites */
      $http.get('/site/')
      .then(function(res){
        if(res.data.result == 1){
          $scope.sites = res.data.content;
        }
        else{
          $scope.notif = {
                            type:'alert-danger',
                            show:true,
                            title:'Oupss !',
                            message:'Un problème est survenu lors de la récupération des Sites.'
                          };
        }
        $timeout(function(){ $scope.notif = {}; },3000);
      },function(res){ console.log('FAIL : '+res.data); });

      /** Special Search w/ defined Criteria */
      $scope.searchRide = function(search,date){
        $scope.rides = {};

        if(search.departure == null && search.arrival == null){
          $scope.error = {show:true,message:'Vous devez renseigner un moins un des deux sites.'};
        }
        else if(search.departure == search.arrival){
          $scope.error = {show:true,message:'Vous devez renseigner deux sites différents.'};
        }
        else{
          var dt = dateVerify(date);
          var post = {
                        date: (dt == 0) ? null : dt.y+'-'+dt.m+'-'+dt.d,
                        departure: (search.departure.id == undefined) ? null : search.departure.id,
                        arrival: (search.arrival.id == undefined) ? null : search.arrival.id,
                        user: Current.user.info.id
                      };

          $http.post('/ride/search',post)
          .then(function(res){
            console.log(res.data);
            if(res.data.result == 1){
              $scope.rides = res.data.content;
            }
            else{
              $scope.message = {show:true,message:'Aucun trajet ne correspond à votre recherche...'};
            }
            $scope.error = {};
            $scope.loaded = true;
          },function(res){ console.log('FAIL : '+res.data); });

        }
      }

      $scope.cancelSearch = function(){
        $scope.simple = true;
        getRides();
      }



      /*************************** ALL RIDES ******************************/



      /** Get all comming rides **/
      var getRides = function() {
        $http.get('/ride/comming/'+Current.user.info.id)
        .then(function(res){
          if(res.data.result == 1){
            $scope.rides = res.data.content;
            rides = res.data.content;
          }
          else if(res.data.result == 0){
            $scope.message = {show:true, message:'Aucun de vos collègue n\'a proposé de trajet pour le moment, et sur lequel vous n\'êtes pas inscrit...'};
          }
          else{
            $scope.notif = {
                              type:'alert-danger',
                              show:true,
                              title:'Oupss !',
                              message:'Un problème est survenu lors de la récupération des Trajets.'
                            };
          }
          $scope.loaded = true;
          $timeout(function(){ $scope.notif = {}; },3000);
        },function(res){ console.log('FAIL : '+ res.data); });
      }; getRides();



      /*************************** RIDE ACTIONS ******************************/


      $scope.requestSeat = function(ride){
        var post = {ride: ride.id, user: Current.user.info.id};
        $scope.rides = {};
        $scope.loaded = false;

        $http.post('/ride/request',post)
        .then(function(res){
          if(res.data.result == 1){
            $scope.notif = {
                              type:'alert-success',
                              show:true,
                              title:'Envoyé !',
                              message:'Votre demande de place pour ce trajet à bien été envoyée.'
                            };
            getRides();
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
          getRides();
        },function(res){ console.log('FAIL  : '+res.data); });
      }

      $scope.ridePop = function(ride){
        $scope.pop = { display:'opacify', show:true, ride:ride };
      }

      $scope.userPop = function(user){
        $scope.upop = { show:true, display:'opacify', user:user }
      }

      }
    }
]);
