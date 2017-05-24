"use strict";

const express = require('express');
const models = require('../models');
const Report = models.Report;
const router = express.Router();

/**************************GET**************************/

/** Get all reports */
router.get('/findall',function(req,res){
  Report.findAll().then(function(sites){
    let results = [];
    for(let report of reports){
      results.push(report.responsify());
    }
    res.json(results);
  }).catch(function(err){
    if(err){
      res.json({ result: 0 });
    }
  });

});

/** Get one report by ID */
router.get('/find/:id',function(req,res){
  Report.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(report){
    if(report) {
      res.json(site.responsify());
    }
    else res.json({ result: 0 });
  })
  .catch(function(err){
      res.json({ result: -1 });
  });

});

/**************************POST**************************/

/** Create a new site */
router.post('/new',function(req,res,next){
  let send = req.body;

  Report.create({
    message: send.message,
    idUser_request: send.request,
    idUser_reported: send.reported
  })
  .then(function(site){
    if(site){
      res.json(site);
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

/** Delete an active site */
router.delete('/delete/:id',function(req,res,next){
  Report.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(report){
    if(report){
      Report.destroy()
      .then(function(site){
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
