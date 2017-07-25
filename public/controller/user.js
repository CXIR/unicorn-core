'use strict';

/**
* View : users
*/

shareAppControllers.controller('usersCtrl',['$scope','$location','$http','Current','$timeout',
    function($scope,$location,$http,Current,$timeout){
      if(Current.user.valid != 1) $location.path('/login');
      else if(Current.user.info == null) $location.path('/login');
      else{

        $scope.loaded = false;


        /***************************  GET USERS ******************************/



        /** Get all users */
        var getUsers = function(){
          $http.get('/users/all/'+Current.user.info.id)
          .then(function(res){
            if(res.data.result == 1){
              $scope.users = res.data.content;
            }
            else if(res.data.result == 0){
              $scope.message = { show:true, message:'Vous semblez être le seul utilisateur enregistré!'};
            }
            else{
              $scope.notif = {
                                type:'alert-danger',
                                show:true,
                                title:'Oupss !',
                                message:'Un problème est survenu lors de la récupération des utilisateurs.'
                              };
            }
            $timeout(function(){ $scope.notif = {}; },3000);
            $scope.loaded = true;
          },function(res){ console.log('FAIL : '+res.data); });
        }; getUsers();



        /*************************** USERS ACTIONS ******************************/



        $scope.userProfile = function(user){
          $location.path('/profil/'+user.id);
        }

        $scope.userPop = function(user){
          $scope.upop = { show:true, display:'opacify', user:user }
        }

      }
    }
]);
