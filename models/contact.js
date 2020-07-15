'use strict';
module.exports = (sequelize, DataTypes) => {
  var Contact = sequelize.define('Contact', {
    // role_name: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     }
  });

  // create association between user and role
  // a can have many users
  Contact.associate = function(models) {
    models.Contact.belongsTo(models.Account, {
        onDelete: "CASCADE",
        foreignKey: {
          allowNull: false
        }
      });
  };
  
  return Contact;
};
 
 