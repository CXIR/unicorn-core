"use strict";

const express = require('express');
const models = require('../models');
const Ride = models.Ride;
const router = express.Router();


/**************************GET**************************/

/** Get all comming rides w/ all users | 02-001 */
router.get('/comming',function(req,res){
  Ride.findAll({
      where: { departure_date: { $gte: new Date() } },
      include : [
                  { model: models.Site, as:'Departure' },
                  { model: models.Site, as:'Arrival' },
                  { model: models.User, as: 'Driver', include: [ models.Site, models.Status ] },
                  { model: models.User, as: 'Passengers'},
                  { model: models.Passenger_Request, as: 'Asks', include: [ models.User ] }
                ]
  })
  .then(function(rides){
    let results = [];
    for(let ride of rides){
      results.push(ride.responsify());
    }

    if(results.length == 0) res.json({result:0, message:'No ride found w/ url 02-001'});
    else res.json({result:1, content:results});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-001', error: err}); });
});

/** Get all comming rides except those user requested for or those who drives | 02-014 */
router.get('/comming/:id',function(req,res){
  Ride.findAll({
    where: {
              driver_id : { $ne: req.params.id }
            },
    include : [
                { model: models.Site, as:'Departure' },
                { model: models.Site, as:'Arrival' },
                { model: models.User, as: 'Driver', include: [ models.Site, models.Status ] },
                { model: models.User, as: 'Passengers'},
                { model: models.Passenger_Request, as: 'Asks' }
              ]
  })
  .then(rides => {
    let results = [];
    for(let ride of rides){
      let isPassenger = false;
      let hasRequested = false;

      let passengers = ride.Passengers;
      let requests = ride.Asks;

      for(let passenger of passengers){
        if(passenger.id == req.params.id) isPassenger = true;
      }
      for(let request of requests){
        if(request.user_id == req.params.id) hasRequested = true;
      }

      if(!isPassenger && !hasRequested) results.push(ride.responsify());
    }

    if(results.length == 0) res.json({result:0, message:'No ride found w/ url 02-014'});
    else res.json({result:1, content:results});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 02-014', error:err}); });
});

/** Get all single user comming rides as driver | 02-002 */
router.get('/comming/driver/:id',function(req,res){

  Ride.findAll({
      where: {
                departure_date: {
                                  $gte: new Date()
                                },
                driver_id: req.params.id
             },
      include : [
                  { model: models.Site, as: 'Departure' },
                  { model: models.Site, as: 'Arrival' },
                  { model: models.User, as: 'Driver' },
                  { model: models.User, as: 'Passengers'},
                  { model: models.Passenger_Request, as: 'Asks' }
                ]
  })
  .then(function(rides){
    let results = [];
    for(let ride of rides){
      results.push(ride.responsify());
    }

    if(results.length == 0) res.json({ result:0, message:'No rides found' });
    else res.json({result:1,content:results});

  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-002', error: err}); });
});

/** Get all single user comming rides as passenger | 02-003 */
router.get('/comming/passenger/:id',function(req,res){

  models.User.find({
    where: { id: req.params.id },
    include: [
                {
                  model: models.Ride,
                  include: [
                              { model: models.Site, as: 'Departure' },
                              { model: models.Site, as: 'Arrival' },
                              { model: models.User, as: 'Driver'}
                            ]
                }
             ]
  })
  .then(user => {
    let rides = user.Rides;
    let results = [];
    for(let ride of rides){
      let elem = ride.responsify();
      if(elem.departure_date >= new Date()){
        results.push(elem);
      }
    }

    if(results.length == 0) res.json({result:0, message:'No ride found w/ 02-003'});
    else res.json({result:1,content:results});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 02-003', error:err}); });
});

/** Get all single user passed rides as driver | 02-004 */
router.get('/passed/driver/:id',function(req,res){

  Ride.findAll({
    where: {  departure_date: { $lt: new Date() },
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

    if(results.length == 0) res.json({result:0, message:'No ride found w/ url 02-004'});
    else res.json({result:1, content:results});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong with url 02-004', error: err}); });
});

/** Get all single user passed rides as passenger | 02-005 */
router.get('/passed/passenger/:id',function(req,res){

  models.User.find({
    where: { id: req.params.id },
    include: [
                {
                  model: Ride,
                  include: [
                              { model: models.Site, as: 'Departure' },
                              { model: models.Site, as: 'Arrival' },
                              { model: models.User, as: 'Driver'}
                            ]
                }
             ]
  })
  .then(user => {
    let rides = user.Rides;
    let results = [];
    for(let ride of rides){
      let elem = ride.responsify();
      if(elem.departure_date < new Date()){
        results.push(elem);
      }
    }

    if(results.length == 0) res.json({result:0, message:'No ride found w/ url 02-006'});
    else res.json({result:1, content:results});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong with url 02-006', error: err}); });
});

/** Get a single ride | 02-007 */
router.get('/:id',function(req,res){
  Ride.find({
    where:{
            id: req.params.id
          },
          include : [
                      { model: models.Site, as:'Departure' },
                      { model: models.Site, as:'Arrival' },
                      { model: models.User, as: 'Driver', include: [ models.Site, models.Status ] },
                      { model: models.User, as: 'Passengers'},
                      { model: models.Passenger_Request, as: 'Asks', include: [ models.User ] }
                    ]
  })
  .then(function(ride){
    res.json({result:1, content:ride.responsify()});
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
              res.json({result: 1, message:'User successfully added to the Ride w/ url ' });
            })
            .catch(err => { res.json({ result: -2, error: err }); });
        }
    })
    .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-010', error: err}); } );
});

/** Add a request Passenger to a Ride | 02-00? */
router.get('/:rideID/passenger_request/:requestID',function(req,res,next){
    Ride.find({
        where:{
            id: req.params.rideID
        }
    })
    .then(ride => {
        if(ride){
           return models.Passenger_Request.find({
              where:{
                      id: req.params.requestID
                    }
            })
            .then(request => {
              request.addRide(ride)
              .then(ride => {
                ride.decrement('remain_seats');
                res.json({result:1, message:'Request successfully created w/ url 02-010'});
              })
              .catch(err => { res.json({result:-1, message:'Unable to associate ride and request w/ url 02-010', error:err}); });
            })
            .catch(err => { res.json({ result:-1, message:'Unable to find Passenger_Request w/ url 02-010', error:err}); });
        }
        else res.json({result:0, message:'Unable to find ride w/ url 02-010'});
    })
    .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-010', error: err}); } );
});

/**************************POST**************************/

/** Create a new ride | 02-010 */
router.post('/new',function(req,res,next){
  let send = req.body;

  Ride.create({
    ad_date: new Date(),
    ad_message: send.message,
    departure_date: send.dep_date,
    departure_time: send.dep_time,
    departure_adress: (send.dep_adress == undefined) ? null : send.dep_adress,
    departure_postalCode: (send.dep_postal == undefined) ? null : send.dep_postal,
    departure_city: (send.dep_city == undefined) ? null : send.dep_city,
    arrival_date: send.arr_date,
    arrival_time: send.arr_time,
    arrival_adress: (send.arr_adress == undefined) ? null : send.arr_adress,
    arrival_postalCode: (send.arr_postal == undefined) ? null : send.arr_postal,
    arrival_city: (send.arr_city == undefined) ? null : send.arr_city,
    remain_seats: send.seats
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
          departure_date: send.dep_date,
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
              departure_id: (send.departure == undefined) ? { $gt: 0} : send.departure,
              arrival_id: (send.arrival == undefined) ? { $gt: 0 } : send.arrival,
              departure_date: (send.date == undefined) ? { $gt: new Date() } : send.date+'T00:00:00Z',
              driver_id: { $ne: send.user }
            },
    include:  [
                { model: models.User, as: 'Driver' },
                { model: models.User, as: 'Passengers' },
                { model: models.Site, as: 'Departure' },
                { model: models.Site, as: 'Arrival' },
                { model: models.Passenger_Request, as: 'Asks' }
              ]
  })
  .then(rides => {
    let results = [];

    for(let ride of rides){
      let isPassenger = false;
      let hasRequested = false;

      let passengers = ride.Passengers;
      let requests = ride.Asks;

      for(let passenger of passengers){
        if(passenger.id == send.user) isPassenger = true;
      }
      for(let request of requests){
        if(request.user_id == send.user) hasRequested = true;
      }

      if(!isPassenger && !hasRequested) results.push(ride.responsify());
    }

    if(results.length == 0) res.json({result:0, message:'No ride found w/ url 02-013'});
    else res.json({result:1, content:results});
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
      .then(ride => {
         if(ride) res.json({result:1, message:'Ride successfully removed w/ url '});
         else res.json({result:0, message:'Ride not found w/ url '}); })
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
