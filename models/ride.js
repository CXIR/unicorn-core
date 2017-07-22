'use strict';

module.exports = function(sequelize, DataTypes) {
  var Ride = sequelize.define('Ride', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    ad_date: {
      type : DataTypes.DATE,
      allowNull: false
    },
    ad_message: {
      type : DataTypes.STRING,
      allowNull: true
    },
    departure_date: {
      type : DataTypes.DATE,
      allowNull: false
    },
    departure_time:{
      type: DataTypes.TIME,
      allowNull: false
    },
    departure_adress: {
      type : DataTypes.STRING,
      allowNull: true
    },
    departure_postalCode: {
      type : DataTypes.STRING,
      allowNull: true
    },
    departure_city: {
      type : DataTypes.STRING,
      allowNull: true
    },
    arrival_date: {
      type : DataTypes.DATE,
      allowNull: false
    },
    arrival_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    arrival_adress: {
      type : DataTypes.STRING,
      allowNull: true
    },
    arrival_postalCode: {
      type : DataTypes.STRING,
      allowNull: true
    },
    arrival_city: {
      type : DataTypes.STRING,
      allowNull: true
    },
    remain_seats: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Ride.belongsTo(models.User, { as:'Driver'});
        Ride.belongsToMany(models.User, {
          through: 'Passengers',
          as: 'Passengers'
        });
        Ride.belongsToMany(models.User, {
          through: 'Requests',
          as: 'Requests'
        });

        Ride.belongsTo(models.Site, { as: 'Departure'});
        Ride.belongsTo(models.Site, { as: 'Arrival'});
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.ad_date = this.ad_date;
        result.ad_message = this.ad_message;
        result.departure_date = this.departure_date;
        result.departure_time = this.departure_time;
        result.departure_adress = this.departure_adress;
        result.departure_city = this.departure_city;
        result.departure_postalCode = this.departure_postalCode;
        result.arrival_date = this.arrival_date;
        result.arrival_time = this.arrival_time;
        result.arrival_adress = this.arrival_adress;
        result.arrival_city = this.arrival_city;
        result.arrival_postalCode = this.arrival_postalCode;
        result.remain = this.remain_seats;
        if(this.Driver){
          result.driver = this.Driver.responsify();
        }
        if(this.Departure){
          result.departure = this.Departure.responsify();
        }
        if(this.Arrival){
          result.arrival = this.Arrival.responsify();
        }
        if(this.Passengers){
          result.passengers = this.Passengers;
        }
        if(this.Requests){
          result.requests = this.Requests;
        }
        return result;
      }
    }
  });
  return Ride;
};
