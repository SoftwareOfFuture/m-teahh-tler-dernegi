module.exports = (sequelize, DataTypes) => {
  const AiBlogTask = sequelize.define(
    'AiBlogTask',
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
      publishAt: {
        // When to generate/publish (UTC timestamp)
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        // scheduled | running | published | failed
        type: DataTypes.STRING(32),
        defaultValue: 'scheduled',
      },
      lastError: {
        type: DataTypes.TEXT,
      },
      settingsJson: {
        // Optional JSON string: { language, tone, maxWords, keywords, coverImageUrl }
        type: DataTypes.TEXT,
      },
      generatedPostId: {
        type: DataTypes.INTEGER,
      },
      startedAt: {
        type: DataTypes.DATE,
      },
      finishedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'ai_blog_tasks',
      timestamps: true,
      underscored: true,
    }
  );
  return AiBlogTask;
};

