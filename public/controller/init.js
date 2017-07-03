'use strict';

/**
* View : init
*/
shareAppControllers.controller('initCtrl',['$scope','$location', '$http',
    function($scope, $location, $http){

        $scope.init = "Initilisation KO";

        /*
        * JSON
        */

        //STATUS
        var json_status1 = {label:"Utilisateur"};
        var json_status2 = {label:"Administrateur"};
        var json_status3 = {label:"Super-Administrateur"};

        //SITE
        var json_site1 = { name: "Pantin", adress: "2 Rue du Cheval Blanc", city: "Pantin", postal: "93100"};
        var json_site2 = { name: "Malakoff", adress: "242 Avenue Paul VAillant Couturier", city: "Malakoff", postal: "92240"};
        var json_site3 = { name: "Montparnasse", adress: "2 Rue du Départ", city: "Paris", postal: "75014"};

        //USER
        var json_user1 = { name: "Afonso", first: "Mickaël", birth: "1994-06-21",
                          mail: "ma@outlook.com", pass: "Demo1234", phone: null,
                          description: null, site: 1, status: 1 };
        var json_user2 = { name: "Roger", first: "Ludwig", birth: "1992-06-15",
                          mail: "rl@outlook.com", pass: "Demo1234", phone: null,
                          description: null, site: 3, status: 2 };
        var json_user3 = { name: "Elmkies Duc", first: "Aimée", birth: "1995-06-19",
                          mail: "aed@outlook.com", pass: "Demo1234", phone: null,
                          description: null, site: 2, status: 3 };

        //VEHICLE
        var json_vehicle1 = { brand: "Renault", model: "Super 5", registration: "AK-587-CQ", seats: "4", type: "Car", user:3 };
        var json_vehicle2 = { brand: "Peugeot", model: "Vivacity", registration: "DW-587-QG", seats: "1", type: "Scooter", user:1 };

        //RIDE
        var json_ride1 = { date: "2017-07-01", message: "Pot de Départ de Jean Luc",
          dep_date: "2017-07-25", dep_adress: null, dep_postal: null, dep_city: null, dep_site: 2,
          arr_date: "2017-07-25", arr_adress: null, arr_postal: null, arr_city: null, arr_site: 3,
          driver: 3 };
        var json_ride2 = { date: "2017-07-01", message: "Pot de Départ de Michou",
          dep_date: "2017-07-05", dep_adress: null, dep_postal: null, dep_city: null, dep_site: 1,
          arr_date: "2017-07-05", arr_adress: "25 Rue Poussin", arr_postal: "75016", arr_city: "Paris", arr_site: null,
          driver: 1 };

        //PASSENGER REQUEST
        var json_passenger1 = { ride: 1, user: 3 };
        var json_passenger2 = { ride: 2, user: 3 };

        //REPORT
        var json_report1 = { message: "Cet utilisateur m'a insulté", request: 3, reported: 1 };
        var json_report2 = { message: "Cet utilisateur est malpoli", request: 2, reported: 3 };


        /*
        * STATUS
        */
        //Create status "Utilisateur"
        var createStatus1 = function(){
          $http.post('/status/new', json_status1)
          .then(function(res){
            if(res.data.result == 0){
              console.log('FAIL : ' + res.data.message);
            }
            else if(res.data.result == -1){
              console.log('FAIL :' + res.data.message);
            }
            else{
              console.log('STATUS CREATE 1 :' + res.data);
              createSite1();
            }
          },function(res){ console.log('FAIL : ' + res.data); });
        }; createStatus1();

        //Create status "Administrateur"
        var createStatus2 = function(){
          $http.post('/status/new', json_status2)
          .then(function(res){
            if(res.data.result == 0){
              console.log('FAIL : ' + res.data.message);
            }
            else if(res.data.result == -1){
              console.log('FAIL :' + res.data.message);
            }
            else{
              console.log('STATUS CREATE 2 :' + res.data);
              createSite2();
            }
          },function(res){ console.log('FAIL : ' + res.data); });
        }; createStatus2();

        //Create status "Super-Administrateur"
        var createStatus3 = function(){
          $http.post('/status/new', json_status3)
          .then(function(res){
            if(res.data.result == 0){
              console.log('FAIL : ' + res.data.message);
            }
            else if(res.data.result == -1){
              console.log('FAIL :' + res.data.message);
            }
            else{
              console.log('STATUS CREATE 3:' + res.data);
              createSite3();
            }
          },function(res){ console.log('FAIL : ' + res.data); });
        }; createStatus3();


        /*
        * SITE
        */

        // CREATE SITE "Pantin"
        var createSite1 = function(){
          $http.post('/site/new', json_site1)
          .then(function(res){
            if(res.data.result == 0){
              console.log('FAIL : ' + res.data.message);
            }
            else if(res.data.result == -1){
              console.log('FAIL :' + res.data.message);
            }
            else{
              console.log('SITE CREATE 1 :' + res.data);
              createUser1();
            }
          },function(res){ console.log('FAIL : ' + res.data); });
        };

        // CREATE SITE "Malakoff"
        var createSite2 = function(){
          $http.post('/site/new', json_site2)
          .then(function(res){
            if(res.data.result == 0){
              console.log('FAIL : ' + res.data.message);
            }
            else if(res.data.result == -1){
              console.log('FAIL :' + res.data.message);
            }
            else{
              console.log('SITE CREATE 2 :' + res.data);
              createUser2();
            }
          },function(res){ console.log('FAIL : ' + res.data); });
        };

        // CREATE SITE "Montparnasse"
        var createSite3 = function(){
          $http.post('/site/new', json_site3)
          .then(function(res){
            if(res.data.result == 0){
              console.log('FAIL : ' + res.data.message);
            }
            else if(res.data.result == -1){
              console.log('FAIL :' + res.data.message);
            }
            else{
              console.log('SITE CREATE 3 :' + res.data);
              createUser3();
            }
          },function(res){ console.log('FAIL : ' + res.data); });
        };

        /*
        * USER
        */

        // CREATER USER "Mickael Afonso"
        var createUser1 = function(){
          $http.post('/users/new', json_user1)
          .then(function(res){
            if(res.data.result == 0){
              console.log('FAIL : ' + res.data.message);
            }
            else if(res.data.result == -1){
              console.log('FAIL :' + res.data.message);
            }
            else if(res.data.result == -2){
              console.log('FAIL :' + res.data.message);
            }
            else{
              console.log('USER CREATE 1 :' + res.data);
              createVehicle2();
            }
          },function(res){ console.log('FAIL : ' + res.data); });
        };

        // CREATER USER "Ludwig Roger"
        var createUser2 = function(){
          $http.post('/users/new', json_user2)
          .then(function(res){
            if(res.data.result == 0){
              console.log('FAIL : ' + res.data.message);
            }
            else if(res.data.result == -1){
              console.log('FAIL :' + res.data.message);
            }
            else if(res.data.result == -2){
              console.log('FAIL :' + res.data.message);
            }
            else{
              console.log('USER CREATE 2 :' + res.data);
              createVehicle1();
            }
          },function(res){ console.log('FAIL : ' + res.data); });
        };

        // CREATER USER "Aimée Elmkies Duc"
        var createUser3 = function(){
          $http.post('/users/new', json_user3)
          .then(function(res){
            if(res.data.result == 0){
              console.log('FAIL : ' + res.data.message);
            }
            else if(res.data.result == -1){
              console.log('FAIL :' + res.data.message);
            }
            else if(res.data.result == -2){
              console.log('FAIL :' + res.data.message);
            }
            else{
              console.log('USER CREATE 3 :' + res.data);
            }
          },function(res){ console.log('FAIL : ' + res.data); });
        };

        /*
        * VEHICLE
        */

        // CREATE VEHICLE "Super 5" --> User LR
        var createVehicle1 = function(){
          $http.post('/vehicle/new', json_vehicle1)
          .then(function(res){
            if(res.data.result == 0){
              console.log('FAIL : ' + res.data.message);
            }
            else if(res.data.result == -1){
              console.log('FAIL :' + res.data.message);
            }
            else if(res.data.result == -2){
              console.log('FAIL :' + res.data.message);
            }
            else{
              console.log('VEHICLE CREATE 1:' + res.data);
              createRide1();
            }
          },function(res){ console.log('FAIL : ' + res.data); });
        };

        // CREATER VEHICLE "Vivacity" --> User MA
        var createVehicle2 = function(){
          $http.post('/vehicle/new', json_vehicle2)
          .then(function(res){
            if(res.data.result == 0){
              console.log('FAIL : ' + res.data.message);
            }
            else if(res.data.result == -1){
              console.log('FAIL :' + res.data.message);
            }
            else if(res.data.result == -2){
              console.log('FAIL :' + res.data.message);
            }
            else{
              console.log('VEHICLE CREATE 2 :' + res.data);
              createRide2();
            }
          },function(res){ console.log('FAIL : ' + res.data); });
        };


        /*
        * RIDE
        */

        // CREATE RIDE by driver 2
        var createRide1 = function(){
          $http.post('/ride/new', json_ride1)
            .then(function(res){
              if(res.data.result == 0){
                console.log('FAIL : ' + res.data.message);
              }
              else if(res.data.result == -1){
                console.log('FAIL :' + res.data.message);
              }
              else if(res.data.result == -2){
                console.log('FAIL :' + res.data.message);
              }
              else{
                console.log('RIDE CREATE 1 :' + res.data);
                createPassenger1();
              }
          },function(res){ console.log('FAIL : ' + res.data); });
        };

        // CREATE Ride by driver 1
        var createRide2 = function(){
          $http.post('/ride/new', json_ride2)
            .then(function(res){
              if(res.data.result == 0){
                console.log('FAIL : ' + res.data.message);
              }
              else if(res.data.result == -1){
                console.log('FAIL :' + res.data.message);
              }
              else if(res.data.result == -2){
                console.log('FAIL :' + res.data.message);
              }
              else{
                console.log('RIDE CREATE 2 :' + res.data);
                createPassenger2();
              }
          },function(res){ console.log('FAIL : ' + res.data); });
        };


        /*
        * PASSENGER REQUEST
        */

        // CREATER PASSENGER REQUEST --> Passenger 3 to ride 1
        var createPassenger1 = function(){
          $http.post('/passenger_request/new', json_passenger1)
            .then(function(res){
              if(res.data.result == 0){
                console.log('FAIL : ' + res.data.message);
              }
              else if(res.data.result == -1){
                console.log('FAIL :' + res.data.message);
              }
              else if(res.data.result == -2){
                console.log('FAIL :' + res.data.message);
              }
              else{
                console.log('PASSENGER REQUEST CREATE 1 :' + res.data);
                createReport1();
              }
          },function(res){ console.log('FAIL : ' + res.data); });
        };

        // CREATER PASSENGER REQUEST --> Passenger 3 to ride 2
        var createPassenger2 = function(){
          $http.post('/passenger_request/new', json_passenger2)
            .then(function(res){
              if(res.data.result == 0){
                console.log('FAIL : ' + res.data.message);
              }
              else if(res.data.result == -1){
                console.log('FAIL :' + res.data.message);
              }
              else if(res.data.result == -2){
                console.log('FAIL :' + res.data.message);
              }
              else{
                console.log('PASSENGER REQUEST CREATE 2 :' + res.data);
                createReport2();
              }
          },function(res){ console.log('FAIL : ' + res.data); });
        };


        /*
        * REPORT
        */

        // CREATE REPORT user 3 --> user 1
        var createReport1 = function(){
          $http.post('/report/new', json_report1)
            .then(function(res){
              if(res.data.result == 0){
                console.log('FAIL : ' + res.data.message);
              }
              else if(res.data.result == -1){
                console.log('FAIL :' + res.data.message);
              }
              else if(res.data.result == -2){
                console.log('FAIL :' + res.data.message);
              }
              else{
                console.log('REPORT CREATE 1 :' + res.data);
              }
          },function(res){ console.log('FAIL : ' + res.data); });
        };

        // CREATE REPORT user 2 --> user 3
        var createReport2 = function(){
          $http.post('/report/new', json_report2)
            .then(function(res){
              if(res.data.result == 0){
                console.log('FAIL : ' + res.data.message);
              }
              else if(res.data.result == -1){
                console.log('FAIL :' + res.data.message);
              }
              else if(res.data.result == -2){
                console.log('FAIL :' + res.data.message);
              }
              else{
                console.log('REPORT CREATE 2 :' + res.data);
              }
          },function(res){ console.log('FAIL : ' + res.data); });
        };

        $scope.init = "Initilisation OK";

    }
]);
