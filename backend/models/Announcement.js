module.exports = (sequelize, DataTypes) => {
  const Announcement = sequelize.define('Announcement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      // e.g. AMD-2026-68
      type: DataTypes.STRING(100),
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.TEXT,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.TEXT,
    },
    publishDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    eventDate: {
      type: DataTypes.DATEONLY,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'announcements',
    timestamps: true,
    underscored: true,
  });
  return Announcement;
};
