"use strict";

const express = require('express');
const models = require('../models');
const Passenger_Request = models.Passenger_Request;
const router = express.Router();

/**************************GET**************************/

/** Get all sended passenger request | 01-001 */
router.get('/sended/:userID',function(req,res){
  Passenger_Request.findAll({
      where: { user_id: req.params.userID },
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
    let results = [];
    for(let request of requests){
      results.push(request.responsify());
    }

    if(results.lenght == 0) res.json({error:0, message:'No request found on 01-001'});
    else res.json({result:1,content:results});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong with url 01-001', error:err}); });
});

/** Get all ride received passenger request | 01-002*/
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
  .then(requests => {
      let results = [];
      for(let request of requests){
        results.push(request.responsify());
      }

      if(results.length == 0) res.json({result:0, message:'No request found w/ url 01-002'});
      else res.json({result:1, content:results});

  })
  .catch(err => { res.json({result:-1, message:'Something went wrong with url 01-002', error:err}); });
});

/**************************POST**************************/

/** Refuse passenger request | 01-004 */
router.post('/refuse',function(req,res,next){
  let send = req.body;

  Passenger_Request.find({
    where: { id: send.request }
  })
  .then(request => {
    if(request.refusedDate == null && request.acceptedDate == null){
      request.updateAttributes({
        refusedDate: new Date()
      });

      models.Ride.find({
        where: {id: send.ride }
      })
      .then(ride => {
        if(ride){
          ride.increment('remain_seats');
          res.json({result:1, message:'Request successfully refused w/ url 01-004'})
        }
        else res.json({result:-1, message:'No ride found w/ url 01-004'});
      })
      .catch(err => { res.json({result:-1, message:'Unable to find ride w/ url 01-004', error:err}); });
    }
    else res.json({result:0, message:'Request has already been treated w/ ulr 01-004'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 01-004', error:err}); });
});

/** Accept passenger request | 01-003 */
router.post('/accept',function(req,res,next){
  let send = req.body;
  Passenger_Request.find({
    where: { id: send.request }
  })
  .then(request => {
    if(request.refusedDate == null){
      if(request.acceptedDate == null){
        request.updateAttributes({
          acceptedDate: new Date()
        });
        res.redirect('/ride/'+send.ride+'/users/'+request.user);
      }
      else res.json({result:0, message:'Request has already been treated w/ url '});
    }
    else res.json({result:0, message:'Request has been refused w/ url '});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong with url 01-003'}); });
});

/** Create a passenger request | 01-005 */
router.post('/new',function(req,res,next){
  let send = req.body;

  Passenger_Request.find({
    where: { user_id: send.user }
  })
  .then(req => {
    if(req) res.json({result:0, message:'Already requested for this ride w/ url 01-005'});
    else{
      Passenger_Request.create({
        requestDate: new Date()
      })
      .then(request => {
        models.User.find({
          where: { id: send.user }
        })
        .then(user => {
          request.setUser(user)
          .then(user =>{

            //res.redirect('/ride/'+send.ride+'/passenger_request/'+request.id);
          })
          .catch(err => { res.json({result:-1, message:'Something went wrong when setting user on request w/ url 01-005', error:err}); });
        })
        .catch(err => { res.json({result:-1, message:'Something went wrong when searching user w/ url 01-005', error:err}); });
      })
      .catch(err => { res.json({result:-1, message:'Something went wrong when creating request w/ url 01-005', error:err}); });
    }
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 01-005', error:err}); });

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
