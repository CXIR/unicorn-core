"use strict";

const express = require('express');
const models = require('../models');
const Site = models.Site;
const router = express.Router();

/**************************GET**************************/

/** Get all site status */
router.get('/findall',function(req,res){
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
router.get('/find/:id',function(req,res){
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


/**************************DELETE**************************/

/** Delete an active site */
router.delete('/delete/:id',function(req,res,next){
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
