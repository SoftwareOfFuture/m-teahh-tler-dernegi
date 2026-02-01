module.exports = (sequelize, DataTypes) => {
  const HomeBanner = sequelize.define(
    'HomeBanner',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      href: {
        type: DataTypes.STRING(500),
        allowNull: false,
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
      tableName: 'home_banners',
      timestamps: true,
      underscored: true,
    }
  );
  return HomeBanner;
};

