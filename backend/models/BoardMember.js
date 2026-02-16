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
        // birim / pozisyon
        type: DataTypes.STRING(255),
      },
      imageUrl: {
        type: DataTypes.TEXT,
      },
      role: {
        // 'baskan' | 'uyelik' - başkan en üstte, üyeler altta
        type: DataTypes.STRING(50),
        defaultValue: 'uyelik',
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
