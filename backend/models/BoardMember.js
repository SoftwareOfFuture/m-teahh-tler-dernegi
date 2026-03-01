module.exports = (sequelize, DataTypes) => {
  const BoardMember = sequelize.define(
    'BoardMember',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING(255),
      },
      profession: {
        type: DataTypes.STRING(255),
      },
      duty: {
        type: DataTypes.STRING(255),
      },
      residenceAddress: {
        type: DataTypes.TEXT,
      },
      imageUrl: {
        type: DataTypes.TEXT,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      boardRoleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'board_roles', key: 'id' },
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'board_members',
      timestamps: true,
      underscored: true,
    }
  );

  return BoardMember;
};
