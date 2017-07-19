'use strict';

shareAppControllers.controller('proposalCtrl',['$scope','$location','$http','$routeParams','Current',
  function($scope,$location,$http,$routeParams,Current){
    var user = {};
    var minutes = [];
    var hours = [];

    var i = 0;
    var j = 0;

    while(i < 60) {
      minutes[i] = i+1;
    }

    while(j < 59){
      hours[j] = j+1;
    }

    var closeNotif = function(){
      $scope.notif = {};
    }

    var clearProposal = function(){
      $scope.proposal = {};
      angular.element(document.querySelector('#ddate, #adate')).removeClass('has-error');
      angular.element(document.querySelector('#ddate, #adate')).removeClass('has-success');
    }

    $http.get('/users/'+$routeParams.id)
    .then(function(res){
      if(res.data.result == 1) user = res.data.content;
    },function(res){ console.log('FAIL : '+res.data); });

    /** Date Input Verification */
    var dateVerify = function(dt){
      if(dt == null || dt == '') return 0;

      if(dt.length == 10){
        var date = dt.split(/\//g);
        if(date.length == 3){
          if(angular.isNumber(parseInt(date[0])) && angular.isNumber(parseInt(date[1])) && angular.isNumber(parseInt(date[2]))){
            var d = parseInt(date[0]);
            var m = parseInt(date[1]);
            var y = parseInt(date[2]);
            if(d > 1 || d < 31 || m > 1 || m < 12 || y > 2015 || y < 2100){
              return {'d':d,'m':m,'y':y};
            }
          }
        }
      }
      return 0;
    }

    $scope.validateDate = function(date,which){
      angular.element(document.querySelector('#ddate, #adate')).removeClass('has-error');
      angular.element(document.querySelector('#ddate, #adate')).removeClass('has-success');
      if(dateVerify(date) == 0){
        if(which == 1) angular.element(document.querySelector('#ddate')).addClass('has-error');
        if(which == 2) angular.element(document.querySelector('#adate')).addClass('has-error');
      }
      else{
        if(which == 1) angular.element(document.querySelector('#ddate')).addClass('has-success');
        if(which == 2) angular.element(document.querySelector('#adate')).addClass('has-success');
      }
    }

    $scope.proposeRide = function(proposal){
      var date1 = dateVerify(proposal.d_date);
      var date2 = dateVerify(proposal.a_date);

      if(date1 == 0) $scope.error = {show:true, message:'Le format de la date de départ est incorrect'};
      else if(date2 == 0) $scope.error = {show:true, message:'Le format de la date d\'arrivée est incorrect'};
      else if(proposal.departure == undefined && proposal.d_address == undefined) $scope.error = {show:true, message:'Vous devez choisir un site de départ, ou renseigner une adresse'};
      else if(proposal.departure == null && proposal.d_address == null) $scope.error = {show:true, message:'Vous devez choisir un site de départ, ou renseigner une adresse'};
      else if(proposal.arrival == undefined && proposal.a_address == undefined) $scope.error = {show:true, message:'Vous devez choisir un site d\'arrivée, ou renseigner une adresse'};
      else if(proposal.arrival == null && proposal.a_address == null) $scope.error = {show:true, message:'Vous devez choisir un site d\'arrivée, ou renseigner une adresse'};
      else if(proposal.d_hour == undefined || proposal.d_hour == null) $scope.error = {show:true, message:'Vous devez choisir une heure de départ'};
      else if(proposal.a_hour == undefined || proposal.a_hour == null) $scope.error = {show:true, message:'Vous devez choisir une heure de d\'arrivée'};
      else{
        var d_time = (proposal.d_minutes == undefined || proposal.d_minutes == null) ? proposal.d_hour+':00' : proposal.d_hour+':'+proposal.d_minutes;
        var a_time = (proposal.a_minutes == undefined || proposal.a_minutes == null) ? proposal.a_hour+':00' : proposal.a_hour+':'+proposal.a_minutes;

        var post = {
                      date: new Date(),
                      message: proposal.message,
                      dep_date: date1.y+'-'+date1.m+'-'+date1.d,
                      dep_time: d_time,
                      dep_adress: (proposal.d_address == undefined) ? null : proposal.d_address,
                      dep_postal: (proposal.d_postal == undefined) ? null : proposal.d_postal,
                      dep_city: (proposal.d_city == undefined) ? null : proposal.d_city,
                      dep_site: (proposal.departure == undefined) ? null : proposal.departure.id,
                      arr_date: date2.y+'-'+date2.m+'-'+date2.d,
                      arr_time: a_time,
                      arr_adress: (proposal.a_address == undefined) ? null : proposal.a_address,
                      arr_postal: (proposal.a_postal == undefined) ? null : proposal.a_postal,
                      arr_city: (proposal.a_city == undefined) ? null : proposal.a_city,
                      arr_site: (proposal.arrival == undefined) ? null : proposal.arrival.id,
                      driver: user.id,
                      seats: user.car.seats
                   };
        $http.post('/ride/new',post)
        .then(function(res){
          if(res.data.result == 1){
            $scope.notif = {
                              type:'alert-success',
                              show:true,
                              title:'Enregistré !',
                              message:'Votre trajet a bien été enregistré.'
                            };
          }
          else{
            $scope.notif = {
                              type:'alert-danger',
                              show:true,
                              title:'Oupsss !',
                              message:'Un problème est survenu lors de l\'enregistrement.'
                            };
          }
          timeout(closeNotif(),3000);
        },function(res){ console.log('FAIL : '+res.data); });
      }
    }

  }
]);
