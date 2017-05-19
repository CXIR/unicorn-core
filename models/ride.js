'use strict';
module.exports = function(sequelize, DataTypes) {
  var Ride = sequelize.define('Ride', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    ad_date: {
      type : DataTypes.STRING
    },
    ad_message: {
      type : DataTypes.STRING
    },
    depature_date: {
      type : DataTypes.DATE
    },
    departure_adress: {
      type : DataTypes.STRING
    },
    departure_postalCode: {
      type : DataTypes.INTEGER
    },
    departure_city: {
      type : DataTypes.STRING
    },
    departure_idSite: {
      type : DataTypes.INTEGER
    },
    arrival_date: {
      type : DataTypes.DATE
    },
    arrival_adress: {
      type : DataTypes.STRING
    },
    arrival_postalCode: {
      type : DataTypes.INTEGER
    },
    arrival_city: {
      type : DataTypes.STRING
    },
    arrival_idSite: {
      type : DataTypes.INTEGER
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Ride.belongsTo(models.User); //Conducteur : celui qui à créer l'annonce
        Ride.belongsToMany(models.User, {
          through:"User_Ride"
        });
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.ad_date = this.ad_date;
        result.ad_message = this.ad_message;
        result.depature_date = this.depature_date;
        result.departure_adress = this.departure_adress;
        result.departure_city = this.departure_city;
        result.departure_postalCode = this.departure_postalCode;
        result.departure_idSite = this.departure_idSite;
        result.arrival_date = this.arrival_date;
        result.arrival_adress = this.arrival_adress;
        result.arrival_city = this.arrival_city;
        result.arrival_postalCode = this.arrival_postalCode;
        result.arrival_idSite = this.arrival_idSite;
        if (this.User) {
          result.driver = this.User.responsify();
        }
        return result;
      }
    }
  });
  return Ride;
};
