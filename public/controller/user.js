'use strict';

/**
* View : users
*/

shareAppControllers.controller('usersCtrl',['$scope','$location','$http','Current',
    function($scope,$location,$http,Current){
        $scope.loaded = false;

        /** Get all users */
        var getUsers = function(){
          $http.get('/users/all/'+Current.user.info.id)
          .then(function(res){
            if(res.data.result == 0){
              console.log('FAIL : '+res.data.message);
            }
            else if(res.data.result == -1){
              console.log('FAIL :'+res.data.message);
            }
            else{
              $scope.users = res.data;
              $scope.loaded = true;
            }
          },function(res){ console.log('FAIL : '+res.data); });
        }; getUsers();

        $scope.userProfile = function(user){
          $location.path('/profil/'+user.id);
        }

        $scope.userPop = function(user){

        }
    }
]);
