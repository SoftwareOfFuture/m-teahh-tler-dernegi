module.exports = (sequelize, DataTypes) => {
  const Publication = sequelize.define(
    'Publication',
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
      excerpt: {
        type: DataTypes.TEXT,
      },
      coverImageUrl: {
        type: DataTypes.STRING(500),
      },
      fileUrl: {
        type: DataTypes.STRING(500),
      },
      publishDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: 'publications',
      timestamps: true,
      underscored: true,
    }
  );
  return Publication;
};

