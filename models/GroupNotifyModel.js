module.exports = (sequelize, type) => {
    return sequelize.define('person_group', {
      person_id: {
        type: type.INTEGER,
        allowNull: false
      },
      group_id: {
        type: type.INTEGER,
        allowNull: false
      },
      notification: {
        type: type.INTEGER,
        allowNull: false
      }
    }, {
      freezeTableName: true
    });
  };