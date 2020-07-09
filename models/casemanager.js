'use strict';
module.exports = (sequelize, DataTypes) => {
  var Casemanager = sequelize.define('Casemanager', {
      case_type: {
        type: DataTypes.ENUM('Support', 'Request')
      },
      case_number: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('New', 'On Hold', 'Escalated', 'Working', 'Closed'),
        defaultValue: 'New'
      },
      priority: {
        type: DataTypes.ENUM('High', 'Medium', 'Low'),
      },
      case_origin: {
        type: DataTypes.ENUM('Web', 'Email'),
        defaultValue: 'Web'
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_name: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      contact_email: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      account_number: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      assigned_to: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      response_status: {
        type: DataTypes.ENUM('Awaiting Business Reply', 'Completed'),
        defaultValue: 'Awaiting Business Reply'
      },
      request_type: {
        type: DataTypes.ENUM('Issues', 'Complaints')
      },
      description: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      document: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      note: {
      type: DataTypes.STRING,
      allowNull: false,
      },
      CurrentBusinessId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      },
      DepartmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      },
      UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      } 
  });
  
  // create post association
  // a post will have a user
  // a field called UserId will be created in our post table inside the db
  Casemanager.associate = function (models) {
    
    models.Casemanager.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
    
    models.Casemanager.belongsTo(models.Department, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
    
    models.Casemanager.belongsTo(models.CurrentBusiness, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
    
    // models.Casemanager.hasMany(models.Comment);
        
  };
  
  return Casemanager;
};

// Make sure you complete other models fields