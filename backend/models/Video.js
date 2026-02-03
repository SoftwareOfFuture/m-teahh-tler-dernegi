module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define(
    'Video',
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
      thumbnailUrl: {
        type: DataTypes.TEXT,
      },
      href: {
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
      tableName: 'videos',
      timestamps: true,
      underscored: true,
    }
  );
  return Video;
};

