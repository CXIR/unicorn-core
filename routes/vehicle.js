"use strict";

const express = require('express');
const models = require('../models');
const Vehicle = models.Vehicle;
const router = express.Router();

/**************************GET**************************/

/** Get all cars | 06-001 */
router.get('/',function(req,res){
  Vehicle.findAll({
    include: [ models.User ]
  })
  .then(function(vehicles){
    let results = [];
    for(let vehicle of vehicles){
      results.push(vehicle.responsify());
    }
    res.json(results);
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 06-001', error: err}); } );

});

/** Get a single car by id | 06-002 */
router.get('/:id',function(req,res){
  Vehicle.find({
    where:{
            id: req.params.id
          },
    include: [ models.User ]
  })
  .then(function(vehicle){
    if(vehicle) {
      res.json(vehicle.responsify());
    }
    else res.json({result: 0, message:'No vehicle found w/ url 06-002'});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 06-002', error: err}); });
});

/** Make Vehicle valid | 06-003 */
router.get('/validate/:id',function(req,res,next){
  let vehicle = req.params.id;

  Vehicle.find({
    where:{
            id: vehicle
          }
  })
  .then(function(vehicle){
    if(vehicle){
      vehicle.updateAttributes({
                                  isVehicleOK: 1
                              });
      res.json({result:1});
    }
    else res.json({result:0, message:'Vehicle not found w/ url 06-003'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 06-003', error:err}) });
});

/**************************POST**************************/

/** Create a new vehicle | 06-004 */
router.post('/new',function(req,res,next){
  let send = req.body;

  /* 'isVehiculeOK' initialized w/ default value 0 */

  Vehicle.create({
    brand: send.brand,
    model: send.model,
    registrationNumber: send.registration,
    placesNumber: send.seats,
    vehicleType: send.type
  })
  .then(function(vehicle){
    if(vehicle){
      models.User.find({
        where: { id: send.user }
      })
      .then(user => {
        vehicle.setUser(user)
        .then(user => { console.log('User succesfully added to the car w/ url 06-004'); })
        .catch(err => { res.json({result:-2, message:'Unable to add user to the car w/ url 06-004', error:err}); });
      })
      .catch(err => { res.json({result:-2, message:'User not found w/ url 06-004', error:err}); });
      res.json(vehicle);
    }
    else res.json({result: 0, message:'Unable to create vehicle w/ url 06-004'});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 06-004', error: err}); });
});

/** Update vehicle | 06-005 */
router.post('/edit',function(req,res,next){
  let send = req.body;

  Vehicle.find({
    where:{
            id: send.id
          }
  })
  .then(function(vehicle){
    if(vehicle){
      vehicle.updateAttributes({
                                  brand: send.brand,
                                  model: send.model,
                                  registrationNumber: send.registration,
                                  placesNumber: send.seats,
                                  vehicleType: send.type
                              });
      res.json({result:1});
    }
    else res.json({result:0, message:'Vehicle not found w/ url 06-005'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 06-005', error:err}) });
});


/**************************DELETE**************************/

/** Drop a car | 06-006 */
router.delete('/:id',function(req,res,next){
  Vehicle.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(vehicle){
    if(vehicle){
      vehicle.destroy()
      .then(function(vehicle){
        res.json({ result: 1 });
      })
      .catch(err => { res.json({result: 0, message:'Unable to remove vehicle w/ url 06-006', error: err}); });
    }
    else res.json({result:0, message:'No vehicle found w/ url 06-006'});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 06-006', error: err}); } );
});


/**************************END**************************/
module.exports = router;
