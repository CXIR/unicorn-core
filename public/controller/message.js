'use strict';

/**
* View : message
*/
shareAppControllers.controller('messageCtrl',['$scope','$location','$http',
    function($scope,$location,$http){
      var node_url = '';

      /** Get all unread messages preview of the current user */
      var getUnreadMessages = function(){
        $http.get(node_url)
        .then(function(res){
          if(res.data != 0){
            $scope.unread_talks = res.data;
          }
        },function(res){ console.log('FAIL : '+res.data); });
      }; getUnreadMessages();

      /** Get all read messages preview of the current user */
      var getReadMessages = function(){
        $http.get(node_url)
        .then(function(res){
          if(res.data != 0){
            $scope.read_talks = res.data;
          }
        },function(res){ console.log('FAIL : '+res.data); });
      }; getReadMessages();

      /** Show full talk in parameter */
      $scope.showTalk = function(talk){

      }

      /** Reply in a talk */
      $scope.talkReply = function(reply){

      }

    }
]);
