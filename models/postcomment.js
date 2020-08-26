'use strict';
module.exports = (sequelize, DataTypes) => {
  var Postcomment = sequelize.define('Postcomment', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
  });

  // create association between user and Postcomment
  // a Postcomment can have many users
  Postcomment.associate = function(models) {
    models.Postcomment.belongsTo(models.User);
    models.Postcomment.belongsTo(models.Post);
  };
  
  return Postcomment;
};
 