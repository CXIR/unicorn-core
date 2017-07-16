'user strict';

/** Edit User Information **/
shareAppControllers.controller('editCtrl',['$scope','$http','$routeParams',
  function($scope,$http,$routeParams){

    console.log($routeParams.id);
    
    var getCar = function(id){
      $http.get('/vehicle/byuser/'+id)
      .then(function(res){
        if(res.data.result != 0){
          $scope.car = res.data.result;
          return res.data.result;
        }
        else return null;
      },function(res){ console.log('FAIL : '+res.data); });
    };

    var getUser = function(){
      $http.get('/users/'+$routeParams.id)
      .then(function(res){
        if(res.data != 0){
          $scope.user = res.data;
          car = getCar(res.data.id);
          return res.data;
        }
      },function(res){ console.log('FAIL : '+res.data); });
    };

    var user = getUser();
    var car = null;
    var valid = 0;

    $scope.verifyPassword = function(pass){
      if(btoa(pass) == user.pass){
        angular.element(document.querySelector('#former-pass')).removeClass('has-error');
        angular.element(document.querySelector('#former-pass')).addClass('has-success');
        valid = 1;
      }
      else{
        angular.element(document.querySelector('#former-pass')).addClass('has-error');
      }
    }

    $scope.editDescription = function(description){
      var post = {
	                 id: 2,
	                 name: user.name,
                   first: user.first,
	                 mail: user.mail,
                   phone: user.phone,
                   description: description
                 };
      $http.post('/users/edit',post)
      .then(function(res){
        if(res.data.result == 1){
          getUser();
        }
      },function(res){ console.log('FAIL : '+res.data); });
    }

    $scope.editPassword = function(pass){
      //TODO pass matches standart (length, variety etc...)
      if(valid == 1){
        if(pass.one == pass.two){
            var post = { id:user.id, pass:atob(pass) }
            http.post('/users/pass/',post)
            .then(function(res){
              if(res.data.result == 1){
                getUser();
              }
            },function(res){ console.log('FAIL : '+res.data); });
        }
      }
    }

    $scope.editCar = function(car){
      if(car.registration.match(/[A-Z][A-Z]\-[0-9][0-9][0-9]\-[A-Z][A-Z]/g)){
        var post = {
                      user:user.id,
                      brand:car.brand,
                      model:car.model,
                      type:car.type,
                      seats:car.seats,
                      registration:car.registration
                   };
        if(car == null){
          $http.post('/vehicle/new',post)
          .then(function(res){

          },function(res){ console.log('FAIL : '+res.data); });
        }
        else if(car != null){
          $http.post('/vehicle/edit',post)
          .then(function(res){

          },function(res){ console.log('FAIL : '+res.data); });
        }
      }
    }

    $scope.clearPassword = function(){
      $scope.password = {};
      angular.element(document.querySelector('#former-pass, #new-pass')).removeClass('has-error');
    }

    $scope.clearCar = function(){
      if(car == null) $scope.car = {};
      else $scope.car = car;
    }


  }
]);
