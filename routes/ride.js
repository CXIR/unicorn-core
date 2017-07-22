"use strict";

const express = require('express');
const models = require('../models');
const Ride = models.Ride;
const router = express.Router();


/**************************GET**************************/

/** Get full Comming Rides | 02-001 */
router.get('/comming',function(req,res){
  Ride.findAll({
      where: { departure_date: { $gte: new Date() } },
      include : [
                  { model: models.Site, as:'Departure' },
                  { model: models.Site, as:'Arrival' },
                  { model: models.User, as: 'Driver', include: [ models.Site, models.Status ] },
                  { model: models.User, as: 'Passengers', include: [ models.Site, models.Status ] },
                  { model: models.User, as: 'Requests', include: [ models.Site, models.Status ] }
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
                { model: models.User, as: 'Passengers', include: [ models.Site, models.Status ]},
                { model: models.User, as: 'Requests', include: [ models.Site, models.Status ] }
              ]
  })
  .then(rides => {
    let results = [];
    for(let ride of rides){
      let isPassenger = false;
      let hasRequested = false;

      let passengers = ride.Passengers;
      let requests = ride.Requests;

      for(let passenger of passengers){
        if(passenger.id == req.params.id) isPassenger = true;
      }
      for(let request of requests){
        if(request.id == req.params.id) hasRequested = true;
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
                  { model: models.User, as: 'Passengers', include: [ models.Site, models.Status ] },
                  { model: models.User, as: 'Requests', through: { where: { acceptedDate: null, refusedDate: null } }, include: [ models.Site, models.Status ] }
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
                  as: 'Passengers',
                  include: [
                              { model: models.Site, as: 'Departure' },
                              { model: models.Site, as: 'Arrival' },
                              { model: models.User, as: 'Driver', include: [ models.Site, models.Status ] }
                            ]
                }
             ]
  })
  .then(user => {
    let rides = user.Passengers;
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
      where: {
                departure_date: {
                                  $lt: new Date()
                                },
                driver_id: req.params.id
             },
      include : [
                  { model: models.Site, as: 'Departure' },
                  { model: models.Site, as: 'Arrival' },
                  { model: models.User, as: 'Driver' },
                  { model: models.User, as: 'Passengers', include: [ models.Site, models.Status ] },
                  { model: models.User, as: 'Requests', include: [ models.Site, models.Status ] }
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

/** Get all single user passed rides as passenger | 02-005 */
router.get('/passed/passenger/:id',function(req,res){

  models.User.find({
    where: { id: req.params.id },
    include: [
                {
                  model: models.Ride,
                  as: 'Passengers',
                  include: [
                              { model: models.Site, as: 'Departure' },
                              { model: models.Site, as: 'Arrival' },
                              { model: models.User, as: 'Driver', include: [ models.Site, models.Status ] }
                            ]
                }
             ]
  })
  .then(user => {
    let rides = user.Passengers;
    let results = [];
    for(let ride of rides){
      let elem = ride.responsify();
      if(elem.departure_date < new Date()){
        results.push(elem);
      }
    }

    if(results.length == 0) res.json({result:0, message:'No ride found w/ 02-003'});
    else res.json({result:1,content:results});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 02-003', error:err}); });
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
                      { model: models.User, as: 'Passengers', include: [ models.Site, models.Status ] },
                      { model: models.User, as: 'Requests', include: [ models.Site, models.Status ] }
                    ]
  })
  .then(function(ride){
    res.json({result:1, content:ride.responsify()});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-007', error: err}); } );

});

/** Get full User sended request | */
router.get('/sended/:userID',function(req,res){

  models.User.find({
    where: { id: req.params.userID },
    include: [
                {
                  model: models.Ride,
                  as: 'Requests',
                  include: [
                              { model: models.Site, as: 'Departure' },
                              { model: models.Site, as: 'Arrival' },
                              { model: models.User, as: 'Driver', include: [ models.Site, models.Status ]}
                            ]
                }
             ]
  })
  .then(user => {
    if(user){
      let requests = user.Requests;
      let results = [];

      for(let request of requests){
        let elem = request.responsify();
        results.push(elem);
      }
      if(results.length == 0) res.json({result:0, message:'No ride found w/ url '});
      else res.json({result:1, content:results});
    }
    else res.json({result:0, message:'User not found w/ url '});
  })
  .catch(err => { res.json({result:-1, message:'Unable to find User w/ url ', error:err}); });
});

/**************************POST**************************/

/** Create new Request for a Ride | */
router.post('/request',function(req,res,next){
  let send = req.body;

  models.Requests.find({
    where:{
      ride_id: send.ride,
      user_id: send.user
    }
  })
  .then(request => {
    if(request) res.json({result:0, message:'User has already requested for this ride w/ url '});
    else{

      Ride.find({
        where: { id: send.ride }
      })
      .then(ride => {
        if(ride){

          models.User.find({
            where: { id: send.user }
          })
          .then(user => {
            if(user){

              ride.addRequest(user, { requestDate: new Date() })
              .then(user => {
                ride.decrement('remain_seats');
                res.json({result:1, message:'User successfully set to Ride Requests w/ url '});
              })
              .catch(err => { res.json({result:-1, message:'Unable to set User to Ride Request w/ url ', error:err}); });
            }
            else res.json({result:0, message:'User not found w/ url '});
          })
          .catch(err => { res.json({result:-1, message:'Unable to find User w/ url ', error:err}); });
        }
        else res.json({result:0, message:'Ride not found w/ url '});
      })
      .catch(err => { res.json({result:-1, message:'Unable to find ride w/ url ', error:err}); });
    }
  })
  .catch(err => { res.json({result:-1, message:'Unable to find Request w/ url ', error:err}); });
});

/** Accept Request and add Passenger to Ride | */
router.post('/passenger',function(req,res,next){
  let send = req.body;

  models.Requests.find({
    where: {
      user_id: send.user,
      ride_id: send.ride
    }
  })
  .then(request => {
    if(request){
      if(request.refusedDate == null){
        if(request.acceptedDate == null){

          Ride.find({
            where: { id: send.ride }
          })
          .then(ride => {
            if(ride){

                models.User.find({
                  where: { id: send.user }
                })
                .then(user => {

                  ride.addPassenger(user, { marked: 0 })
                  .then(user => {

                    request.updateAttributes({
                      acceptedDate: new Date()
                    });
                    res.json({result:1, message:'Passenger successfully added to the Ride w/ url '});
                  })
                  .catch(err => { res.json({result:-1, message:'Unable to set User to the Ride w/ url ', error:err}); });
                })
                .catch(err => { res.json({result:-1, message:'Unable to find User w/ url ', error:err}); });
            }
            else res.json({result:0, message:'Ride not found w/ url '});
          })
          .catch(err => { res.json({result:-1, message:'Unable to find Ride w/ url ', error:err}); });
        }
        else res.json({result:0, message:'Request already accepted w/ url '});
      }
      else res.json({result:0, message:'Request already refused w/ url '});
    }
    else res.json({result:0, message:'Request not found w/ url '});
  })
  .catch(err => { res.json({result:-1, message:'Unable to find Request w/ url ', error:err}); });

});

/** Refuse Request | */
router.post('/refuse',function(req,res,next){
  let send = req.body;

  models.Requests.find({
    where: {
      ride_id: send.ride,
      user_id: send.user
    }
  })
  .then(request => {
    if(request){
      if(request.acceptedDate == null){
        if(request.refusedDate == null){

          Ride.find({
            where: { id: send.ride }
          })
          .then(ride =>{
            if(ride){

              ride.increment('remain_seats');
              request.updateAttributes({
                refusedDate: new Date()
              });
              res.json({result:1, message:'Request successfully refused w/ url '});
            }
            else res.json({result:0, message:'Ride not found w/ url '});
          })
          .catch(err => { res.json({result:-1, message:'Unable to find Ride w/ url ', error:err}); });
        }
        else res.json({result:0, message:'Request has already been refused w/ url '});
      }
      else res.json({result:0, message:'Request has already been accepted w/ url'});
    }
    else res.json({result:0, message:'Request not found w/ url '});
  })
  .catch(err => { res.json({result:-1, message:'Unable to find request w/ url ', error:err}); });

});

/** Create a new ride | 02-010 */
router.post('/new',function(req,res,next){
  let send = req.body;

  if(send.dep_date < new Date()) res.json({result:0, message:'Departure date could not be before today w/ url'});
  else if(send.arr_date < new Date()) res.json({result:0, message:'Arrival date could not be before today w/ url'});
  else if(send.dep_date > send.arr_date) res.json({result:0, message:'Departure could not be after Arrival w/ url'});
  else if(send.dep_site == undefined && send.arr_site == undefined){
    if((send.dep_adress == send.arr_adress) && (send.dep_postal == send.arr_postal)) res.json({result:0, message:'Departure and Arrival addresses could not be the same w/ url '});
    else{
      models.User.find({
        where: { id: send.driver }
      })
      .then(driver => {
        if(driver){

          Ride.create({
            ad_date: new Date(),
            ad_message: send.message,
            departure_date: send.dep_date,
            departure_time: send.dep_time,
            departure_adress: send.dep_adress,
            departure_postalCode: send.dep_postal,
            departure_city: send.dep_city,
            arrival_date: send.arr_date,
            arrival_time: send.arr_time,
            arrival_adress: send.arr_adress,
            arrival_postalCode: send.arr_postal,
            arrival_city: send.arr_city,
            remain_seats: send.seats
          })
          .then(ride => {
            ride.setDriver(driver)
            .then(driver =>{
              if(ride) res.json({result:1, message:'Ride successfully created w/ url '});
              else res.json({result:0, message:'Ride not created w/ url '});
            })
            .catch(err => { res.json({result:-1, message:'Unable to set User to the Ride w/ url 02-010',error:err}); });
          })
          .catch(err => { res.json({result:-1, message:'Unable to create Ride w/ url ', error:err}); });
        }
        else res.json({result:0, message:'User not found w/ url 02-010'});
      })
      .catch(err => { res.json({result:-1, message:'Unable to find User w/ url 02-010', error:err}); });
    }
  }
  else if(send.dep_site != undefined && send.arr_site != undefined){
    if(send.dep_site == send.arr_site) res.json({result:0, message:'Departure and Arrival Sites could not be the same w/ url'});
    else{

      models.User.find({
        where: { id: send.driver }
      })
      .then(driver => {
        if(driver){

          models.Site.find({
            where: { id: send.dep_site }
          })
          .then(departure =>  {
            if(departure){

              models.Site.find({
                where : { id: send.arr_site }
              })
              .then(arrival => {

                Ride.create({
                  ad_date: new Date(),
                  ad_message: send.message,
                  departure_date: send.dep_date,
                  departure_time: send.dep_time,
                  arrival_date: send.arr_date,
                  arrival_time: send.arr_time,
                  remain_seats: send.seats
                })
                .then(ride => {
                  if(ride){

                    ride.setDeparture(departure)
                    .then(departure => {

                      ride.setArrival(arrival)
                      .then(arrival => {

                        ride.setDriver(driver)
                        .then(driver => {
                          res.json({result:1, message:'Ride successfully created w/ url '});
                        })
                        .catch(err => { res.json({result:-1, message:'Unable to set User to the Ride w/ url 02-010', error:err}); });
                      })
                      .catch(err => { res.json({result:-1, message:'Unable to set Arrival to the Ride w/ url ', error:err}); });
                    })
                    .catch(err => { res.json({result:-1, message:'Unable to set Departure to the Ride w/ url ', error:err}); });
                  }
                  else res.json({result:0, message:'Ride not created w/ url '});
                })
                .catch(err => { res.json({result:-1, message:'Unable to create Ride w/ url ', error:err}); });
              })
              .catch(err => { res.json({result:-1, message:'Unable to find Arrival w/ url ', error:err}); });
            }
            else res.json({result:0, message:'Departure Site not found w/ url '});
          })
          .catch(err => { res.json({result:-1, message:'Unable to find Departure w/ url ', error:err}); });
        }
        else res.json({result:0, message:'User not found w/ url 02-010'});
      })
      .catch(err => { res.json({result:-1, message:'Unable to find User w/ url 02-010', error:err}); });

    }
  }
  else if(send.dep_site != undefined && send.arr_site == undefined){
    models.User.find({
      where: { id: send.driver }
    })
    .then(driver => {
      if(driver){

        models.Site.find({
          where: { id: send.dep_site }
        })
        .then(departure => {
          if(departure){

            Ride.create({
              ad_date: new Date(),
              ad_message: send.message,
              departure_date: send.dep_date,
              departure_time: send.dep_time,
              arrival_date: send.arr_date,
              arrival_time: send.arr_time,
              arrival_adress: send.arr_adress,
              arrival_postalCode: send.arr_postal,
              arrival_city: send.arr_city,
              remain_seats: send.seats
            })
            .then(ride => {
              if(ride){
                ride.setDeparture(departure)
                .then(departure => {

                  ride.setDriver(driver)
                  .then(driver => {
                    res.json({result:1, message:'Ride successfully created w/ url'});
                  })
                  .catch(err => { res.json({result:-1, message:'Unable to set User to the Ride w/ url 02-010', error:err}); });
                })
                .catch(err => { res.json({result:-1, message:'Unable to set departure w/ url ', error:err}); });
              }
              else res.json({result:0, message:'Ride not created w/ url '});
            })
            .catch(err => { res.json({result:-1, message:'Unable to create Ride w/ url ', error:err}); });
          }
          else res.json({result:0, message:'Departure not found w/ url'});
        })
        .catch(err => { res.json({result:-1, message:'Unable to find Site w/ url ', error:err}); });
      }
      else res.json({result:0, message:'User not found w/ url 02-010'});
    })
    .catch(err => { res.json({result:-1, message:'Unable to find User w/ url 02-010', error:err}); });
  }
  else if(send.dep_site == undefined && send.arr_site != undefined){
    models.User.find({
      where: { id: send.driver }
    })
    .then(driver => {
      if(driver){

        models.Site.find({
          where: { id: send.arr_site }
        })
        .then(arrival => {
          if(arrival){

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
              remain_seats: send.seats
            })
            .then(ride => {
              if(ride){
                ride.setArrival(arrival)
                .then(arrival => {

                  ride.setDriver(driver)
                  .then(driver => {
                    res.json({result:1, message:'Ride successfully created w/ url'});
                  })
                  .catch(err => { res.json({result:-1, message:'Unable to set Driver to the Ride w/ url 02-10', error:err}); });
                })
                .catch(err => { res.json({result:-1, message:'Unable to set departure w/ url ', error:err}); });
              }
              else res.json({result:0, message:'Ride not created w/ url '});
            })
            .catch(err => { res.json({result:-1, message:'Unable to create Ride w/ url ', error:err}); });
          }
          else res.json({result:0, message:'Departure not found w/ url'});
        })
        .catch(err => { res.json({result:-1, message:'Unable to find Site w/ url ', error:err}); });
      }
      else res.json({result:0, message:'User not found w/ url 02-010'});
    })
    .catch(err => { res.json({result:-1, message:'Unable to find User w/ url 02-010', error:err}); });

  }
  else res.json({result:0, message:'Ride informations do not match prerequesits w/ url '});
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
          departure_date: send.dep_date,
          arrival_date: send.arr_date,
        });

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

/** Rate a Ride | */
router.post('/mark',function(req,res,next){
  let send = req.body;

  models.User.find({
    where: { id: send.rated }
  })
  .then(user => {
    if(user){

      if(send.type == 'positive') user.increment('positiveRating');
      else if(send.type == 'negative') user.increment('negativeRating');

      models.Passengers.find({
        where: {
          user_id: send.rater,
          ride_id: send.ride
        }
      })
      .then(elem => {
        if(elem){

          elem.updateAttributes({
            marked: 1
          });
          res.json({result:1, message:'User successfully rated w/ url '});
        }
        else res.json({result:-1, message:'Passenger association not found w/ url ', error:err});
      })
      .catch(err => { res.json({result:-1, message:'Unable to find Passenger association w/ url ', error:err}); });
    }
    else res.json({result:1, message:'User not found w/ url '});
  })
  .catch(err => { res.json({result:-1, message:'Unable to find User w/ url ', error:err}); });

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
