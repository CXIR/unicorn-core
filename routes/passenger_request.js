"use strict";

const express = require('express');
const models = require('../models');
const Passenger_Request = models.Passenger_Request;
const router = express.Router();

/**************************GET**************************/

/** Get all sended passenger request | 01-001
* at this time, need to execute sub request to recover sites and driver
*/
router.get('/sended/:userID',function(req,res){
  Passenger_Request.findAll({
      where: { user_id: req.params.userID },
      include: [ models.Ride ]
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

/** Get all single ride received passenger request | 01-002*/
router.get('/received/:rideID',function(req,res,next){
  Passenger_Request.findAll({
    where: { ride_id: req.params.rideID },
    include: [
                { model: models.Ride,
                  include: [
                              { model: models.Site , as: 'Departure'},
                              { model: models.Site , as: 'Arrival'},
                              { model: models.User , as: 'Driver'},
                              { model: models.User , as: 'Passengers'}
                           ]
                },
                { model: models.User }
              ]
  })
  .then(function(requests){
      let results = [];
      for(let request of requests){
        results.push(request);
      }
      res.json(results);
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong with url 01-002', error:err}); });
});

/** Get all rides received requests | 01-000 */
router.get('/received/:userID',function(req,res){
    Passenger_Request.findAll({
      where: { user_id: req.params.id },
      include: [
                  { model: models.Ride,
                    include: [
                                { model: models.Site , as: 'Departure'},
                                { model: models.Site , as: 'Arrival'},
                                { model: models.User , as: 'Driver'},
                                { model: models.User , as: 'Passengers'}
                             ]
                  },
                  { model: models.User }
                ]
    })
    .then(requests => {

    })
    .catch(err => { });
});

/** Accept passenger request | 01-003 */
router.get('/accept/:id',function(req,res,next){
  Passenger_Request.find({
    where: { id: req.params.id }
  })
  .then(function(request){
    if(request){
      if(req.delete_at == null){
        request.updateAttributes({
          acceptedDate: new Date()
        });

        res.redirect('/ride/'+request.ride_id+'/users/'+request.user_id);
      }
      else res.json({result:2, message:'This request has been already treated'});
    }
    else res.json({result:0, message:'No request found on 01-003'})
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong with url 01-003'}); });
});

/** Refuse passenger request | 01-004 */
router.get('/refused/:id',function(req,res,next){
  Passenger_Request.find({
    where: { id: req.params.id }
  })
  .then(request => {

  })
  .catch(err => { });
});

/**************************POST**************************/

/** Create a passenger request | 01-005 */
router.post('/new',function(req,res,next){
  let send = req.body;

  Passenger_Request.create({
    requestDate: new Date(),
  })
  .then(function(request){
    models.User.find({
      where: { id: send.user }
    })
    .then(user => {
      request.setUser(user)
      .then(user => { console.log('User successfully added to the request w/ url 01-005');})
      .catch(err => { res.json({result:-2, message:'Unable to set User on request w/ url 01-005', error:err}); });
    })
    .catch(err => { res.json({result:-1, message:'User not found w/ url 01-005', error:err}); });

    models.Ride.find({
      where: { id: send.ride }
    })
    .then(ride => {
      request.setRide(ride)
      .then(ride => { console.log('Ride successfully added to the request w/ url 01-005');})
      .catch(err => { res.json({result:-2, message:'Unable to set Ride to request w/ url 01-005', error:err}); });
    })
    .catch(err => { res.json({result:-1, message:'Ride not found w/ url 01-005', error:err}); });

    res.json({result:1, message:'Request successfully created w/ url 01-005'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong with url 01-005'})});

});

/**************************DELETE**************************/

/** Delete a passenger request 01-006 */
router.delete('/delete/:id',function(req,res,next){
  Passenger_Request.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(request){
    if(request){
      request.destroy()
      .then(function(request){
        req.json({result: 1});
      })
      .catch(err => { res.json({result:-1, message:'Unable to destroy this request on url 01-006'}); });
    }
    else res.json({result:0, message:'No request find on url 01-006'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong with url 01-006'}); });

});


/**************************END**************************/
module.exports = router;
