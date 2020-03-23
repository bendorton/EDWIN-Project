module.exports = (sequelize, type) => {
    return sequelize.define('person', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: type.STRING,
        allowNull: false,
      },
      lastName: {
        type: type.STRING,
        allowNull: false,
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