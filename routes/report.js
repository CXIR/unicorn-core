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
                {
                  model: models.User,
                  as: 'Plaintiff',
                  include: [ models.Site, models.Status ]
                },
                {
                  model: models.User,
                  as: 'Reported',
                  include: [ models.Site, models.Status ]
                }
              ]
  })
  .then(function(reports){
    let results = [];
    for(let report of reports){
        results.push(report);
    }
    if(results.length == 0) res.json({result:0, message:'No report found w/ url 03-001'});
    else res.json({result:1, content:results});
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
                {
                  model: models.User,
                  as: 'Plaintiff',
                  include: [ models.Site, models.Status ]
                 },
                {
                  model: models.User,
                  as: 'Reported',
                  include: [ models.Site, models.Status ]
                }
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
  .then(report => {

    models.User.find({
      where: { id: send.request }
    })
    .then(request => {

      report.setPlaintiff(request)
      .then(plaintiff => {

        models.User.find({
          where: { id: send.reported }
        })
        .then(reported => {

          report.setReported(reported)
          .then(reported => {
            res.json({result: 1, message:'Report successfully created w/ url '});
          })
          .catch(err => { })
        })
        .catch(err => { });
      })
      .catch(err => { });
    })
    .catch(err => { });
  })
  .catch(err => { });

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
