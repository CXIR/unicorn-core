"use strict";

const express = require('express');
const models = require('../models');
const Site = models.Site;
const router = express.Router();

/**************************GET**************************/

/** Get all sites | 05-001 */
router.get('/',function(req,res){
  Site.findAll()
  .then(sites => {
    let results = [];
    for(let site of sites){
      results.push(site.responsify());
    }

    if(results.length == 0) res.json({result:0, message:'No Site found w/ url 05-001'});
    else res.json({result:1, content:results});

  }).catch(err => { res.json({result:-1, message:'Unable to find Site w/ url 05-001', error:err}); });

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
      res.json({result:1,content:site.responsify()});
    }
    else res.json({result: 0, message:'No site found w/ url 05-002'});
  })
  .catch(err => { res.json({result:-1, message:'Unable to find Site w/ url 05-002', error:err}); });
});

/**************************POST**************************/

/** Create a new site | 05-003 */
router.post('/new',function(req,res,next){
  let send = req.body;

  Site.find({
    where:{ name: send.name }
  })
  .then(site => {
    if(site) res.json({result:0, message:'Similar site w/ same name already exists w/ url 05-003'});
    else{

      Site.create({
        name: send.name,
        adress: send.adress,
        city: send.city,
        postalCode: send.postal
      })
      .then(function(site){
        if(site) res.json({result:1, object:site});
        else res.json({result: 0, message:'Site not created w/ url 05-003'});
      })
      .catch(err => { res.json({result:-1, message:'Unable to create Site w/ url 05-003', error:err}); });
    }
  })
  .catch(err => { res.json({result:-1, message:'Unable to find site w/ url 05-003', error:err}); });


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
      site.updateAttributes({
                              name: send.name,
                              adress: send.adress,
                              city: send.city,
                              postalCode: send.postal
                            });

      res.json({result: 1,  message:'Site successfully updated w/ url 05-004'});
    }
    else res.json({ result: 0, message: 'No site found w/ url 05-004'});
  })
  .catch(err => { res.json({result: -1, message:'Unable to find Site w/ url 05-004', error: err}); });
});


/**************************DELETE**************************/

/** Delete an active site | 05-005 */
router.delete('/:id',function(req,res,next){
  Site.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(site){
    if(site){
      site.destroy()
      .then(function(site){
        res.json({ result: 1, message:'Site successfully removed w/ url '});
      })
      .catch(err => { res.json({ result:0, message:'Unable to remove site on url 05-005', error:err}); });
    }
    else res.json({result: -1, message:'No site found w/ url 05-005'});
  })
  .catch(err => { res.json({result:-1, message:'Unable to find Site w/ url 05-005', error:err}); });
});

/**************************END**************************/
module.exports = router;
