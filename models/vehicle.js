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
      type : DataTypes.STRING,
      allowNull: false
    },
    model: {
      type : DataTypes.STRING,
      allowNull: false
    },
    registrationNumber: {
      type : DataTypes.STRING,
      allowNull: false
    },
    placesNumber: {
      type : DataTypes.INTEGER,
      allowNull: false
    },
    vehicleType: {
      type : DataTypes.STRING,
      allowNull: false
    },
    isVehicleOK: {
      type : DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
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
        if(this.User){
          result.driver = this.User.responsify();
        }
        return result;
      }
    }
  });
  return Vehicle;
};
