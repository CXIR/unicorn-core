'use strict';

/** Edit User Information **/
shareAppControllers.controller('editCtrl',['$scope','$http','$routeParams',
  function($scope,$http,$routeParams){

    var car = {};
    var pass = 0;

    $scope.types = ['Citadine','Berline','4x4','SUV','Utilitaire','Scooter'];

    var closeNotif = function(){
      $scope.notif = {};
    }

    var getCurrent = function(){
      $http.get('/users/'+$routeParams.id)
      .then(function(res){
        if(res.data.result == 1){
          $scope.current = res.data.content;
        }
      },function(res){ console.log('FAIL : '+res.data); });
    }; getCurrent();

    var getCar = function(){
      $http.get('/vehicle/byuser/'+id)
      .then(function(res){
        if(res.data.result == 1){
          $scope.car = res.data.content;
          car = res.data.content;
        }
        else return null;
      },function(res){ console.log('FAIL : '+res.data); });
    }; getCar();

    $scope.verifyPassword = function(pass){
      angular.element(document.querySelector('#fpass')).removeClass('has-error');
      if(btoa(pass) == current.pass){
        angular.element(document.querySelector('#fpass')).removeClass('has-error');
        angular.element(document.querySelector('#fpass')).addClass('has-success');
        valid = 1;
      }
      else{
        angular.element(document.querySelector('#fpass')).addClass('has-error');
        valid = 0;
      }
    }

    $scope.editPassword = function(pass){
      if(valid == 1){
        if(pass.one == pass.two){
            var post = { id:current.id, password:atob(pass) }
            http.post('/users/pass/',post)
            .then(function(res){
              if(res.data.result == 1){
                getcurrent();
                $scope.notif = {
                                  type:'alert-success',
                                  show:true,
                                  title:'Enregistré !',
                                  message:'Votre mot de passe a bien été modifiée.'
                                };
              }
              else{
                $scope.notif = {
                                  type:'alert-danger',
                                  show:true,
                                  title:'Oupsss !',
                                  message:'Un problème est survenu à l\'enregistrement...'
                                };
              }
              $timeout(closeNotif(),3000);
            },function(res){ console.log('FAIL : '+res.data); });
        }
      }
    }

    $scope.editDescription = function(description){
      var post = {
	                 id: 2,
                   description: description
                 };
      $http.post('/users/edit/description',post)
      .then(function(res){
        if(res.data.result == 1){
          getCurrent();
          $scope.notif = {
                            type:'alert-success',
                            show:true,
                            title:'Enregistré !',
                            message:'Votre description a bien été modifiée.'
                          };
        }
        else{
          $scope.notif = {
                            type:'alert-danger',
                            show:true,
                            title:'Oupsss !',
                            message:'Un problème est survenu à l\'enregistrement...'
                          };
        }
        $timeout(closeNotif(),3000);
      },function(res){ console.log('FAIL : '+res.data); });
    }

    $scope.editCar = function(car){
      if(!car.registration.match(/[A-Z][A-Z]\-[0-9][0-9][0-9]\-[A-Z][A-Z]/g)){
        $scope.car_error = {show:true,message:'Votre Plaque d\'Immatriculation n\'est pas valide'}
      }
      else{
        var post = {
                      user:current.id,
                      brand:car.brand,
                      model:car.model,
                      type:car.type,
                      seats:car.seats,
                      registration:car.registration
                   };
        if(car == null){
          $http.post('/vehicle/new',post)
          .then(function(res){
            if(res.data.result == 1){
              getCar();
              $scope.notif = {
                                type:'alert-warning',
                                show:true,
                                title:'Enregistré !',
                                message:'Votre voiture a bien été ajoutée. Vous devez attendre sa validation.'
                              };
            }
            else{
              $scope.notif = {
                                type:'alert-danger',
                                show:true,
                                title:'Oupsss !',
                                message:'Un problème est survenu à l\'enregistrement...'
                              };
            }
            $timeout(closeNotif(),3000);
          },function(res){ console.log('FAIL : '+res.data); });
        }
        else if(car != null){
          $http.post('/vehicle/edit',post)
          .then(function(res){
            if(res.data.result == 1){
              getCar();
              $scope.notif = {
                                type:'alert-warning',
                                show:true,
                                title:'Enregistré !',
                                message:'Votre voiture a bien été modifiée. Vous devez attendre sa validation.'
                              };
            }
            else{
              $scope.notif = {
                                type:'alert-danger',
                                show:true,
                                title:'Oupsss !',
                                message:'Un problème est survenu à l\'enregistrement...'
                              };
            }
            $timeout(closeNotif(),3000);
          },function(res){ console.log('FAIL : '+res.data); });
        }
      }
    }

    $scope.clearPassword = function(){
      $scope.password = {};
      angular.element(document.querySelector('#fpass, #npass')).removeClass('has-error');
    }

    $scope.clearCar = function(){
      $scope.car = car;
    }


  }
]);
