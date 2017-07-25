"use strict";

const express = require('express');
const models = require('../models');
const User = models.User;
const router = express.Router();
const Base64 = require('js-base64').Base64;

/**************************GET**************************/

/** Get all active users | 04-001 */
router.get('/all',function(req,res){
  User.findAll({
    where:{
            id: {
                  $ne: 0
                }
          },
          include : [
                      { model: models.Site },
                      { model: models.Status },
                      { model: models.Ride, as: 'Passengers' }
                    ]
  })
  .then(users => {
    let results = [];

    for(let user of users){
      results.push(user.responsify());
    }

    if(results.length == 0) res.json({result:0, message:'No User found w/ url 04-001'});
    else res.json({result:1, content:results});
  }).catch(err => { res.json({result: -1, message:'Unable to find User w/ url 04-001', error: err}); });
});

/** Get all active users except whom searching | 04-002 */
router.get('/all/:id',function(req,res){
  User.findAll({
    where:{
            id: {
                  $ne: req.params.id
                }
          },
          include : [
                      { model: models.Site },
                      { model: models.Status },
                      { model: models.Ride, as: 'Passengers' }
                    ]
  })
  .then(users => {
    let results = [];

    for(let user of users){
      results.push(user.responsify());
    }

    if(results.length == 0) res.json({result:0, message:'No User found w/ url 04-002'});
    else res.json({result:1, content:results});
  }).catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-002', error: err}); });

});

/** Get a single user | 04-003 */
router.get('/:id',function(req,res){

    User.find({
      where:{ id: req.params.id },
      include : [
                  { model: models.Site },
                  { model: models.Status },
                  { model: models.Ride, as: 'Passengers' }
                ]
    })
    .then(user => {
      if(user) res.json({result:1, content:user.responsify()});
      else res.json({result:0, message:'User not found w/ url 04-003'});
    })
    .catch(err => { res.json({result: -1, message:'Unable to find User w/ url 04-003', error: err}); });
});

/** Get a single User by mail | 04-004 */
router.get('/mail/:mailAdress',function(req,res){
    User.find({
      where:{ mailAdress: req.params.mailAdress },
      include : [ models.Site, models.Status, models.Ride ]
    })
    .then(user => {
      if(user) res.json({result:1, content:user.responsify()});
      else res.json({result:0, message:'User not found w/ url 04-004'});
    })
    .catch(err => { res.json({result: -1, message:'Unable to find User w/ url 04-004', error: err}); });
});

/**************************POST**************************/

/** Create a new user | 04-005 */
router.post('/new',function(req,res,next){
  let send = req.body;

  /* 'phoneNumber' and 'description' could be null
  * 'negativeRating' and 'positiveRating' are initialized with 0 by default
  */

  User.find({
    where: { mailAdress: send.mail }
  })
  .then(user => {
    if(user) res.json({result:0, message:'Similar User w/ same mail already exists w/ url 04-005'});
    else{

      models.Site.find({
        where: { id: send.site }
      })
      .then(site => {
        if(site){

          models.Status.find({
            where: { id: send.status }
          })
          .then(status => {
            if(status){

              User.create({
                lastname: send.name,
                firstname: send.first,
                birthdate: send.birth,
                mailAdress: send.mail,
                password: Base64.encode(send.name),
                phoneNumber: (send.phone != undefined) ? send.phone : null,
                description: (send.description != undefined) ? send.description : null,
              })
              .then(user => {
                if(user){

                  user.setSite(site)
                  .then(site => {

                    user.setStatus(status)
                    .then(status => {

                      res.json({result:1, object:user});
                    })
                    .catch(err => { res.json({result:-1, message:'Unable to set status to user w/ url 04-005', error:err}); });
                  })
                  .catch(err => { res.json({ result:-1, message:'Unable to set Site on user w/ url 04-005', error:err}); });
                }
                else res.json({result:0, message:'User not created w/ url 04-005'});
              })
              .catch(err => { res.json({result:-1, message:'Unable to create user w/ url 04-005', error:err}); });
            }
            else res.json({result:0, message:'Status not found w/ url 04-005'});
          })
          .catch(err => { res.json({result:-1, message:'Unable to find Status w/ url 04-005', error:err}); });
        }
        else res.json({result:0, message:'Site not found w/ url 04-005'});
      })
      .catch(err => { res.json({result:-1, message:'Unable to find Site w/ url 04-005', error:err}); });
    }
  })
  .catch(err => { res.json({result:-1, message:'Unable to find User w/ url 04-005', error:err}); });
});

