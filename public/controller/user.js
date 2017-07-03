'use strict';

/**
* View : users
*/
shareAppControllers.controller('usersCtrl',['$scope','$location','$http',
    function($scope,$location,$http){
        $scope.loaded = false;

        /** Get all users */
        var getUsers = function(){
          $http.get('/users/all')
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

        /** TODO: Redirect to User Profil in Read or Write according to the ID */
        //general profil by default
        $scope.userProfile = function(user){
          /*
          if(Current.user.id != user.id) $location.path('/rprofil/'+user.id);
          else $location.path('/wprofil/'+user.id);
          */
          $location.path('/profil/'+user.id);
        }

        /** Display a user preview by popup when clicking on picture */
        $scope.userPop = function(user){
          $scope.pop = {
                            show: true,
                            lastname: user.lastname,
                            firstname: user.firstname,
                            birthdate: user.birthdate,
                            positiveRating: user.positiveRating,
                            negativeRating: user.negativeRating,
                            site : { name: user.site.name }
                        };

        }
    }
]);
