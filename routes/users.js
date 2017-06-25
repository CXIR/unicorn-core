"use strict";

const express = require('express');
const models = require('../models');
const User = models.User;
const router = express.Router();

/**************************GET**************************/

/** Get all active users | 04-001 */
router.get('/all',function(req,res){
  User.findAll()
  .then(function(users){
    let results = [];
    for(let user of users){
      results.push(user.responsify());
    }
    res.json(results);
  }).catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-001', error: err}); } );
});

/** Get all active users except whom searching | 04-002 */
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
  }).catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-002', error: err}); } );

});

/** Get one active user by ID | 04-003 */
router.get('/:id',function(req,res){
  User.find({
    where:{
            id: req.params.id
          }
  })
  .then(user => {
    //TODO; vérifier que l'utilisation d'une lamba est fonctionnel ici
    if(user) res.json(user.responsify());
    else res.json({result:0,message:'No user found w/ url 04-003'});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-003', error: err}); });
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
    site_id: send.site,
    status_id: send.status
  })
  .then(function(user){
    if(user){
      res.json(user);
    }
    else res.json({result:0, message:'Unable to create a user w/ url 04-004'});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-004', error: err}); } );
});

/** Update User rating | 04-005 */
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
      else res.json({ result: -1, message: 'Unknown rating type w/ url 04-005' });

      res.json({result: 1 });
    }
    else res.json({ result: 0, message: 'User not found w/ url 04-005' });
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-005' error: err}); } );
});

/** Update User Information | 04-006 */
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
    else res.json({result: 0, message: 'User not found w/ url 04-006 '});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-006', error: err}); });
});

/**************************DELETE**************************/

/** Delete an active user | 04-007 */
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
      .catch(err => { res.json({result: 0, message:'Unable to destroy user w/ url 04-007', error: err}); } );
    }
    else res.json({result:-1, message:'User not found w/ url 04-007'});
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 04-007', error: err}); });
});


/**************************END**************************/
module.exports = router;
