'use strict';

/* Vehicle : représente un véhicule appartenant à un utilisateur*/

module.exports = function(sequelize, DataTypes) {
  var Vehicle = sequelize.define('Vehicle', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    brand: {
      type : DataTypes.STRING
    },
    model: {
      type : DataTypes.STRING
    },
    registrationNumber: {
      type : DataTypes.STRING
    },
    placesNumber: {
      type : DataTypes.INTEGER
    },
    vehicleType: {
      type : DataTypes.STRING
    },
    isVehicleOK: {
      type : DataTypes.BOOLEAN
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Vehicle.belongsTo(models.User);
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.brand = this.brand;
        result.model = this.model;
        result.registrationNumber = this.registrationNumber;
        result.placesNumber = this.placesNumber;
        result.vehicleType = this.vehicleType;
        result.isVehicleOK = this.isVehicleOK;
        if (this.User) {
          result.user = this.User.responsify();
        }
        return result;
      }
    }
  });
  return Vehicle;
};
