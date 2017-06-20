"use strict";

const express = require('express');
const models = require('../models');
const User = models.User;
const router = express.Router();

/**************************GET**************************/

/** Get all active users */
router.get('/all',function(req,res){
  User.findAll()
  .then(function(users){
    let results = [];
    for(let user of users){
      results.push(user.responsify());
    }
    res.json(results);
  }).catch(err => { res.json({result: -1, error: err}); } );

});

/** Get all active users except whom searching */
router.get('/all/:id',function(req,res){
  User.findAll({
    where:{
            id: {
                  $ne: req.params.id
                }
          }
  })
  .then(function(users){
    let results = [];
    for(let user of users){
      results.push(user.responsify());
    }
    res.json(results);
  }).catch(err => { res.json({result: -1, error: err}); } );

});

/** Get one active user by ID */
router.get('/:id',function(req,res){
  User.find({
    where:{
            id: req.params.id
          }
  })
  .then(user => { if(user) res.json(user.responsify()); else res.json(0); })
  .catch(err => { res.json({result: -1, error: err}); });

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
    description: (send.description != undefined) ? send.description : null,
    site_id: send.site,
    status_id: send.status
  })
  .then(function(user){
    if(user){
      res.json(user);
    }
    else res.json({ result: 0 });

  })
  .catch(err => { res.json({result: -1, error: err}); } );

});

/** Update User rating */
router.post('/markup',function(req,res,next){
  let id = req.body;
  let type = req.type;
  
  User.find({
    where:{
            id: id
          }
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
      else res.json({ result: -1, message: 'Unknown rating type' });


      res.json({ result: 1 });
    }
    else res.json({ result: 0, message: 'User not found' });
  })
  .catch(err => { res.json({result: -1, error: err}); } );

});

/** Update User Information */
router.post('/edit',function(req,res,next){
  let send = req.body;

  User.find({
    where:{
            id: send.id
          }
  })
  .then(function(user){
    if(user){
      user.updateAttributes({
                              lastname: send.name,
                              mailAdress: send.mail,
                              phoneNumber: (send.phone != undefined) ? send.phone : null,
                              description: (send.description != undefined) ? send.description : null,
                              site_id: send.site,
                              status_id: send.status
                            });

      res.json({ result: 1 });
    }
    else res.json({ result: 0, message: 'User not found' });
  })
  .catch(err => { res.json({result: -1, error: err}); } );

});

/**************************DELETE**************************/

/** Delete an active user */
router.delete('/:id',function(req,res,next){
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
