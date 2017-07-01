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
        Report.belongsTo(models.User, {as:'Plaintiff'});
        Report.belongsTo(models.User, {as:'Reported'});
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.message = this.message;
        if(this.Plaintiff){
          result.plaintiff = this.Plaintiff.responsify();
        }
        if(this.Reported){
          result.reported = this.Reported.responsify();
        }
        return result;
      }
    }
  });
  return Report;
};
