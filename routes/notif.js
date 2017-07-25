'use strict';

const express = require('express');
const models = require('../models');
const Notif = models.Notif;
const router = express.Router();

/**************************GET**************************/

/** Get all User notifications | 08-001 */
router.get('/:id',function(req,res){
  Notif.findAll({
    where: { user_id: req.params.id }
  })
  .then(notifs => {
    let results = [];

    for(let notif of notifs){
      results.push(notif.responsify());
    }

    if(results.length == 0) res.json({result:0, message:'No Notif found w/ url 08-001'});
    else res.json({result:1, content:results});
  })
  .catch(err => { res.json({result:-1, message:'Unable to find Notif w/ url 08-001', error:err}); });

});

/**************************POST**************************/

/** Create a Notification | 08-002 */
router.post('/new',function(req,res){
  let send = req.body;

  models.User.find({
    where: { id: send.user }
  })
  .then(user => {
    if(user){

      Notif.create({
        type: send.type,
        title: send.title,
        message: send.message
      })
      .then(notif => {
        notif.setUser(user)
        .then(user => {
          res.json({result:1, object:notif});
        })
        .catch(err => { res.json({result:-1,message:'Unable to set User to Notif w/ url 08-002', error:err}); });
      })
      .catch(err => { res.json({result:-1,message:'Unable to create Notif w/ url 08-002', error:err}); });
    }
    else res.json({result:0, messsage:'User not found w/ url 08-002'});
  })
  .catch(err => { res.json({result:-1,message:'Unable to find user w/ url 08-002', error:err}); });

});

/*************************DELETE*************************/

/** Delete a Notification | 08-003 */
router.delete('/:id',function(req,res){
  Notif.find({
    where: { id: req.params.id}
  })
  .then(notif => {
    if(notif){
      notif.destroy()
      .then(notif => {
        res.json({result:1, message:''});
      })
      .catch(err => { res.json({result:-1,message:'Unable to destro Notif w/ url 08-003', error:err}); });
    }
    else res.json({result:0, messsage:'Notif not found w/ url 08-003'});
  })
  .catch(err => { res.json({result:-1,message:'Unable to find Notif w/ url 08-003', error:err}); });

});

/**************************END**************************/
module.exports = router;
