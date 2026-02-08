module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define(
    'Property',
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
      address: {
        type: DataTypes.STRING(500),
      },
      price: {
        type: DataTypes.STRING(100),
      },
      description: {
        type: DataTypes.TEXT,
      },
      imageUrl: {
        type: DataTypes.TEXT,
      },
      propertyType: {
        type: DataTypes.STRING(64),
      },
      rooms: {
        type: DataTypes.STRING(32),
      },
      area: {
        type: DataTypes.STRING(32),
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
      tableName: 'properties',
      timestamps: true,
      underscored: true,
    }
  );
  return Property;
};
