'use strict';

module.exports = function(sequelize, DataTypes) {
  var Passengers = sequelize.define('Passengers', {
    marked: {
      type : DataTypes.BOOLEAN
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {

      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.marked = this.marked;
        return result;
      }
    }
  });
  return Passengers;
};
