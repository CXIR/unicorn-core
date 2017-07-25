'use strict';

/** Edit User Information **/
shareAppControllers.controller('editCtrl',['$scope','$http','$routeParams','Current','$timeout',
  function($scope,$http,$routeParams,Current,$timeout){
    if(Current.user.valid != 1) $location.path('/login');
    else if(Current.user.info == null) $location.path('/login');
    else{

    var car = {};
    var user = {};
    var valid = 0;

    var getCurrent = function(){
      $http.get('/users/'+Current.user.info.id)
      .then(function(res){
        if(res.data.result == 1){
          user = res.data.content;
          $scope.current = user;
        }
      },function(res){ console.log('FAIL : '+res.data); });
    }; getCurrent();

    var getCar = function(){
      $http.get('/vehicle/byuser/'+Current.user.info.id)
      .then(function(res){
        if(res.data.result == 1){
          car = res.data.content;
          $scope.car = res.data.content;
        }
        else {
          car = 0;
        }
      },function(res){ console.log('FAIL : '+res.data); });
    }; getCar();

    $scope.verifyPassword = function(pass){
      angular.element(document.querySelector('#fpass')).removeClass('has-error');
      angular.element(document.querySelector('#fpass')).removeClass('has-success');
      if(btoa(pass) == user.password){
        angular.element(document.querySelector('#fpass')).removeClass('has-error');
        angular.element(document.querySelector('#fpass')).addClass('has-success');
        valid = 1;
      }
      else{
        angular.element(document.querySelector('#fpass')).addClass('has-error');
        valid = 0;
      }
    }

    $scope.resetPassword = function(){
      $scope.pass = {};
      angular.element(document.querySelector('#npass')).removeClass('has-error');
      angular.element(document.querySelector('#fpass')).removeClass('has-error');
      angular.element(document.querySelector('#npass')).removeClass('has-success');
      angular.element(document.querySelector('#fpass')).removeClass('has-success');
    }

    $scope.editPassword = function(pass){
      angular.element(document.querySelector('#npass')).removeClass('has-error');
      if(valid == 1){
        if(pass.one == pass.two){
            var post = {
                          user: user.id,
                          password: btoa(pass.one)
                        };

            $http.post('/users/edit/password',post)
            .then(function(res){
              if(res.data.result == 1){
                getCurrent();
                $scope.resetPassword();
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
              $timeout(function(){ $scope.notif == {}; },3000);
            },function(res){ console.log('FAIL : '+res.data); });
        }
        else{
          $scope.error = { show:true, message:'Les nouveaux mots de passe ne sont pas identiques.' };
          angular.element(document.querySelector('#npass')).addClass('has-error');
        }
      }
      else $scope.error = { show:true, message:'Votre ancien mot de passe n\'est pas correct.' };
    }

    $scope.resetDescription = function(){
      getCurrent();
    }

    $scope.editDescription = function(description){
      var post = {
	                 user: user.id,
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
        $timeout(function(){ $scope.notif = {}; },3000);
      },function(res){ console.log('FAIL : '+res.data); });
    }

    $scope.verifyRegistration = function(registration){
      angular.element(document.querySelector('#registration')).removeClass('has-error');
      angular.element(document.querySelector('#registration')).removeClass('has-success');
      if(!registration.match(/[A-Z][A-Z]\-[0-9][0-9][0-9]\-[A-Z][A-Z]/g)){
        angular.element(document.querySelector('#registration')).addClass('has-error');
      }
      else{
        angular.element(document.querySelector('#registration')).addClass('has-success');
      }
    }

    $scope.editCar = function(ncar){
      $scope.snap = {};
      if(!ncar.registrationNumber.match(/[A-Z][A-Z]\-[0-9][0-9][0-9]\-[A-Z][A-Z]/g)){
        $scope.snap = {show:true,message:'Votre Plaque d\'Immatriculation n\'est pas valide.'};
      }
      else if(ncar.brand.match(/^\s+$/g) || ncar.brand == undefined){
        $scope.snap = {show:true,message:'Veuillez renseigner une Marque.'};
      }
      else if(ncar.model.match(/^\s+$/g) || ncar.model == undefined){
        $scope.snap = {show:true,message:'Veuillez renseigner un Modèle.'};
      }
      else if(!angular.isNumber(parseInt(ncar.placesNumber))){
        $scope.snap = {show:true,message:'Veuillez renseigner le nombre de Places passagères.'};
      }
      else if(ncar.vehicleType == undefined || ncar.vehicleType == ''){
        $scope.snap = {show:true,message:'Veuillez renseigner le Type de Véhicule.'};
      }
      else{
        var post = {
                      user:user.id,
                      brand:ncar.brand,
                      model:ncar.model,
                      type:ncar.vehicleType,
                      seats:ncar.placesNumber,
                      registration:ncar.registrationNumber
                   };
        if(car == 0){
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
            $scope.snap = {};
            $timeout(function(){ $scope.notif = {}; },3000);
            angular.element(document.querySelector('#registration')).removeClass('has-error');
          },function(res){ console.log('FAIL : '+res.data); });
        }
        else if(car != 0){
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
            $timeout(function(){ $scope.notif = {} },3000);
            $scope.snap = {};
            angular.element(document.querySelector('#registration')).removeClass('has-error');
            angular.element(document.querySelector('#registration')).removeClass('has-success');
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
  }
]);
