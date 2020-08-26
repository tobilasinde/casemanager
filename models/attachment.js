'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  
  // create post association
  // a post will have a user
  // a field called UserId will be created in our post table inside the db
  Post.associate = function (models) {
    
    models.Post.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
    
    models.Post.belongsTo(models.CurrentBusiness, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });

    models.Post.belongsTo(models.Casemanager, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: true
      }
    });

    models.Post.belongsTo(models.Comment, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: true
      }
    });

  };
  
  return Post;
};

// Make sure you complete other models fields