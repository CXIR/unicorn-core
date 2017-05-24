'use strict';
module.exports = function(sequelize, DataTypes) {
  var MSG_ConversationUser = sequelize.define('MSG_ConversationUser', {

      //NONE

  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        MSG_ConversationUser.belongsTo(models.MSG_Conversation); //Numéro Conversation
        MSG_ConversationUser.belongsTo(models.User); //Le participant
        MSG_ConversationUser.belongsTo(models.MSG_Message); // le dernier message qu'il a lu de la conversation
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};

        if (this.MSG_Conversation) {
          result.idConversation = this.MSG_Conversation.responsify();
        }
        if (this.User) {
          result.idUSer = this.User.responsify();
        }
        if (this.MSG_Message) {
          result.idLastMessageRead = this.MSG_Message.responsify();
        }

        return result;
      }
    }
  });
  return MSG_ConversationUser;
};
