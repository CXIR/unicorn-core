'use strict';
module.exports = function(sequelize, DataTypes) {
  var Passenger_Request = sequelize.define('Passenger_Request', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    requestDate: {
      type : DataTypes.DATE,
      allowNull: false
    },
    acceptedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refusedDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Passenger_Request.belongsTo(models.User);
        Passenger_Request.belongsToMany(models.Ride,{
          through: 'Asks'
        });
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.requestDate = this.requestDate;
        result.acceptedDate = this.acceptedDate;
        result.refusedDate = this.refusedDate;
        if (this.User) {
          result.user = this.User.responsify();
        }
        return result;
      }
    }
  });
  return Passenger_Request;
};