"use strict";

const express = require('express');
const models = require('../models');
const Status = models.Status;
const router = express.Router();

/**************************GET**************************/

/** Get all active status | 07-001 */
router.get('/',function(req,res){
  Status.findAll()
  .then(function(status){
    let results = [];
    for(let s of status){
      results.push(s.responsify());
    }
    res.json(results);
  }).catch(err => { res.json({result: -1, error: err}); } );

});

/** Get one active status by ID | 07-002 */
router.get('/:id',function(req,res){
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

/** Create a new status | 07-003 */
router.post('/new',function(req,res,next){
  let send = req.body;

  Status.create({
    label: send.label
  })
  .then(site => {
    if(site){
      res.json(site);
    }
    else res.json({result: 0, message:'Unable to create Status w/ url 07-003'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 07-003', error:err}); });
});

/** Update on status | 07-004 */
router.post('/edit',function(req,res,next){
  let send = req.body;

  Status.find({
    where:{
            id: send.id
          }
  })
  .then(status => {
    if(status){
      status.updateAttributes({ label: send.label });
      res.json({ result: 1 });
    }
    else res.json({ result: 0, message: 'No status found w/ url 07-004' });
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 07-004', error: err}); });
});


/**************************DELETE**************************/

/** Delete an active status | 07-005 */
router.delete('/:id',function(req,res,next){
  Status.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(status){
    if(status){
      status.destroy()
      .then(function(status){
        res.json({ result: 1 });
      })
      .catch(err => { res.json({ result:0, message:'Unable to remove status on url 07-005', error:err}); });
    }
    else res.json({result: -1, message:'No status found w/ url 07-005'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 07-005', error:err}); });
});



/**************************END**************************/
module.exports = router;
