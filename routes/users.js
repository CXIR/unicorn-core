"use strict";

const express = require('express');
const models = require('../models');
const User = models.User;
const router = express.Router();

//TODO: les contrôles de saisie pour les champs qui ne doivent pas être nuls

/**************************GET**************************/

/** Get all active users | 04-001 */
router.get('/all',function(req,res){
  User.findAll({
    include: [ models.Site, models.Status, models.Ride ]
  })
  .then(function(users){
    if(users){
      let results = [];
      for(let user of users){
        results.push(user.responsify());
      }
      res.json(results);
    }
    else res.json({result:0, message:'No users found w/ url 04-001'});
  }).catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-001', error: err}); } );
});

/** Get all active users except whom searching | 04-002 */
router.get('/all/:id',function(req,res){
  User.findAll({
    where:{
            id: {
                  $ne: req.params.id
                }
          },
    include: [ models.Site, models.Status ]
  })
  .then(function(users){
    let results = [];
    for(let user of users){
      results.push(user.responsify());
    }
    res.json(results);
  }).catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-002', error: err}); } );

});

/** Get a single user | 04-003 */
router.get('/:id',function(req,res){
  User.find({
    where:{ id: req.params.id },
    include : [ models.Site, models.Status ]
  })
  .then(user => {
    res.json(user.responsify());
  })
  .catch(err => { res.json({result: -1, message:'User not found w/ url 04-003', error: err}); });
});

/**************************POST**************************/

/** Create a new user | 04-004 */
router.post('/new',function(req,res,next){
  let send = req.body;

  /* 'phoneNumber' and 'description' could be null
  * 'negativeRating' and 'positiveRating' are initialized with 0 by default
  */
  User.create({
    lastname: send.name,
    firstname: send.first,
    birthdate: send.birth,
    mailAdress: send.mail,
    password: send.pass,
    phoneNumber: (send.phone != undefined) ? send.phone : null,
    description: (send.description != undefined) ? send.description : null,
  })
  .then(function(user){
    if(user){
      models.Site.find({
        where: { id: send.site }
      })
      .then(site => {
        user.setSite(site)
        .then(site => { console.log({result:1, message:'Site successfully added to user w/ url 04-004'}); })
        .catch(err => { res.json({ result:-2, message:'Unable to add Site on user w/ url 04-004'}); });
      })
      .catch(err => { res.json({result:-1, message:'Site not found w/ url 04-004'}); });

      models.Status.find({
          where: { id: send.status }
      })
      .then(status => {
        user.setStatus(status)
        .then(status => { console.log({result:1, message:'Status successfully added to user w/ url 04-004'}); })
        .catch(err => { res.json({result:-2, message:'Unable to add status to user w/ url 04-004'}); });
      })
      .catch(err => { res.json({result:-1, message:'Status not found w/ url 04-004'}); });

      res.json(user);
    }
    else res.json({result:0, message:'Unable to create a user w/ url 04-004'});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-004', error: err}); } );
});

/** Update User rating | 04-005 */
router.post('/markup',function(req,res,next){
  let send = req.body;
  let type = req.body.type;

  User.find({
    where:{ id: send.id }
  })
  .then(function(user){
    if(user){
      if(type == 'positive'){
        let markup = user.positiveRating;
        let mark = markup+1;
        user.updateAttributes({
                                positiveRating: mark
                              });
      }
      else if(type == 'negative'){
        let markdown = user.negativeRating;
        let mark = markdown+1;
        user.updateAttributes({
                                negativeRating: mark
                              });
      }
      else res.json({ result: -1, message: 'Unknown rating type w/ url 04-005' });

      res.json({result: 1 });
    }
    else res.json({ result: 0, message: 'User not found w/ url 04-005' });
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-005', error: err}); } );
});

/** Update user Basic Information | 04-006 */
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

      res.json({ result: 1 });
    }
    else res.json({result: 0, message: 'User not found w/ url 04-006 '});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-006', error: err}); });
});

/** Update user Site | 04-007 */
router.post('/edit/site',function(req,res,next){
  let send = req.body;

  models.User.find({
    where : { id: send.user }
  })
  .then(user => {
    models.Site.find({
      where: { id: send.site }
    })
    .then(site => {
      user.setSite(site)
      .then(site => { res.json({ result:1, message:'Site successfully updated w/ url 04-007'}); })
      .catch(err => { res.json({ result:-2, message:'Unable to update Site w/ url 04-007'}); });
    })
    .catch(err => { res.json({ result:-1, message:'Site not found w/ url 04-007'}); });
  })
  .catch(err => { res.json({ result:-1, message:'User not found w/ url 04-007'}); });
});

/** Update user Status | 04-008 */
router.post('/edit/status',function(req,res,next){
  let send = req.body;
  models.User.find({
    where : { id:send.user }
  })
  .then(user => {
    models.Status.find({
      where: { id: send.status }
    })
    .then(status => {
      user.setStatus(status)
      .then(status => { res.json({ result:1, message:'Status successfully updated w/ url 04-007'}); })
      .catch(err => { res.json({ result:-2, message:'Unable to update Status w/ url 04-007'}); });
    })
    .catch(err => { res.json({ result:-1, message:'Status not found w/ url 04-007'}); });
  })
  .catch(err => { res.json({ result:-1, message:'User not found w/ url 04-007'}); });
});

/**************************DELETE**************************/

/** Delete an active user | 04-009 */
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
        res.json({ result: 1 });
      })
      .catch(err => { res.json({result: 0, message:'Unable to destroy user w/ url 04-007', error: err}); } );
    }
    else res.json({result:-1, message:'User not found w/ url 04-007'});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-007', error: err}); });
});


/**************************END**************************/
module.exports = router;
