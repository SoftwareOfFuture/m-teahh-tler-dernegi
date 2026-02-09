module.exports = (sequelize, DataTypes) => {
  const SiteSettings = sequelize.define(
    'SiteSettings',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      facebookUrl: {
        type: DataTypes.STRING(500),
      },
      instagramUrl: {
        type: DataTypes.STRING(500),
      },
      twitterUrl: {
        type: DataTypes.STRING(500),
      },
      youtubeUrl: {
        type: DataTypes.STRING(500),
      },
      linkedinUrl: {
        type: DataTypes.STRING(500),
      },
      promoVideoUrl: {
        type: DataTypes.STRING(1000),
      },
    },
    {
      tableName: 'site_settings',
      timestamps: true,
      underscored: true,
    }
  );
  return SiteSettings;
};
