'use strict';
module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define('Order', {
    // role_name: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     }
  });

  // create association between user and role
  // a can have many users
  Order.associate = function(models) {
    models.Order.belongsTo(models.Account, {
        onDelete: "CASCADE",
        foreignKey: {
          allowNull: false
        }
      });
  };
  
  return Order;
};
 
 