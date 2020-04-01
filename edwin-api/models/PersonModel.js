module.exports = (sequelize, type) => {
    return sequelize.define('person', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstname: {
        type: type.STRING,
        allowNull: true,
      },
      lastname: {
        type: type.STRING,
        allowNull: true,
      },
      email: {
        type: type.STRING,
        allowNull: false,
      },
      password: {
        type: type.STRING,
        allowNull: false,
      },
    }, {
      freezeTableName: true
    });
  };