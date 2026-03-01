module.exports = (sequelize, DataTypes) => {
  const Partner = sequelize.define(
    'Partner',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {

        type: DataTypes.STRING(255),
        allowNull: true,
      },
      logoText: {

        type: DataTypes.STRING(255),
      },
      logoUrl: {
        type: DataTypes.TEXT,
      },
      websiteUrl: {

        type: DataTypes.STRING(500),
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
      tableName: 'partners',
      timestamps: true,
      underscored: true,
    }
  );

  return Partner;
};

