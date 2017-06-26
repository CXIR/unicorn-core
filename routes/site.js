"use strict";

const express = require('express');
const models = require('../models');
const Site = models.Site;
const router = express.Router();

/**************************GET**************************/

/** Get all sites | 05-001 */
router.get('/',function(req,res){
  Site.findAll().then(function(sites){
    let results = [];
    for(let site of sites){
      results.push(site.responsify());
    }
    res.json(results);
  }).catch(err => { res.json({result:-1, message:'Somthing went wrong w/ url 05-001', error:err}); });

});

/** Get one active site by ID | 05-002 */
router.get('/:id',function(req,res){
  Site.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(site){
    if(site) {
      res.json(site.responsify());
    }
    else res.json({result: 0, message:'No site found w/ url 05-002'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 05-002', error:err}); });
});

/**************************POST**************************/

/** Create a new site | 05-003 */
router.post('/new',function(req,res,next){
  let send = req.body;

  Site.create({
    name: send.name,
    adress: send.adress,
    city: send.city,
    postalCode: send.postal
  })
  .then(function(site){
    if(site){
      res.json(site);
    }
    else res.json({result: 0, message:'Unable to create Site w/ url 05-003'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 05-003', error:err}); });
});

/** Update on site | 05-004 */
router.post('/edit',function(req,res,next){
  let send = req.body;

  Site.find({
    where:{
            id: send.id
          }
  })
  .then(function(site){
    if(site){
      user.updateAttributes({
                              name: send.name,
                              adress: send.adress,
                              city: send.city,
                              postalCode: send.postal
                            });

      res.json({ result: 1 });
    }
    else res.json({ result: 0, message: 'No site found w/ url 05-004' });
  })
  .catch(err => { res.json({result: -1, message:'Something went wrong w/ url 05-004', error: err}); });
});


/**************************DELETE**************************/

/** Delete an active site | 05-005 */
router.delete('/:id',function(req,res,next){
  Status.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(site){
    if(site){
      User.destroy()
      .then(function(site){
        req.json({ result: 1 });
      })
      .catch(err => { res.json({ result:0, message:'Unable to remove site on url 05-005', error:err}); });
    }
    else res.json({result: -1, message:'No site found w/ url 05-005'});
  })
  .catch(err => { res.json({result:-1, message:'Something went wrong w/ url 05-005', error:err}); });
});

/**************************END**************************/
module.exports = router;
