'use strict';
module.exports = function(sequelize, DataTypes) {
  var MSG_Conversation = sequelize.define('MSG_Conversation', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    name: {
      type : DataTypes.STRING
    },
    startDate: {
      type : DataTypes.DATE
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        //none
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.name = this.name;
        return result;
      }
    }
  });
  return MSG_Conversation;
};
