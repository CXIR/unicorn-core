"use strict";

const express = require('express');
const models = require('../models');
const Report = models.Report;
const router = express.Router();

/**************************GET**************************/

/** Get all reports | 03-001 */
router.get('/',function(req,res,next){
  Report.findAll({
    include:  [
                { model: models.User, as: 'Plaintiff' },
                { model: models.User, as: 'Reported' }
              ]
  })
  .then(function(reports){
    let results = [];
    for(let report of reports){
        results.push(report);
    }
    res.json(results);
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 03-001', error:err}); });
});

/** Get one report by ID | 03-002 */
router.get('/:id',function(req,res){
  Report.find({
    where:{
            id: req.params.id
          },
    include: [
                { model: models.User, as: 'Plaintiff' },
                { model: models.User, as: 'Reported' }
             ]
  })
  .then(function(report){
    if(report) {
      res.json(report.responsify());
    }
    else res.json({result: 0, message:'No report found w/ url 03-002'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 03-002', error:err}); });
});

/**************************POST**************************/

/** Create a new report | 03-003 */
router.post('/new',function(req,res,next){
  let send = req.body;

  Report.create({
    message: send.message
  })
  .then(function(report){
    if(report){
      models.User.find({
        where: { id: send.request }
      })
      .then(function(user){
        if(user){
          report.setPlaintiff(user)
          .then(user => { res.json({ result:1, message:'Plaintiff user successfully added'}); })
          .catch(err => { res.json({result: -2, message:'Unable to set plaintiff w/ url 03-003', error:err}); });
        }
      })
      .catch(err => { res.json({result: -2, message:'User not found for plaintiff w/ url 03-003', error:err}); });

      models.User.find({
        where: { id:send.reported }
      })
      .then(user => {
        if(user){
          report.setReported(user)
          .then(user => { res.json({ result:1, message:'Reported user successfully added'}); })
          .catch(err => { res.json({result: -2, message:'Unabel to set reported w/ url 03-003', error:err}); });
        }
      })
      .catch(err => { res.json({result: -2, message:'User not found for reported w/ url 03-003', error:err}); });

      res.json({ result:1, object:report });
    }
    else res.json({result:0, message:'No report created w/ url 03-003'})
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 03-003', error:err})});
});

/**************************DELETE**************************/

/** Delete a report | 03-004 */
router.delete('/:id',function(req,res,next){
  Report.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(report){
    if(report){
      report.destroy()
      .then(report => {
        res.json({result: 1, object:report});
      })
      .catch(err =>{ res.json({result:-1, message:'Unable to destroy w/ url 03-004'}); });
    }
    else res.json({result:0, message:'No report found w/ url 03-004'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 03-004', error:err}); });
});

/**************************END**************************/
module.exports = router;
