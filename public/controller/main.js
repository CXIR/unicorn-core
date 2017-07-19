/*



-------------------------------------
-------------------------------------
---                               ---
--- APPLICATION MAIN CONTROLLER   ---
--- NAME : shareApp               ---
---                               ---
--- 2017 - Version 1              ---
---                               ---
-------------------------------------
-------------------------------------



*/



'use strict';



/**
*
* MAIN DECLARATION
*
*/


var shareApp = angular.module('shareApp',[
    'ngRoute',
    'shareAppControllers',
    'ui.bootstrap'
]);


/**
*
* APP ROUTE
*
*/


shareApp.config(['$routeProvider','$locationProvider',
    function($routeProvider,$locationProvider){
        $locationProvider.hashPrefix('');
        $routeProvider
        .when('/login',{
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        })
        .when('/home',{
            templateUrl: 'views/home.html',
            controller: 'homeCtrl'
        })
        .when('/edit/:id',{
          templateUrl: 'views/edit.html',
          controller: 'editCtrl'
        })
        .when('/proposal/:id',{
          templateUrl: 'views/proposal.html',
          controller: 'proposalCtrl'
        })
        .when('/users',{
            templateUrl: 'views/users.html',
            controller: 'usersCtrl'
        })
        .when('/report',{
            templateUrl: 'views/report.html',
            controller: 'reportCtrl'
        })
        .when('/rides',{
            templateUrl: 'views/rides.html',
            controller: 'ridesCtrl'
        })
        .when('/profil/:user',{
          templateUrl: 'views/profil.html',
          controller: 'profilCtrl'
        })
        .when('/init', {
          templateUrl: 'views/init.html',
          controller : 'initCtrl'
        })
        .when('/about',{
            templateUrl: 'views/about.html',
            controller: 'aboutCtrl'
        })
        .otherwise({
            redirectTo: '/login'
        })
    }
]);



/**
*
* DIRECTIVES
*
*/


/**
* NAVIGATION BAR
*/
shareApp.directive('myNav',['$location',function($location){
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    templateUrl: 'views/navbar.html',
  link: function (scope, element, attrs) {
        var current = $location.path().split(/\//g);
        if(current[1] == 'profil') angular.element(document.querySelector('#profil')).addClass('active');
        else if(current[1] == 'users') angular.element(document.querySelector('#users')).addClass('active');
        else if(current[1] == 'rides') angular.element(document.querySelector('#rides')).addClass('active');
        else if(current[1] == 'message') angular.element(document.querySelector('#message')).addClass('active');
        else if(current[1] == 'home') angular.element(document.querySelector('#home')).addClass('active');
    }
  };
}]);

/**
* USER POP
*/
shareApp.directive('userPop',['$location',function($location){
  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    templateUrl: 'views/userpop.html',
  link: function (scope, element, attrs) {
        scope.close = function(){
            scope.pop = {};
        }
    }
  };
}]);

/**
* RIDE POP
*/
shareApp.directive('ridePop',['$location',
  function($location){
    return{
      restrict: 'A',
      replace: true,
      transclude: true,
      templateUrl: 'views/ridepop.html',
      link: function (scope, element, attrs) {

          scope.profil = function(user){
            $location.path('/profil/'+user.id);
          }

          scope.popClose = function(){
              scope.pop = {};
          }
      }
    };
  }
]);

/**
* RIDE POP SPECIAL
*/
shareApp.directive('ridePopSpecial',[
  function(){
    return{
      restrict: 'A',
      replace: true,
      transclude: true,
      templateUrl: 'views/ridepopspecial.html',
      link: function (scope, element, attrs) {
          scope.close = function(){
              scope.pop = {};
          }
      }
    };
  }
]);

/**
* SIMPLE NOTIFICATION
*/
shareApp.directive('notif',[
  function(){
    return {
      restrict: 'A',
      replace: true,
      transclude: true,
      templateUrl: 'views/notification.html',
      link:function(scope, element, attrs){
        scope.close = function(){
          scope.notif = {};
        }

      }
    };
  }
]);

// Dialog Box
shareApp.directive('dialog',[
  function(){
    return {
      restrict: 'A',
      replace: true,
      transclude: true,
      templateUrl: 'views/dialog.html',
      link:function(scope, element, attrs){
        scope.closeDialog = function(){
          scope.dialog =  {};
        }
      }
    };
  }
]);

/**
* User Report
*/
shareApp.directive('userReport',[
  function($http){
    return{
      restrict: 'A',
      replace: true,
      transclude: true,
      templateUrl : 'views/report.html',
      link:function(scope,element,attrs){
        scope.close = function(){
          scope.report = {};
        }

        $scope.report = function(report){
          var post = {

          };

          $http.post('/report/new',post)
          .then(function(res){

          },function(res){ console.log('FAIL : '+res.data); });
        }

      }
    };
  }
]);


// Date Picker
shareApp.directive('datepicker',[
  function(){
    return{
      restrict: 'A',
      replace: true,
      transclude: true,
      templateUrl: 'views/datepicker.html',
      link: function (scope, element, attrs) {
        scope.dt = null;

        scope.today = function() {
          scope.dt = new Date();
        };

        scope.clear = function() {
          scope.dt = null;
        };

        scope.inlineOptions = {
          customClass: getDayClass,
          minDate: new Date(),
          showWeeks: true
        };

        scope.dateOptions = {
          dateDisabled: disabled,
          formatYear: 'yy',
          maxDate: new Date(2020, 5, 22),
          minDate: new Date(),
          startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
          var date = data.date,
            mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
          }

          scope.toggleMin = function() {
            scope.inlineOptions.minDate = scope.inlineOptions.minDate ? null : new Date();
            scope.dateOptions.minDate = scope.inlineOptions.minDate;
          };

          scope.toggleMin();

          scope.open1 = function() {
            scope.popup1.opened = true;
          };

          scope.open2 = function() {
            scope.popup2.opened = true;
          };

          scope.setDate = function(year, month, day) {
            scope.dt = new Date(year, month, day);
          };

          scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
          scope.format = scope.formats[0];
          scope.altInputFormats = ['M!/d!/yyyy'];

          scope.popup1 = {
            opened: false
          };

          scope.popup2 = {
            opened: false
          };

          var tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          var afterTomorrow = new Date();
          afterTomorrow.setDate(tomorrow.getDate() + 1);
          scope.events = [
            {
              date: tomorrow,
              status: 'full'
            },
            {
              date: afterTomorrow,
              status: 'partially'
            }
          ];

          function getDayClass(data) {
            var date = data.date,
            mode = data.mode;
            if (mode === 'day') {
              var dayToCheck = new Date(date).setHours(0,0,0,0);

              for (var i = 0; i < scope.events.length; i++) {
                var currentDay = new Date(scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                  return scope.events[i].status;
                }
              }
            }

            return '';
          }
      }
    };
  }
]);

/**
*
* CONTROLLERS MODULE
*
*/



var shareAppControllers = angular.module('shareAppControllers',[]);



/**
*
* FILTERS
*
**/



shareAppControllers.filter('age',[
  function(birthdate,current){
    return function(birthdate){
      current = Date.parse(current) || Date.now();

      var ageDiffMs =  current - new Date(birthdate).getTime();
      var ageDate = new Date(ageDiffMs);

      return Math.abs( ageDate.getUTCFullYear() - 1970 );
    };
  }
]);
