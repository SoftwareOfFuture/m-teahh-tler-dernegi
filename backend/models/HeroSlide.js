module.exports = (sequelize, DataTypes) => {
  const HeroSlide = sequelize.define(
    'HeroSlide',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      imageUrl: {
        type: DataTypes.STRING(500),
      },
      href: {
        type: DataTypes.STRING(500),
      },
      dateText: {
        type: DataTypes.STRING(100),
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
      tableName: 'hero_slides',
      timestamps: true,
      underscored: true,
    }
  );
  return HeroSlide;
};

