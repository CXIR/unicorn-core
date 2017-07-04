"use strict";

const express = require('express');
const models = require('../models');
const Media = models.Media;
const router = express.Router();

/**************************GET**************************/



/**************************POST**************************/

/** Create a passenger request */
router.post('/new',function(req,res,next){
  let send = req.body;

  Media.create({
    fileName: send.name,
    filePath: send.path,
    user_id: send.user
  })
  .then(function(media){
    if(media){
      res.json(media);
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

/** Delete a media */
router.delete('/delete/:id',function(req,res,next){
  Media.find({
    where:{
            id: req.params.id
          }
  })
  .then(function(media){
    if(media){
      Media.destroy()
      .then(function(media){
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
