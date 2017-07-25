'use strict';

/**
* View : proposal
*/
shareAppControllers.controller('proposalCtrl',['$scope','$location','$http','$routeParams','Current','$timeout',
  function($scope,$location,$http,$routeParams,Current,$timeout){
    if(Current.user.valid != 1) $location.path('/login');
    else if(Current.user.info == null) $location.path('/login');
    else{

      var clearProposal = function(){
        $scope.proposal = {};
        angular.element(document.querySelector('#ddate')).removeClass('has-error');
        angular.element(document.querySelector('#adate')).removeClass('has-error');
        angular.element(document.querySelector('#ddate')).removeClass('has-success');
        angular.element(document.querySelector('#adate')).removeClass('has-success');
      };



      /*************************** PROPOSAL INFORMATION ******************************/



    $http.get('/site/')
    .then(function(res){
      if(res.data.result == 1){
        $scope.sites = res.data.content;
      }
      else{
        $scope.notif = {
                          type:'alert-danger',
                          show:true,
                          title:'Oupsss !',
                          message:'Nous ne parvenons pas à récupérer la liste des Sites.'
                        };
      }
      $timeout(function(){ $scope.notif = {}; },3000);
    },function(res){ console.log('FAIL : '+res.data); });

    $http.get('/vehicle/byuser/'+Current.user.info.id)
    .then(function(res){
      if(res.data.result == 1){
        $scope.seats = res.data.content.placesNumber;
        $scope.max = res.data.content.placesNumber;

      }
      else{
        $scope.notif = {
                          type:'alert-warning',
                          show:true,
                          title:'Oupsss !',
                          message:'Nous avons un problème avec votre voiture.'
                        };
      }
      $timeout(function(){ $scope.notif = {}; },3000);
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
    };



    /*************************** INPUT CONTROLS ******************************/



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

    var validateHour = function(hour){
      if(angular.isNumber(parseInt(hour))){
        if(parseInt(hour) >= 0 && parseInt(hour) < 24) return 1;
      }
      return 0;
    };

    var validateMinutes = function(minutes){
      if(angular.isNumber(parseInt(minutes))){
        if(parseInt(minutes) >= 0 && parseInt(minutes) < 60) return 1;
      }
      return 0;
    };

    var constructHour = function(input){
      var time_o = input.split(/\:/g);

      if(validateHour(time_o[0]) == 1 && validateMinutes(time_o[1]) == 1){
        if(time_o[0].length == 1) time_o[0] = '0'+time_o[0];
        if(time_o[1].length == 1) time_o[1] = '0'+time_o[1];
        return time_o[0]+':'+time_o[1];
      }
      return 0;
    };



    /*************************** PROPOSE RIDE ******************************/




    $scope.proposeRide = function(proposal,seats){
      var date1 = dateVerify(proposal.d_date);
      var date2 = dateVerify(proposal.a_date);
      var dtime = constructHour(proposal.d_hour);
      var atime = constructHour(proposal.a_hour);

      if(date1 == 0)
        $scope.error = {show:true, message:'Le format de la date de départ est incorrect'};
      else if(date2 == 0)
        $scope.error = {show:true, message:'Le format de la date d\'arrivée est incorrect'};
      else if(proposal.d_site == undefined && proposal.d_address == undefined)
        $scope.error = {show:true, message:'Vous devez choisir un site de départ, ou renseigner une adresse'};
      else if(proposal.d_site == null && proposal.d_address == null)
        $scope.error = {show:true, message:'Vous devez choisir un site de départ, ou renseigner une adresse'};
      else if(proposal.a_site == undefined && proposal.a_address == undefined)
        $scope.error = {show:true, message:'Vous devez choisir un site d\'arrivée, ou renseigner une adresse'};
      else if(proposal.a_site == null && proposal.a_address == null)
        $scope.error = {show:true, message:'Vous devez choisir un site d\'arrivée, ou renseigner une adresse'};
      else if(proposal.d_site == proposal.a_site)
        $scope.error = {show:true, message:'Vous avez sélectionner les deux mêmes sites!'};
      else if(proposal.d_hour == undefined || proposal.d_hour == null)
        $scope.error = {show:true, message:'Vous devez choisir une heure de départ'};
      else if(proposal.a_hour == undefined || proposal.a_hour == null)
        $scope.error = {show:true, message:'Vous devez choisir une heure de d\'arrivée'};
      else if(dtime == 0)
        $scope.error = {show:true, message:'L\'heure de départ n\'est pas valide.'};
      else if(atime == 0)
        $scope.error = {show:true, message:'L\'heure d\'arrivée n\'est pas valide.'};
      else if(dtime != 0 && dtime < new Date())
        $scope.error = {show:true, message:'La date de départ ne peut pas être avant ce jour.'};
      else if(atime != 0 && atime < new Date())
        $scope.error = {show:true, message:'La date d\'arrivée ne peut pas être avant ce jour.'};
      /*else if(dtime != 0 && atime !=0 && dtime < atime)
        $scope.error = {show:true, message:'La date d\'arrivée ne peut pas être avant la date de départ.'};*/
      else{
        var post = {
                      date: new Date(),
                      message: proposal.title,
                      dep_date: date1.y+'-'+date1.m+'-'+date1.d,
                      dep_time: dtime,
                      dep_adress: (proposal.d_address == undefined) ? null : proposal.d_address,
                      dep_postal: (proposal.d_postal == undefined) ? null : proposal.d_postal,
                      dep_city: (proposal.d_city == undefined) ? null : proposal.d_city,
                      dep_site: (proposal.d_site == undefined) ? null : proposal.d_site.id,
                      arr_date: date2.y+'-'+date2.m+'-'+date2.d,
                      arr_time: atime,
                      arr_adress: (proposal.a_address == undefined) ? null : proposal.a_address,
                      arr_postal: (proposal.a_postal == undefined) ? null : proposal.a_postal,
                      arr_city: (proposal.a_city == undefined) ? null : proposal.a_city,
                      arr_site: (proposal.a_site == undefined) ? null : proposal.a_site.id,
                      driver: Current.user.info.id,
                      seats: seats
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
            clearProposal();
          }
          else{
            $scope.notif = {
                              type:'alert-danger',
                              show:true,
                              title:'Oupsss !',
                              message:'Un problème est survenu lors de l\'enregistrement.'
                            };
          }
          $timeout(function(){ $scope.notif = {}; },3000);
        },function(res){ console.log('FAIL : '+res.data); });
      }
    }

    }
  }
]);
