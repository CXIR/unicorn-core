'use strict';

/**
* View : my profile
*/
shareAppControllers.controller('profilCtrl',['$scope','$location','$route','$http',
    function($scope,$location,$route,$http){
        var url = $location.path().split(/\//g);

        /** Get user profile information */
        $http.get('/user/find/'+url[2])
        .then(function(res){
          if(res.data != 0){
            $scope.user = res.data;
          }
        },function(res){ console.log('FAIL : '+res.data); });

        /** Get user profile comming rides as Passenger */
        var getPassengerCommingRides = function(){
          $http.get(node_url)
          .then(function(res){
            if(res.data != 0){
              $scope.p_comming_rides = res.data;
            }
          },function(res){ console.log('FAIL : '+res.data); });
        }; getPassengerCommingRides();

        /** Get user profile comming rides as Driver */
        var getDriverCommingRides = function(){
          $http.get(node_url)
          .then(function(res){
            if(res.data != 0){
              $scope.d_comming_rides = res.data;
            }
          },function(res){ console.log('FAIL : '+res.data); });
        }; getDriverCommingRides();

        /** Get user profile over rides as Passenger */
        var getPassengerOverRides = function(){
          $http.get(node_url)
          .then(function(res){
            if(res.data != 0){
              $scope.p_over_rides = res.data;
            }
          },function(res){ console.log('FAIL : '+res.data); });
        }; getPassengerOverRides();

        /** Get user profile over rides as Driver */
        var getDriverOverRides = function(){
          $http.get(node_url)
          .then(function(res){
            if(res.data != 0){
              $scope.d_over_rides = res.data;
            }
          },function(res){ console.log('FAIL : '+res.data); });
        }; getDriverOverRides();

        /** Get user profile refused rides as Passenger only */
        var getPassengerRefusedRides = function(){
          $http.get(node_url)
          .then(function(res){
            if(res.data != 0){
              $scope.p_refused_rides = res.data;
            }
          },function(res){ console.log('FAIL : '+res.data); });
        }; getPassengerRefusedRides();

        /** Call to ride proposal box */
        $scope.rideProposal = function(user){

        }

        /** Accept passenger asking for a seat in a ride */
        $scope.acceptPassenger = function(ride,participant){

        }

        /** Refuse passenger asking for a seat in a ride */
        $scope.refusePessenger = function(ride,participant){

        }

        /** Mark up a Driver after a ride */
        $scope.markDriverUp = function(driver){

        }

        /** Mark down a driver after a ride */
        $scope.markDriverDown = function(driver){

        }

        /** Mark up a passenger after a ride */
        $scope.markPassengerUp = function(ride,user){

        }

        /** Mark down a passenger after a ride */
        $scope.markPassengerDown = function(ride,user){

        }


    }
]);
