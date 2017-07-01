'use strict';

/* USER : represente un utilisateur, quelque soit son statut (ADMIN/PASSAGER/DRIVER)*/

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    lastname: {
      type : DataTypes.STRING,
      allowNull: false
    },
    firstname: {
      type : DataTypes.STRING,
      allowNull: false
    },
    birthdate: {
      type : DataTypes.DATE,
      allowNull: false
    },
    mailAdress: {
      type : DataTypes.STRING,
      allowNull: false
    },
    password: {
      type : DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type : DataTypes.STRING,
      allowNull: true
    },
    description: {
      type : DataTypes.TEXT,
      allowNull: true
    },
    positiveRating: {
      type : DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    negativeRating: {
      type : DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }

  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        User.belongsTo(models.Site);
        User.belongsTo(models.Status);
        //User.belongsTo(models.Ride);
        User.belongsToMany(models.Ride, {
          through:"Passengers"
        });
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.lastname = this.lastname;
        result.firstname = this.firstname;
        result.birthdate = this.birthdate;
        result.mailAdress = this.mailAdress;
        result.phoneNumber = this.phoneNumber;
        result.description = this.description;
        result.positiveRating = this.positiveRating;
        result.negativeRating = this.negativeRating;
        result.password = this.password;
        if (this.Site) {
          result.site = this.Site.responsify();
        }
        if (this.Status) {
          result.status = this.Status.responsify();
        }
        return result;
      }
    }
  });
  return User;
};
