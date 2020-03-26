module.exports = (sequelize, type) => {
    return sequelize.define('stream', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      camera_id: {
        type: type.INTEGER,
        allowNull: false,
      },
      url: {
        type: type.STRING,
        allowNull: true,
      },
      output_format: {
        type: type.STRING,
        allowNull: false,
      }
    }, {
      freezeTableName: true,
      timestamps: false
    });
  };