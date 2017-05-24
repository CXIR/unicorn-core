'use strict';

/*REPORT : signalement utilisateur*/

module.exports = function(sequelize, DataTypes) {
  var Report = sequelize.define('Report', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    message: {
      type : DataTypes.TEXT
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Report.belongsTo(models.User, {
            foreignKey: 'idUser_request' //celui qui a fait le signalement
        });
        Report.belongsTo(models.User, {
            foreignKey: 'idUser_reported' // celui qui est signalé
        });
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.label = this.label;
        //TODO : affichage pretty
        result.idUser_request = this.idUser_request;
        result.idUser_reported = this.idUser_reported;
        return result;
      }
    }
  });
  return Report;
};
