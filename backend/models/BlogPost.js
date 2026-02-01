module.exports = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define(
    'BlogPost',
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
      slug: {
        type: DataTypes.STRING(600),
        allowNull: false,
        unique: true,
      },
      excerpt: {
        type: DataTypes.TEXT,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      coverImageUrl: {
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
      author: {
        type: DataTypes.STRING(255),
        defaultValue: 'AI',
      },
      source: {
        // manual | ai
        type: DataTypes.STRING(32),
        defaultValue: 'ai',
      },
    },
    {
      tableName: 'blog_posts',
      timestamps: true,
      underscored: true,
    }
  );
  return BlogPost;
};

