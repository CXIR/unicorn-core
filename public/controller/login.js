'use strict';

/**
*View : login
*/
shareAppControllers.controller('loginCtrl',['$scope','$http','Current',
    function($scope,$http,Current){
        $scope.reset = function(){
            $scope.log = {};
            $scope.error = {};
            angular.element(document.querySelector('#pin')).removeClass('has-error');
            angular.element(document.querySelector('#pw')).removeClass('has-error');
        }

        $scope.login = function(log){
          angular.element(document.querySelector('#pin')).removeClass('has-error');
          angular.element(document.querySelector('#pw')).removeClass('has-error');

          if((log.pin == null && log.pw == null) || (log.pin == '' && log.pw == '')){
            angular.element(document.querySelector('#pin, #pw')).addClass('has-error');
            $scope.error = {uncorrect:true,message:'Remplissez les champs ci-dessous'};
          }
          else if(log.pin.match(/\s+/g) && log.pw.match(/\s+/g)){
            angular.element(document.querySelector('#pin, #pw')).addClass('has-error');
            $scope.error = {uncorrect:true,message:'Remplissez les champs ci-dessous'};
          }
          else if(log.pin.match(/\s+/g) || log.pin == null || log.pin == ''){
            angular.element(document.querySelector('#pin')).addClass('has-error');
            $scope.error = {uncorrect:true,message:'Votre identifiant est incorrect'};
          }
          else if(log.pw.match(/\s+/g) || log.pw == null || log.pw == ''){
            angular.element(document.querySelector('#pw')).addClass('has-error');
            $scope.error = {uncorrect:true,message:'Le Mot de Passe est obligatoire'};
          }
          else{
            $scope.loading = true;
            /*
            $http.post('/',{'pin':log.pin,'pw':log.pw})
            .then(function(res){

            }, function(res) { console.log('FAIL : '+res.data); });
            */
          }
        }
    }
]);
