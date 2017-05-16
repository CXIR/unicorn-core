'use strict';
module.exports = function(sequelize, DataTypes) {
  var Status = sequelize.define('Status', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    label: {
      type : DataTypes.STRING
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
        result.label = this.label;
        return result;
      }
    }
  });
  return Status;
};
