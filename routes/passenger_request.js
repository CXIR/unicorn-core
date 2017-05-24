"use strict";

const express = require('express');
const models = require('../models');
const Passenger_Request = models.Passenger_Request;
const router = express.Router();

/**************************GET**************************/

/** Get all passenger request by ride */
router.get('/findall/:id',function(req,res){
  Passenger_Request.findAll({
      where: {
                ride_id: req.params.id
             }
  })
  .then(function(requests){
    let results = [];
    for(let req of requests){
      results.push(req.responsify());
    }
    res.json(results);
  }).catch(function(err){
    if(err){
      res.json({ result: 0 });
    }
  });

});


/**************************POST**************************/

/** Create a passenger request */
router.post('/new',function(req,res,next){
  let send = req.body;

  Passenger_Request.create({
    requestDate: new Date(),
    ride_id: send.ride,
    user_id: send.user
  })
  .then(function(request){
    if(request){
      res.json(ride);
    }
    else{
      res.json({ result: 0 });
    }
  })
  .catch(function(err){
    res.json({ result: -1 });
  });

});

/**************************DELETE**************************/

/** Delete a passenger request */
router.delete('/delete/:id',function(req,res,next){
  Passenger_Request.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(request){
    if(request){
      Passenger_Request.destroy()
      .then(function(request){
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
