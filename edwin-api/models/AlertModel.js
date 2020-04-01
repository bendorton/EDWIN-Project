module.exports = (sequelize, type) => {
    return sequelize.define('alert', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      camera_id: {
        type: type.INTEGER,
        allowNull: false,
      },
      alert_status: {
        type: type.STRING,
        allowNull: false,
      },
      alert_type: {
        type: type.STRING,
        allowNull: false,
      },
      message: {
        type: type.STRING,
        allowNull: true,
      },
      filepath: {
        type: type.STRING,
        allowNull: true,
      }
    }, {
      freezeTableName: true
    });
  };