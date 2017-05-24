"use strict";

const express = require('express');
const models = require('../models');
const User = models.User;
const router = express.Router();

/**************************GET**************************/

/** Get all active users */
router.get('/findall',function(req,res){
  User.findAll().then(function(users){
    let results = [];
    for(let user of users){
      results.push(User.responsify());
    }
    res.json(results);
  }).catch(err => { res.json({result: -1, error: err}); } );

});

/** Get one active user by ID */
router.get('/find/:id',function(req,res){
  User.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(user){
    if(user) {
      res.json(user.responsify());
    }
    else res.json({ result: 0 });
  })
  .catch(err => { res.json({result: -1, error: err}); } );

});


/**************************POST**************************/

/** Create a new user */
router.post('/new',function(req,res,next){
  let send = req.body;

  /* 'phoneNumber' and 'description' should be null
  * 'negativeRating' and 'positiveRating' are initialized with 0 by default
  */
  User.create({
    lastname: send.name,
    firstname: send.first,
    birthdate: send.birth,
    mailAdress: send.mail,
    password: send.pass,
    phoneNumber: (send.phone != undefined) ? send.phone : null,
    description: (send.description != undefined) ? send.description : null
  })
  .then(function(user){
    if(user){
      res.json(user);
    }
    else res.json({ result: 0 });

  })
  .catch(err => { res.json({result: -1, error: err}); } );

});

/** Update User 'positiveRating' */
router.post('/modify/markup',function(req,res,next){
  let send = req.body;

  User.find({
    where:{
            id: send.id
          }
  })
  .then(function(user){
    if(user){
      user.updateAttributes({
                              positiveRating: send.markup
                            });

      res.json({ result: 1 });
    }
    else res.json({ result: 0 });
  })
  .catch(err => { res.json({result: -1, error: err}); } );

});

/** Update User 'negativeRating' */
router.post('/modify/markdown',function(req,res,next){
  let send = req.body;

  User.find({
    where:{
            id: send.id
          }
  })
  .then(function(user){
    if(user){
      user.updateAttributes({
                              negativeRating: send.markdown
                            });

      res.json({ result: 1 });
    }
    else res.json({ result: 0 });
  })
  .catch(err => { res.json({result: -1, error: err}); } );

});

/**************************DELETE**************************/

/** Delete an active user */
router.delete('/delete/:id',function(req,res,next){
  User.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(user){
    if(user){
      User.destroy()
      .then(function(user){
        req.json({ result: 1 });
      })
      .catch(err => { res.json({result: 0, error: err}); } );
    }
    else res.json({ result: -1 });
  })
  .catch(err => { res.json({result: -1, error: err}); } );

});


/**************************END**************************/
module.exports = router;
