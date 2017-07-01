'use strict';


module.exports = function(sequelize, DataTypes) {
  var Site = sequelize.define('Site', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    name: {
      type : DataTypes.STRING
    },
    adress: {
      type : DataTypes.STRING
    },
    city: {
      type : DataTypes.STRING
    },
    postalCode: {
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
        result.name = this.name;
        result.adress = this.adress;
        result.city = this.city;
        result.postalCode = this.postalCode;
        return result;
      }
    }
  });
  return Site;
};
