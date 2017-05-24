"use strict";

const express = require('express');
const models = require('../models');
const Ride = models.Ride;
const router = express.Router();

/**************************GET**************************/

/** Get all comming rides */
router.get('/findall/comming',function(req,res){
  Ride.findAll({
      where: {
                depature_date: {
                                  $gte: Date.now()
                                }
             }
  })
  .then(function(rides){
    let results = [];
    for(let ride of rides){
      results.push(ride.responsify());
    }
    res.json(results);
  }).catch(err => { res.json({result: -1, error: err}); } );

});

/** Get all passed rides */
router.get('/findall/passed',function(req,res){
  Ride.findAll({
    where: {
              depature_date: {
                              $lt: Date.now()
                             }
           }
  })
  .then(function(rides){
    let results = [];
    for(let ride of rides){
      results.push(ride.responsify());
    }
    res.json(results);
  }).catch(err => { res.json({result: -1, error: err}); } );

});

/** Get one ride by ID */
router.get('/find/:id',function(req,res){
  Ride.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(ride){
    if(ride) {
      res.json(ride.responsify());
    }
    else res.json({ result: 0 });
  })
  .catch(err => { res.json({result: -1, error: err}); } );

});

/**************************POST**************************/

/** Create a new ride */
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
  .catch(err => { res.json({result: -1, error: err}); } );

});

/**************************DELETE**************************/

/** Delete an active status */
router.delete('/delete/:id',function(req,res,next){
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
  .catch(err => { res.json({result: -1, error: err}); } );

});

/**************************END**************************/
module.exports = router;
