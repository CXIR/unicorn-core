"use strict";

const express = require('express');
const models = require('../models');
const Ride = models.Ride;
const router = express.Router();

/**************************GET**************************/

/** Get all comming rides w/ all users | 02-001 */
router.get('/comming',function(req,res){
  Ride.findAll({
      where: {
                depature_date: {
                                  $gte: Date.now()
                                }
             },
      include : [
                  { model: models.User, as: 'Driver'},
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

  }).catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-001', error: err}); } );
});




/// On pourrait peut-être combiner les 2 routes suivantes en une seule?
/// Attention, pas de requête unique !!

/** Get all single user comming rides as driver | 02-002 */
//TODO: récupérer le driver car plus de foreign key
router.get('/comming/driver/:id',function(req,res){
  let user = req.params.id;

  Ride.findAll({
      where: {
                depature_date: {
                                  $gte: Date.now()
                                },
                driver: user
             },
      include : [
                  { model: models.User, as: 'Driver'},
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
//TODO: récupérer le driver car plus de clé étrangère
router.get('/comming/passenger/:id',function(req,res){
  let user = req.params.id;

  User.find({
    where:{
            id: user
          },
   include : [
               { model: models.User, as: 'Driver'},
               { model: models.User, as: 'Passengers'}
             ]
  })
  .then(function(user){
    let results = [];

    user.getRides({ where: "depature_date < '"+Date.now()+"'" })
    .then(rides => {
      for(let ride of rides){
        results.push(ride.responsify());
      }
      res.json(results);
    })
    .catch(err => { res.json({result:-1, message: 'No ride found on url 02-003'}); });
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-003', error: err}); });
});


/// On pourrait peut-être combiner les 2 routes suivantes en une seule?
/// Attention, pas de requête unique !!

/** Get all single user passed rides as driver | 02-004 */
router.get('/passed/driver/:id',function(req,res){
  let user = req.params.id;

  Ride.findAll({
    where: {
              depature_date: {
                              $lt: Date.now()
                            },
              driver: user
           },
    include : [
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
  let user = req.params.id;

  User.find({
    where:{
            id: user
          }
  })
  .then(function(user){
    let results = [];

    user.getRides({ where: "depature_date >= '"+Date.now()+"'" })
    .then(rides => {
      for(let ride of rides){
        results.push(ride.responsify());
      }
    })
    .catch(err => { res.json({result:-1, message:'Something went wrong w/ user.getRides()', error:err}); });

    res.json(results);
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong with url 02-006', error: err}); });
});

/** Get one ride by ID | 02-007 */
router.get('/:id',function(req,res){
  Ride.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(ride){
    if(ride) {
      let info = ride.responsify();
      let passengers = [];

      ride.getUsers().then(users => {
        for(let user of users){
          passengers.push(user.responsify());
        }
      })
      .catch(err => { res.json({result:-1, message: 'Something went wrong w/ ride.getUsers()', error:err}); });

      res.json({info:info,passengers:passengers});
    }
    else res.json({ result: 0, message:'Ride not found' });
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-007', error: err}); } );

});

/** Get all single user rejected rides as passenger | 02-008 */
router.get('/rejected/:id',function(req,res,next){

  //TODO: Les trajets refusés (pas besoin des passagers [yolo] )

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
    departure_adress: send.dep_adress,
    departure_postalCode: send.dep_postal,
    departure_city: send.dep_city,
    departure_idSite: send.dep_site,
    arrival_date: send.arr_date,
    arrival_adress: send.arr_adress,
    arrival_postalCode: send.arr_postal,
    arrival_city: send.arr_city,
    arrival_idSite: send.arr_site
  })
  .then(ride => { if(ride) res.json(ride); else res.json(0); })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 02-009', error: err}); } );

});

/** Update single active site | 02-011 */
router.post('/edit',function(req,res,next){
  let send = req.body;

  Ride.find({
    where : { id: send.id }
  })
  .then(site => {
      if(site){
        site.updateAttributes({
          ad_date: send.date,
          ad_message: send.message,
          depature_date: send.dep_date,
          departure_adress: send.dep_adress,
          departure_postalCode: send.dep_postal,
          departure_city: send.dep_city,
          departure_idSite: send.dep_site,
          arrival_date: send.arr_date,
          arrival_adress: send.arr_adress,
          arrival_postalCode: send.arr_postal,
          arrival_city: send.arr_city,
          arrival_idSite: send.arr_site
        });
      }
      else res.json({result:0, message:'Site not found w/ url 02-011'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 02-011', error:err}); });
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
      Ride.destroy()
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
