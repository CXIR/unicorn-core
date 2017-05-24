"use strict";

const express = require('express');
const models = require('../models');
const Status = models.Status;
const router = express.Router();

/**************************GET**************************/

/** Get all active status */
router.get('/findall',function(req,res){
  Status.findAll()
  .then(function(status){
    let results = [];
    for(let s of status){
      results.push(s.responsify());
    }
    res.json(results);
  }).catch(err => { res.json({result: -1, error: err}); } );

});

/** Get one active status by ID */
router.get('/find/:id',function(req,res){
  Status.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(status){
    if(status) {
      res.json(status.responsify());
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

/** Create a new status */
router.post('/new',function(req,res,next){
  let send = req.body;

  Status.create({
    label: send.label
  })
  .then(function(status){
    if(status){
      res.json(status);
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

/** Delete an active status */
router.delete('/delete/:id',function(req,res,next){
  Status.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(status){
    if(status){
      User.destroy()
      .then(function(status){
        req.json({ result: 1 });
      })
      .catch(function(err){
        req.json({ result: 0 });
      });
    }
    else{
      res.json({ result: -1 });
    }
  })
  .catch(function(err){
    res.json({ result: -1 });
  });

});



/**************************END**************************/
module.exports = router;
