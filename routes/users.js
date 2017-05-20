"use strict";

const express = require('express');
const models = require('../models');
const User = models.User;
const router = express.Router();

/**************************GET**************************/

/** Get all active users */
router.get('/user/find/all',function(req,res){
  User.findAll().then(function(users){
    let results = [];
    for(let user of users){
      results.push(User.responsify());
    }
    res.json(results);
  }).catch(function(err){
    if(err){
      res.json({ result: 0 });
    }
  });

});

/** Get one active user by ID */
router.get('user/:id',function(req,res){
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
  .catch(function(err){
      res.json({
                  result: -1
               });
  });

});


/**************************POST**************************/

/** Create a new user */
router.post('user/add',function(req,res,next){
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

/** Delete an active user */
router.post('/user/delete/:id',function(req,res,next){
  User.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(user){
    if(user){
      User.destroy()
      .then(function(user){
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
