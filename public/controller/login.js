'use strict';

/**
*View : login
*/
shareAppControllers.controller('loginCtrl',['$scope','$http','Current','$location',
    function($scope,$http,Current,$location){

        $scope.reset = function(){
            $scope.log = {};
            $scope.error = {};
            angular.element(document.querySelector('#mail')).removeClass('has-error');
            angular.element(document.querySelector('#pw')).removeClass('has-error');
        }

        $scope.login = function(log){
          angular.element(document.querySelector('#mail')).removeClass('has-error');
          angular.element(document.querySelector('#pw')).removeClass('has-error');

          if(log == undefined){
            angular.element(document.querySelector('#mail')).addClass('has-error');
            angular.element(document.querySelector('#pw')).addClass('has-error');
            $scope.error = {uncorrect:true,message:'Remplissez les champs ci-dessous'};
          }
          else if(log.mail == undefined){
            angular.element(document.querySelector('#mail')).addClass('has-error');
            $scope.error = {uncorrect:true,message:'Votre Adresse Mail est obligatoire'};
          }
          else if(log.mail.match(/\s+/g) && log.pw.match(/\s+/g)){
            angular.element(document.querySelector('#mail')).addClass('has-error');
            angular.element(document.querySelector('#pw')).addClass('has-error');
            $scope.error = {uncorrect:true,message:'Remplissez les champs ci-dessous'};
          }
          else if(log.pw == undefined){
            angular.element(document.querySelector('#pw')).addClass('has-error');
            $scope.error = {uncorrect:true,message:'Le Mot de Passe est obligatoire'};
          }
          else if(log.pw.match(/\s+/g) || log.pw == ''){
            angular.element(document.querySelector('#pw')).addClass('has-error');
            $scope.error = {uncorrect:true,message:'Le Mot de Passe est obligatoire'};
          }
          else if(!log.mail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g)){
            angular.element(document.querySelector('#mail')).addClass('has-error');
            $scope.error = {uncorrect:true,message:'Votre Adresse Mail est invalide'};
          }
          else{
            var post = { mail: log.mail, pass:btoa(log.pw) };
            $scope.error = {};

            $http.post('/login',post)
            .then(function(res){
              if(res.data.result == 1){
                if(res.data.content.status.id == 3){
                  $scope.error = {uncorrect:true,message:'Votre compte a été vérouillé par les Gestionnaires. Vous n\'avez plus accès à cette Application pour le moment.'};
                }
                else{
                  Current.user.info = res.data.object;
                  Current.user.valid = 1;
                  $location.path('/home');
                }
              }
              else if(res.data.result == 0) $scope.error = { uncorrect:true, message:'Vos identifiants sont incorrects !'};
              else $scope.error = {uncorrect:true,message:'Impossible de vous identifier, veuillez retenter plus tard.'};
            },function(res){ console.log('FAIL : '+res.data); });
          }
        }
    }
]);
