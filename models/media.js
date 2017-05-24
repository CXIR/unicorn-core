'use strict';
module.exports = function(sequelize, DataTypes) {
  var Media = sequelize.define('Media', {
    id: {
      type : DataTypes.BIGINT,
      primaryKey : true,
      autoIncrement : true,
    },
    fileName: {
      type : DataTypes.STRING
    },
    filePath: {
      type : DataTypes.STRING
    }
  }, {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Media.belongsTo(models.User);
      }
    },
    instanceMethods: {
      responsify: function() {
        let result = {};
        result.id = this.id;
        result.fileName = this.fileName;
        result.filePath = this.filePath;
        if(this.User){
          result.user = this.User.responsify();
        }
        return result;
      }
    }
  });
  return Media;
};
