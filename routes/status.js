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

    if(results.length == 0) res.json({result:0, message:'No Status found w/ url 07-001'});
    else res.json({result:1, content:results});
  }).catch(err => { res.json({result: -1, message:'Unable to find Status w/ url 07-001', error: err}); });

});

/** Get one active status by ID | 07-002 */
router.get('/:id',function(req,res){
  Status.find({
    where:{
            id: req.params.id
          }
  })
  .then(status => {
    if(status) res.json({result:1, content:status.responsify()});
    else res.json({ result: 0, message:'Status not found w/ url 07-002'});
  })
  .catch(err => { res.json({result: -1, message:'Unable to find Status w/ url 07-002'});
  });

});

/**************************POST**************************/

/** Create a new status | 07-003 */
router.post('/new',function(req,res,next){
  let send = req.body;

  Status.find({
    where: { label: send.label }
  })
  .then(status => {
    if(status) res.json({result:0, message:'Similar Status w/ same name already exists w/ url 07-003'});
    else{

      Status.create({
        label: send.label
      })
      .then(status => {
        if(status) res.json({result:1, object:status});
        else res.json({result: 0, message:'Status not created w/ url 07-003'});
      })
      .catch(err => { res.json({result:-1, message:'Unable to create Status w/ url 07-003', error:err}); });
    }
  })
  .catch(err => {  res.json({result:-1, message:'Unable to find Status w/ url 07-003', error:err}); });

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
      res.json({result: 1, message:'Status successfully updated w/ url 07-004'});
    }
    else res.json({result: 0, message:'Status not found w/ url 07-004'});
  })
  .catch(err => { res.json({result: -1, message:'Unable to find Status w/ url 07-004', error: err}); });
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
        res.json({result: 1, message:'Status successfully removed w/ url '});
      })
      .catch(err => { res.json({ result:0, message:'Unable to remove Status on url 07-005', error:err}); });
    }
    else res.json({result: -1, message:'Status not found w/ url 07-005'});
  })
  .catch(err => { res.json({result:-1, message:'Unable to find Status w/ url 07-005', error:err}); });
});



/**************************END**************************/
module.exports = router;
