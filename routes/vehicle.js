"use strict";

const express = require('express');
const models = require('../models');
const Vehicle = models.Vehicle;
const router = express.Router();

/**************************GET**************************/

/** Get all cars */
router.get('/findall',function(req,res){
  Vehicle.findAll()
  .then(function(vehicles){
    let results = [];
    for(let vehicle of vehicles){
      results.push(vehicle.responsify());
    }
    res.json(results);
  })
  .catch(err => { res.json({result: -1, error: err}); } );

});

/** Get a single car by id */
router.get('/find/:id',function(req,res){
  Vehicle.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(vehicle){
    if(vehicle) {
      res.json(vehicle.responsify());
    }
    else res.json({ result: 0 });
  })
  .catch(err => { res.json({result: -1, error: err}); } );

});

/**************************POST**************************/

/** Create a new vehicle */
router.post('/new',function(req,res,next){
  let send = req.body;

  /* 'isVehiculeOK' initialized w/ default value 0
  */
  Vehicle.create({
    brand: send.brand,
    model: send.model,
    registrationNumber: send.registration,
    placesNumber: send.seats,
    vehicleType: send.type
  })
  .then(function(vehicle){
    if(vehicle){
      res.json(vehicle);
    }
    else res.json({ result: 0 });

  })
  .catch(err => { res.json({result: -1, error: err}); } );

});


/**************************DELETE**************************/

/** Drop a car */
router.delete('/delete/:id',function(req,res,next){
  Vehicle.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(vehicle){
    if(vehicle){
      Vehicle.destroy()
      .then(function(vehicle){
        req.json({ result: 1 });
      })
      .catch(err => { res.json({result: 0, error: err}); } );
    }
    else{
      res.json({ result: -1 });
    }
  })
  .catch(err => { res.json({result: -1, error: err}); } );

});


/**************************END**************************/
module.exports = router;
