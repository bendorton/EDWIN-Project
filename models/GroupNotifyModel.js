module.exports = (sequelize, type) => {
    return sequelize.define('person_group', {
      person: {
        type: type.INTEGER,
        allowNull: false
      },
      group: {
        type: type.INTEGER,
        allowNull: false
      },
      notifications: {
        type: type.INTEGER,
        allowNull: false
      }
    }, {
      freezeTableName: true
    });
  };