/** Update User rating | 04-006 */
router.post('/markup',function(req,res,next){
  let send = req.body;
  let type = req.body.type;

  User.find({
    where:{ id: send.id }
  })
  .then(function(user){
    if(user){
      if(type == 'positive'){
        user.increment('positiveRating');
        res.json({result:1, message:'User mark up successfully incremented w/ url 04-006'});
      }
      else if(type == 'negative'){
        user.increment('negativeRating');
        res.json({result:1, message:'User mark down successfully incremented w/ url 04-006'});
      }
      else res.json({result:0, message:'Unknown rating type w/ url 04-006'});
    }
    else res.json({result:0, message:'User not found w/ url 04-006'});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-006', error: err}); });
});

/** Update user Basic Information | 04-007 */
router.post('/edit',function(req,res,next){
  let send = req.body;

  User.find({
    where:{ id: send.id }
  })
  .then(function(user){
    if(user){
      user.updateAttributes({
                              lastname: send.name,
                              firstname: send.first,
                              mailAdress: send.mail,
                              phoneNumber: (send.phone != undefined) ? send.phone : null,
                              description: (send.description != undefined) ? send.description : null
                            });

      res.json({result:1, message:'User basic information successfully update w/ url 04-007'});
    }
    else res.json({result: 0, message:'User not found w/ url 04-007'});
  })
  .catch(err => { res.json({result: -1, message:'Unable to find User w/ url 04-007', error: err}); });
});

/** Update user Site | 04-008 */
router.post('/edit/site',function(req,res,next){
  let send = req.body;

  models.User.find({
    where : { id: send.user }
  })
  .then(user => {
    if(user){

      models.Site.find({
        where: { id: send.site }
      })
      .then(site => {
        if(site){

          user.setSite(site)
          .then(site => {
            res.json({result:1, message:'Site successfully updated w/ url 04-008'});
          })
          .catch(err => { res.json({ result:-1, message:'Unable to update Site w/ url 04-008'}); });
        }
        else res.json({result:0, message:'Site not found w/ url 04-008'});
    })
    .catch(err => { res.json({ result:-1, message:'Unable to find site w/ url 04-008'}); });
    }
    else res.json({result:0, message:'User not found w/ url 04-008'});
  })
  .catch(err => { res.json({ result:-1, message:'Unable to find user w/ url 04-008'}); });
});

/** Update user Status | 04-008 */
router.post('/edit/status',function(req,res,next){
  let send = req.body;

  models.User.find({
    where : { id:send.user }
  })
  .then(user => {
    if(user){
      models.Status.find({
        where: { id: send.status }
      })
      .then(status => {
        if(status){
          user.setStatus(status)
          .then(status => {
            res.json({ result:1, message:'Status successfully updated w/ url 04-008'});
          })
          .catch(err => { res.json({ result:-2, message:'Unable to update Status w/ url 04-008'}); });
        }
        else res.json({result:0, message:'Status not found w/ url 04-008'});
      })
      .catch(err => { res.json({ result:-1, message:'Status not found w/ url 04-008'}); });
    }
    else res.json({result:0, message:'User not found w/ url 04-008'});
  })
  .catch(err => { res.json({ result:-1, message:'User not found w/ url 04-008'}); });
});

/** Update User Description | 04-009 */
router.post('/edit/description',function(req,res,next){
  let send = req.body;

  User.find({
    where: { id: send.user }
  })
  .then(user => {
    user.updateAttributes({
      description: send.description
    });

    res.json({result:1, message:'User description successfully updated w/ url 04-009'});
  })
  .catch(err => { res.json({result:-1, message:'Unable to find User w/ url 04-009'}); });
});

/** Update User Password | 04-010 */
router.post('/edit/password',function(req,res,next){
  let send = req.body;

  User.find({
    where: { id: send.user }
  })
  .then(user => {
    user.updateAttributes({
      password: send.password
    });
    res.json({result:1, message:'User password successfully updated w/ url 04-010'});
  })
  .catch(err => { res.json({result:-1, message:'Unable to find User w/ url 04-010'}); });
});


/** Get User by Mail | 04-011 */
router.post('/mail',function(req,res,next){
  let send = req.body;

  User.find({
    where: { mailAdress: send.mail }
  })
  .then(user => {
    if(user) res.json({result:1, content:user});
    else res.json({result:0, message:'User not found w/ url 04-011'});
  })
  .catch(err => { res.json({result:-1, message:'Unable to find User w/ url 04-011', error:err}); });
});

/**************************DELETE**************************/

/** Delete an active user | 04-012 */
router.delete('/:id',function(req,res,next){
  User.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(user){
    if(user){
      user.destroy()
      .then(function(user){
        res.json({result:1, message:'User successfully removed w/ url 04-012'});
      })
      .catch(err => { res.json({result: 0, message:'Unable to destroy user w/ url 04-012', error: err}); } );
    }
    else res.json({result:-1, message:'User not found w/ url 04-012'});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-012', error: err}); });
});


/**************************END**************************/
module.exports = router;
