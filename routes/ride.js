"use strict";

const express = require('express');
const models = require('../models');
const Ride = models.Ride;
const router = express.Router();

/**************************GET**************************/

/** Get all comming rides w/ all users | 02-001 */
router.get('/comming',function(req,res){
  Ride.findAll({
      where: { depature_date: { $gte: new Date() } },
      include : [
                  { model: models.Site, as:'Departure' },
                  { model: models.Site, as:'Arrival' },
                  { model: models.User, as: 'Driver'},
                  { model: models.User, as: 'Passengers'}
                ]
  })
  .then(function(rides){
      let results = [];
      for(let ride of rides){
        results.push(ride.responsify());
      }
      res.json(results);
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-001', error: err}); });
});

/** Get all comming rides except those user requested for or those who drives | 02-014*/
router.get('/comming/:id',function(req,res){
  Ride.findAll({
    where: {
              driver_id : { $ne: req.params.id }
            },
    include : [
                { model: models.Site, as:'Departure' },
                { model: models.Site, as:'Arrival' },
                { model: models.User, as: 'Driver'},
                { model: models.User, as: 'Passengers'}
              ]
  })
  .then(rides => {
    let results = [];
    if(rides){
      for(let ride of rides){
        let isPassenger = false;
        let hasRequested = false;

        let passengers = ride.Passengers;

        for(let passenger of passengers){
          if(passenger.id == req.params.id) isPassenger = true;
        }

        models.Passenger_Request.find({
          where: { user_id: req.params.id }
        })
        .then(request => {
          if(request) hasRequested = true;
        })
        .catch(err => { console.log(); });

        if(!isPassenger && !hasRequested) results.push(ride.responsify());
      }
      res.json(results);
    }
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 02-014', error:err}); });
});

/** Get all single user comming rides as driver | 02-002 */
router.get('/comming/driver/:id',function(req,res){

  Ride.findAll({
      where: {
                depature_date: {
                                  $gte: new Date()
                                },
                driver_id: req.params.id
             },
      include : [
                  { model: models.Site, as: 'Departure' },
                  { model: models.Site, as: 'Arrival' },
                  { model: models.User, as: 'Driver' },
                  { model: models.User, as: 'Passengers'}
                ]
  })
  .then(function(rides){
    if(rides){
      let results = [];
      for(let ride of rides){
        results.push(ride.responsify());
      }
      res.json(results);
    }
    else res.json({ result:0, message:'No rides found' });

  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-002', error: err}); });
});

/** Get all single user comming rides as passenger | 02-003 */
router.get('/comming/passenger/:id',function(req,res){

  models.User.find({
    where: { id: req.params.id },
    include : [
                { model: models.Site, as: 'Departure' },
                { model: models.Site, as: 'Arrival' },
                { model: models.User, as: 'Driver' },
                { model: models.User, as: 'Passengers'}
              ]
  })
  .then(user => {
    user.getRides()
    .then(rides => {
      let results = [];
      for(let ride of rides){
        if(ride.date_departure > new Date()){
          results.push(ride.responsify);
        }
      }
      res.json(results);
    })
    .catch(err => { });
  })
  .catch(err => { });
});

/** Get all single user passed rides as driver | 02-004 */
router.get('/passed/driver/:id',function(req,res){

  Ride.findAll({
    where: {  depature_date: { $lt: new Date() },
              driver_id: req.params.id
           },
    include : [
                { model: models.Site, as: 'Departure' },
                { model: models.Site, as: 'Arrival' },
                { model: models.User, as: 'Driver'},
                { model: models.User, as: 'Passengers'}
              ]
  })
  .then(function(rides){
    let results = [];
    for(let ride of rides){
      results.push(ride.responsify());
    }
    res.json(results);
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong with url 02-004', error: err}); });
});

/** Get all single user passed rides as passenger | 02-005 */
router.get('/passed/passenger/:id',function(req,res){

  models.User.find({
    where: { id: req.params.id },
    include : [
                { model: models.Site, as: 'Departure' },
                { model: models.Site, as: 'Arrival' },
                { model: models.User, as: 'Driver' },
                { model: models.User, as: 'Passengers'}
              ]
  })
  .then(user => {
    user.getRides()
    .then(rides => {
      let results = [];
      for(let ride of rides){
        if(ride.departure_date < new Date()){
          results.push(ride);
        }
      }
      res.json(results);
    })
    .catch(err => { });
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong with url 02-006', error: err}); });
});

/** Get a single ride | 02-007 */
router.get('/:id',function(req,res){
  Ride.find({
    where:{
            id: req.params.id
          },
    include: [
                { model: models.User, as:'Driver' },
                { model: models.User, as:'Passengers'},
                { model: models.Site, as:'Departure' },
                { model: models.Site, as:'Arrival' }
             ]
  })
  .then(function(ride){
    res.json(ride.responsify());
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-007', error: err}); } );

});

/** Add an accepted Passenger to a Ride | 02-009 */
router.get('/:rideID/users/:userID',function(req,res,next){
    Ride.find({
        where:{
            id: req.params.rideID
        }
    })
    .then(function(ride){
        if(ride){
           return models.User.find({
              where:{
                      id: req.params.userID
                    }
            })
            .then(function(user){
              user.addRide(ride);
              res.json({result: 1 });
            })
            .catch(err => { res.json({ result: -2, error: err }); });
        }
    })
    .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-010', error: err}); } );
});

/**************************POST**************************/

/** Create a new ride | 02-010 */
router.post('/new',function(req,res,next){
  let send = req.body;

  Ride.create({
    ad_date: send.date,
    ad_message: send.message,
    depature_date: send.dep_date,
    departure_adress: (send.dep_adress == undefined) ? null : send.dep_adress,
    departure_postalCode: (send.dep_postal == undefined) ? null : send.dep_postal,
    departure_city: (send.dep_city == undefined) ? null : send.dep_city,
    arrival_date: send.arr_date,
    arrival_adress: (send.arr_adress == undefined) ? null : send.arr_adress,
    arrival_postalCode: (send.arr_postal == undefined) ? null : send.arr_postal,
    arrival_city: (send.arr_city == undefined) ? null : send.arr_city
  })
  .then(ride => {
      if(send.dep_site != undefined){
        models.Site.find({
          where: { id: send.dep_site}
        })
        .then(site => {
          ride.setDeparture(site)
          .then(site => { console.log('Departure Site successfully added to the ride w/ url 02-010'); })
          .catch(err => { res.json({result:-2, message:'Unable to set Departure Site w/ url 02-010', error:err}); });
        })
        .catch(err => { res.json({result:-1, message:'Site not found w/ url 02-010', error:err}); });
      }
      if(send.arr_site != undefined){
        models.Site.find({
          where: { id: send.arr_site }
        })
        .then(site => {
          ride.setArrival(site)
          .then(site => { console.log('Arrival site successfully added to the ride w/ url 02-010');})
          .catch(err => { res.json({result:-2, message:'Unable to set Arrival Site w/ url 02-010', error:err}); });
        })
        .catch(err => { res.json({result:-1, message:'Site not found w/ url 02-010', error:err}); });
      }

      models.User.find({
        where: { id: send.driver }
      })
      .then(user => {
        ride.setDriver(user)
        .then(user => { console.log('User successfully added as Driver to the ride w/ url 02-010'); })
        .catch(err => { res.json({result:-2, message:'Unable to set Driver w/ url 02-010', error:err}); });
      })
      .catch(err => { res.json({result:-1, message:'User not found w/ url 02-010', error:err}); });

      res.json({result:1, object:ride});
   })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-010', error: err}); } );

});

/** Update single ride | 02-011 */
router.post('/edit',function(req,res,next){
  let send = req.body;

  Ride.find({
    where : { id: send.id }
  })
  .then(ride => {
      if(ride){
        ride.updateAttributes({
          ad_date: send.date,
          ad_message: send.message,
          depature_date: send.dep_date,
          departure_adress: (send.dep_adress == undefined) ? null : send.dep_adress,
          departure_postalCode: (send.dep_postal == undefined) ? null : send.dep_postal,
          departure_city: (send.dep_city == undefined) ? null : send.dep_city,
          arrival_date: send.arr_date,
          arrival_adress: (send.arr_adress == undefined) ? null : send.arr_adress,
          arrival_postalCode: (send.arr_postal == undefined) ? null : send.arr_postal,
          arrival_city: (send.arr_city == undefined) ? null : send.arr_city
        });

        if(send.dep_site != undefined){
          models.Site.find({
            where: { id: send.dep_site}
          })
          .then(site => {
            ride.setDeparture(site)
            .then(site => { console.log('Departure Site successfully added to the ride w/ url 02-011'); })
            .catch(err => { res.json({result:-2, message:'Unable to set Departure Site w/ url 02-011', error:err}); });
          })
          .catch(err => { res.json({result:-1, message:'Site not found w/ url 02-011', error:err}); });
        }
        if(send.arr_site != undefined){
          models.Site.find({
            where: { id: send.arr_site }
          })
          .then(site => {
            ride.setArrival(site)
            .then(site => { console.log('Arrival site successfully added to the ride w/ url 02-011');})
            .catch(err => { res.json({result:-2, message:'Unable to set Arrival Site w/ url 02-011', error:err}); });
          })
          .catch(err => { res.json({result:-1, message:'Site not found w/ url 02-011', error:err}); });
        }
        res.json({result:1, message:'Ride successfully updated w/ url 02-011'});
      }
      else res.json({result:0, message:'Ride not found w/ url 02-011'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 02-011', error:err}); });
});

/** Search a ride | 02-013 */
router.post('/search',function(req,res){
  let send = req.body;

  Ride.findAll({
    where:  {
              departure_idSite: send.departure,
              arrival_idSite: send.arrival//,
              //departure_date: send.date
            },
    include:  [
                { model: models.User, as: 'Driver' },
                { model: models.User, as: 'Passengers' },
                { model: models.Site, as: 'Departure' },
                { model: models.Site, as: 'Arrival' }
              ]
  })
  .then(rides => {
    let results = [];
    for(let ride of rides){
      results.push(ride.responsify());
    }
    res.json(results);
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 02-013'}); });
});

/**************************DELETE**************************/

/** Delete a ride | 02-012 */
router.delete('/:id',function(req,res,next){
  Ride.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(ride){
    if(ride){
      ride.destroy()
      .then(ride => { if(ride) res.json(1); else res.json(0); })
      .catch(err => { res.json({result: -1, error: err}); } );
    }
    else{
      res.json({ result: -1 });
    }
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-011', error: err}); });
});

/**************************END**************************/
module.exports = router;
