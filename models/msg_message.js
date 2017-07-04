'use strict';
module.exports = function(sequelize, DataTypes) {
  var MSG_Message = sequelize.define('MSG_Message', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    message: {
      type : DataTypes.STRING
    },
    sendDate: {
      type : DataTypes.DATE
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        MSG_Message.belongsTo(models.User); //Expéditeur
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.message = this.message;
        result.sendDate = this.sendDate;
        if (this.User) {
          result.sender = this.User.responsify();
        }
        return result;
      }
    }
  });
  return MSG_Message;
};
