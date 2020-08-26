'use strict';
module.exports = (sequelize, DataTypes) => {
  var commentReview = sequelize.define('commentReview', {
    review: {
        type: DataTypes.REAL,
        allowNull: false,
    }
  });

  // create association between user and commentReview
  // a commentReview can have many users
  commentReview.associate = function(models) {
    models.commentReview.belongsTo(models.Casecomment);
  };
  
  return commentReview;
};
 