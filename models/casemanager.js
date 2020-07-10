'use strict';
module.exports = (sequelize, DataTypes) => {
  var Casemanager = sequelize.define('Casemanager', {
      case_type: {
        type: DataTypes.ENUM('Support', 'Request')
      },
      case_number: {
      type: DataTypes.BIGINT,
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
        unique: false,
        validate: {
            isEmail: true
        }
      },
      assigned_to: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.STRING
      },
      // document: {
      // type: DataTypes.STRING,
      // allowNull: false,
      // },
      note: {
      type: DataTypes.STRING
      },
      updatedBy: {
        type: DataTypes.STRING
      }
  });
  
  // create case association
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
    models.Casemanager.hasMany(models.Casecomment);
    
    // models.Casemanager.hasMany(models.Comment);
        
  };
  
  return Casemanager;
};
