'use strict';
module.exports = function(sequelize, DataTypes) {
  var Passenger_Request = sequelize.define('Passenger_Request', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    requestDate: {
      type : DataTypes.DATE
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Passenger_Request.belongsTo(models.Ride);
        Passenger_Request.belongsTo(models.User);
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.requestDate = this.requestDate;
        if (this.User) {
          result.user = this.User.responsify();
        }
        if (this.Ride) {
          result.ride = this.Ride.responsify();
        }
        return result;
      }
    }
  });
  return Passenger_Request;
};
