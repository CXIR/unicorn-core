'use strict';

/**
* View : Rides
*/
shareAppControllers.controller('ridesCtrl',['$scope','$location','$http','$timeout',
    function($scope,$location,$http,$timeout){

      $scope.loaded = false;
      var rides = {};

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

      /** Get all comming rides **/
      var getRides = function() {
        $http.get('/ride/comming')
        .then(function(res){
          if(res.data.result == 1){
            $scope.rides = res.data.content;
            rides = res.data.content;
          }
          else {
            $scope.message = {show:true, message:'Aucun de vos collègue n\'a proposé de trajet pour le moment ...'};
          }
          $scope.loaded = true;
        },function(res){ console.log('FAIL : '+ res.data); });
      }; getRides();

      /** Special Search w/ defined Criteria */
      $scope.specialSearch = function(search,date){
        $scope.rides = {};
        var dt = dateVerify(0);
        if(search.departure == null && search.arrival == null){
          $scope.error = {show:true,message:'Vous devez renseigner un moins un des deux sites.'};
        }
        else if(dt == 0){
          $scope.error = {show:true,message:'Le format de la date n\'est pas valide.'};
        }
        else{
          var post = {
                        date: dt.y+'-'+dt.m+'-'.dt.d,
                        departure: search.departure.id,
                        arrival: 'none'
                      };

          $http.post('/rides/search',post)
          .then(function(res){
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

      $scope.requestSeat = function(ride){
        var post = {ride: ride.id, user: 1};
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

      $scope.ridePop = function(ride){
        $scope.pop = { display:'opacify', show:true, ride:ride };
      }

      $scope.userPop = function(user){
        $scope.user = { show:true, display:}
      }
    }
]);
