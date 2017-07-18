'use strict';

/**
* View : Rides
*/
shareAppControllers.controller('ridesCtrl',['$scope','$location','$http',
    function($scope,$location,$http){
      $scope.loaded = false;

      //TODO: load date verify function here

      /** Get all comming rides **/
      var getRides = function() {
        $http.get('/ride/comming')
        .then(function(res){
          if(res.data.result == -1){
            console.log('FAIL : '+ res.data.message);
          }
          else {
            $scope.rides = res.data;
            $scope.loaded = true;
          }
        },function(res){ console.log('FAIL : '+ res.data); });
      }; getRides();

      /** Special Search w/ defined Criteria */
      $scope.specialSearch = function(search,date){
        if(date == null){

        }
        else if(search.departure == null && search.arrival == null){

        }
        else if(search.departure != null && search.arrival == null){
          var post = {
                        date: date,
                        departure: search.departure.id,
                        arrival: 'none'
                      };

          $http.post('/rides/special',post)
          .then(function(res){

          },function(res){ console.log('FAIL : '+res.data); });
        }
        else if(search.departure == null && search.arrival != null){
          var post = {
                        date: date,
                        departure: 'none',
                        arrival: search.arrival.id
                      };

          $http.post('/rides/special',post)
          .then(function(res){

          },function(res){ console.log('FAIL : '+res.data); });
        }
        else{
          var post = {
                        date: date,
                        departure: search.departure.id,
                        arrival: search.arrival.id
                      };

          $http.post('/rides/special',post)
          .then(function(res){

          },function(res){ console.log('FAIL : '+res.data); });
        }
      }
    }
]);
