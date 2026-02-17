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
      profession: {
        // meslek
        type: DataTypes.STRING(255),
      },
      duty: {
        // görevi
        type: DataTypes.STRING(255),
      },
      residenceAddress: {
        // yerleşim yeri adresi
        type: DataTypes.TEXT,
      },
      imageUrl: {
        type: DataTypes.TEXT,
      },
      role: {
        // legacy: 'baskan' | 'uyelik' - used when boardRoleId is null
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
