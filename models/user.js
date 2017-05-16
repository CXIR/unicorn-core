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
      type : DataTypes.STRING
    },
    firstname: {
      type : DataTypes.STRING
    },
    birthdate: {
      type : DataTypes.DATE
    },
    mailAdress: {
      type : DataTypes.STRING
    },
    password: {
      type : DataTypes.STRING
    },
    phoneNumber: {
      type : DataTypes.STRING
    },
    description: {
      type : DataTypes.TEXT
    },
    positiveRating: {
      type : DataTypes.INTEGER
    },
    negativeRating: {
      type : DataTypes.INTEGER
    }

  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        User.belongsTo(models.Site);
        User.belongsTo(models.Status);
        User.belongsToMany(models.Ride, {
          through:"User_Ride"
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
