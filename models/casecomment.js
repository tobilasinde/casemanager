'use strict';
module.exports = (sequelize, DataTypes) => {
  var Casecomment = sequelize.define('Casecomment', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    review: {
      type: DataTypes.REAL,
      allowNull: true,
    },
    document: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  // create association between user and Casecomment
  // a Casecomment can have many users
  Casecomment.associate = function(models) {
    models.Casecomment.belongsTo(models.User);
    models.Casecomment.belongsTo(models.Casemanager);
    models.Casecomment.belongsTo(models.CurrentBusiness);
    models.Casecomment.hasMany(models.commentReview);
  };
  
  return Casecomment;
};
 