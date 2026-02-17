module.exports = (sequelize, DataTypes) => {
  const BoardRole = sequelize.define(
    'BoardRole',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      label: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'board_roles',
      timestamps: true,
      underscored: true,
    }
  );
  return BoardRole;
};
