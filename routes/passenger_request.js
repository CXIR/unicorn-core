"use strict";

const express = require('express');
const models = require('../models');
const Passenger_Request = models.Passenger_Request;
const router = express.Router();

/**************************GET**************************/

/** Get all sended passenger request | 01-001 */
router.get('/sended/:userID',function(req,res){
  Passenger_Request.findAll({
      where: {
                user_id: req.params.userID
             }
  })
  .then(function(requests){
    if(requests){
      let results = [];
      for(let req of requests){
        results.push(req.responsify());
      }
      res.json(results);
    }
    else res.json({error:0, message:'No request found on 01-001'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong with url 01-001'}); });

});

/** Get all received passenger request | 01-002 */
router.get('/received/:rideID',function(req,res,next){
  Passenger_Request.findAll({
    where:{
      ride_id: req.params.rideID
    }
  })
  .then(function(requests){
    if(requests){
      let results = [];
      for(let request of requests){
        results.push(request.responsify());
      }
      res.json(results);
    }
    else res.json({result:0, message:'No request found on 01-002'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong with url 01-002', error:err}); });
});

/** Accept passenget request | 01-003 */
router.get('/accept/:id',function(req,res,next){
  Passenger_Request.find({
    where: { id: req.params.id }
  })
  .then(function(request){
    if(request){
      if(req.delete_at != null){
        res.redirect('/ride//:rideID/users/:userID');
      }
      else res.json({result:2, message:'This request has been already treated'});
    }
    else res.json({result:0, message:'No request found on 01-003'})
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong with url 01-003'}); });
});

/**************************POST**************************/

/** Create a passenger request | 01-004 */
router.post('/new',function(req,res,next){
  let send = req.body;

  Passenger_Request.create({
    requestDate: new Date(),
    ride_id: send.ride,
    user_id: send.user
  })
  .then(function(request){
    if(request){
      res.json(ride);
    }
    else res.json({result:0, message:'This request was not created on url 01-004'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong with url 01-004'})});

});

/**************************DELETE**************************/

/** Delete a passenger request 01-005 */
router.delete('/delete/:id',function(req,res,next){
  Passenger_Request.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(request){
    if(request){
      Passenger_Request.destroy()
      .then(function(request){
        req.json({result: 1});
      })
      .catch(err => { res.json({result:-1, message:'Unable to destroy this request on url 01-005'}); });
    }
    else res.json({result:0, message:'No request find on url 01-005'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong with url 01-005'}); });

});


/**************************END**************************/
module.exports = router;
