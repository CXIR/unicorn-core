"use strict";

const express = require('express');
const models = require('../models');
const Site = models.Site;
const router = express.Router();

/**************************GET**************************/

/** Get all sites */
router.get('/',function(req,res){
  Site.findAll().then(function(sites){
    let results = [];
    for(let site of sites){
      results.push(site.responsify());
    }
    res.json(results);
  }).catch(function(err){
    if(err){
      res.json({ result: 0 });
    }
  });

});

/** Get one active site by ID */
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

  Status.create({
    name: send.name,
    adress: send.adress,
    city: send.city,
    postalCode: send.postal
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

/** Update on site */
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
    else res.json({ result: 0, message: 'Something went wrong when updating this site' });
  })
  .catch(err => { res.json({result: -1, message:'Site not found', error: err}); });
});


/**************************DELETE**************************/

/** Delete an active site */
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
      .catch(err => { res.json({ result:0, message:'Site not removed', error:err}); });
    }
    else{
      res.json({ result: -1 });
    }
  })
  .catch(err => { res.json({result:-1, message:'Site not found', error:err}); });

});

/**************************END**************************/
module.exports = router;
