module.exports = (sequelize, type) => {
    return sequelize.define('camera', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: type.STRING,
        allowNull: true,
      },
      ip_address: {
        type: type.STRING,
        allowNull: false,
      },
      group_id: {
        type: type.INTEGER,
        allowNull: false,
      },
      coordinates: {
        type: type.STRING,
        allowNull: false,
      },
      status: {
        type: type.STRING,
        allowNull: true,
      },
      camera_type: {
        type: type.STRING,
        allowNull: true,
      },
    }, {
      freezeTableName: true
    });
  };