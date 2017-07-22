'use strict';

module.exports = function(sequelize, DataTypes) {
  var Notif = sequelize.define('Notif', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    type: {
      type : DataTypes.STRING,
      allowNull: false
    },
    title: {
      type : DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Notif.belongsTo(models.User);
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.type = this.type;
        result.title = this.title;
        result.message = this.message;
        if(this.User){
          result.user = this.User.responsify();
        }
        return result;
      }
    }
  });
  return Notif;
};
