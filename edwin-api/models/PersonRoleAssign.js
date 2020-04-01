module.exports = (sequelize, type) => {
    return sequelize.define('person_role_assign', {
      person_id: {
        type: type.INTEGER,
        allowNull: false
      },
      role: {
        type: type.INTEGER,
        allowNull: false
      }
    }, {
      freezeTableName: true
    });
  };