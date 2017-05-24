"use strict";

const express = require('express');
const models = require('../models');
const Message = models.MSG_Message;
const Conversation = models.MSG_Conversation;
const UserConversation = models.MSG_ConversationUser;
const router = express.Router();

/**************************GET**************************/

/** Get all messages from conversation */
router.get('/findall/:id',function(req,res){
  MSG_Conversation.findAll({
    where:{
        id: req.params.id
    }
  })
  .then(function(sites){
    let results = [];
    for(let conv of conversations){
      results.push(message.responsify());
    }
    res.json(results);
  }).catch(function(err){
    if(err){
      res.json({ result: 0 });
    }
  });

});

/**************************POST**************************/



/**************************DELETE**************************/



/**************************END**************************/
module.exports = router;
