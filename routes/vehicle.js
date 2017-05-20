"use strict";

const express = require('express');
const models = require('../models');
const Vehicle = models.Vehicle;
const router = express.Router();

/**************************GET**************************/

/** Get all cars */
router.get('/vehicles/find/all',function(req,res){
  Vehicle.findAll().then(function(vehicles){
    let results = [];
    for(let vehicle of vehicles){
      results.push(Vehicle.responsify());
    }
    res.json(results);
  }).catch(function(err){
    if(err){
      res.json({ result: 0 });
    }
  });

});

/** Get a single car by id */
router.get('vehicles/:id',function(req,res){
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
  .catch(function(err){
      res.json({
                  result: -1
               });
  });

});

/**************************POST**************************/

/** Create a new vehicle */
router.post('vehicle/add',function(req,res,next){
  let send = req.body;

  /* 'phoneNumber' and 'description' should be null
  * 'negativeRating' and 'positiveRating' are initialized with 0 by default
  */
  Vehicle.create({
    brand: send.brand,
    model: send.model,
    registrationNumber: send.registration,
    placesNumber: send.seats,
    vehicleType: send.type,
    isVehicleOK: 1
  })
  .then(function(vehicle){
    if(vehicle){
      res.json(vehicle);
    }
    else{
      res.json({
                result: 0
              });
    }
  })
  .catch(function(err){
    res.json({
                result: -1
             });
  });

});


/**************************DELETE**************************/

/** Drop a car */
router.post('/vehicles/delete/:id',function(req,res,next){
  Vehicle.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(vehicle){
    if(vehicle){
      Vehicle.destroy()
      .then(function(vehicle){
        req.json({
                    result: 1
                });
      })
      .catch(function(err){
        req.json({
                    result: 0
                });
      });
    }
    else{
      res.json({
                  result: -1
              });
    }
  })
  .catch(function(err){
    res.json({
              result: -1
            });
  });

});


/**************************END**************************/
module.exports = router;
