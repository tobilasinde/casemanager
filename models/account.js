'use strict';
module.exports = (sequelize, DataTypes) => {
  var Account = sequelize.define('Account', {
  });

  // create association between user and role
  // a can have many users
  Account.associate = function(models) {
    // models.Account.hasMany(models.Contact);
    // models.Account.hasMany(models.Order);
  };
  
  return Account;
};
 
 