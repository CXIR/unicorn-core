"use strict";

const express = require('express');
const models = require('../models');
const Vehicle = models.Vehicle;
const router = express.Router();

/**************************GET**************************/

/** Get all cars | 06-001 */
router.get('/',function(req,res){
  Vehicle.findAll({
    include: [
                {
                  model:models.User,
                  include: [ models.Status, models.Site ]
                }
             ]
  })
  .then(function(vehicles){
    let results = [];

    for(let vehicle of vehicles){
      results.push(vehicle.responsify());
    }

    if(results.length == 0) res.json({result:0, message:'No Vehicle found w/ url 06-001'});
    else res.json({result:1, content:results});
  })
  .catch(err => { res.json({result: -1, message:'Unable to find Vehicle w/ url 06-001', error: err}); } );

});

/** Get a single car by id | 06-002 */
router.get('/:id',function(req,res){
  Vehicle.find({
    where:{
            id: req.params.id
          },
    include: [
                { model:models.User, include: [ models.Site, models.Status ] }
             ]
  })
  .then(function(vehicle){
    if(vehicle) {
      res.json({result:1, content:vehicle.responsify()});
    }
    else res.json({result: 0, message:'No Vehicle found w/ url 06-002'});
  })
  .catch(err => { res.json({result: -1, message:'Unable to find Vehicle w/ url 06-002', error: err}); });
});

/** Get a single car by User | 06-003 */
router.get('/byuser/:id',function(req,res){
  Vehicle.find({
    where:{
            user_id: req.params.id
          },
    include: [
                { model: models.User, include: [ models.Site, models.Status ] }
              ]
  })
  .then(function(vehicle){
    if(vehicle) {
      res.json({result:1, content:vehicle.responsify()});
    }
    else res.json({result: 0, message:'No Vehicle found w/ url 06-003'});
  })
  .catch(err => { res.json({result: -1, message:'Unable to find Vehicle w/ url 06-003', error: err}); });
});

/** Make Vehicle valid | 06-004 */
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
      res.json({result:1, message:'Vehicle successfully validated w/ url 06-004'});
    }
    else res.json({result:0, message:'Vehicle not found w/ url 06-004'});
  })
  .catch(err => { res.json({result:-1, message:'Unable to find Vehicle w/ url 06-004', error:err}) });
});

/** Make Vehicle unvalide | 06-005 */
router.get('/unvalidate/:id',function(req,res,next){
  Vehicle.find({
    where: { id: req.params.id }
  })
  .then(vehicle => {
    if(vehicle){
      vehicle.updateAttributes({
        isVehicleOK: 0
      });
      res.json({result:1, message:'Vehicle successfully unvalidate w/ url 06-005'});
    }
    else res.json({result:0, message:'Vehicle not found w/ url 06-005'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 06-005'}); });
});

/**************************POST**************************/

/** Create a new vehicle | 06-006 */
router.post('/new',function(req,res,next){
  let send = req.body;

  /* 'isVehiculeOK' initialized w/ default value 0 */

  Vehicle.find({
    where: { user_id: send.user}
  })
  .then(vehicle => {
    if(vehicle) res.json({result:0, message:'This user has a car yet w/ url 06-006'});
    else{

      models.User.find({
        where: { id: send.user }
      })
      .then(user => {
        if(user){

          Vehicle.create({
            brand: send.brand,
            model: send.model,
            registrationNumber: send.registration,
            placesNumber: send.seats,
            vehicleType: send.type
          })
          .then(vehicle => {
            if(vehicle){

              vehicle.setUser(user)
              .then(user => {
                res.json({result:1, object:vehicle});
              })
              .catch(err => { res.json({result:-1, message:'Unable to set User to the car w/ url 06-006', error:err}); });
            }
            else res.json({result:0, message:'Vehicle was not created w/ url 06-006'});
          })
          .catch(err => { res.json({result:-1, message:'Unable to create Vehicle w/ url 06-006', error:err}); });
        }
        else res.json({result:0, message:'User not found w/ url 06-006'});
      })
      .catch(err => { res.json({result:-1, message:'Unable to find User w/ url 06-006', error:err}); });
    }
  })
  .catch(err => { res.json({result:-1, message:'Unable to find Vehicle w/ url 06-006', error:err}); });
});

/** Update vehicle | 06-007 */
router.post('/edit',function(req,res,next){
  let send = req.body;

  Vehicle.find({
    where:{
            user_id: send.user
          }
  })
  .then(function(vehicle){
    if(vehicle){
      vehicle.updateAttributes({
                                  brand: send.brand,
                                  model: send.model,
                                  registrationNumber: send.registration,
                                  placesNumber: send.seats,
                                  vehicleType: send.type,
                                  isVehiculeOK: 0
                              });
      res.json({result:1, message:'Vehicle successfully updated w/ url 06-007'});
    }
    else res.json({result:0, message:'Vehicle not found w/ url 06-007'});
  })
  .catch(err => { res.json({result:-1, message:'Unable to find Vehicle w/ url 06-007', error:err}); });
});


/**************************DELETE**************************/

/** Drop a car | 06-008 */
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
        res.json({result:1, message:'Vehicle successfully removed w/ url 06-008'});
      })
      .catch(err => { res.json({result: 0, message:'Unable to remove vehicle w/ url 06-008', error: err}); });
    }
    else res.json({result:0, message:'No vehicle found w/ url 06-008'});
  })
  .catch(err => { res.json({result: -1, message:'Unable to find Vehicle w/ url 06-008', error: err}); });
});


/**************************END**************************/
module.exports = router;
