module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'Event',
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
      dateText: {
        type: DataTypes.STRING(100),
      },
      eventDate: {
        type: DataTypes.DATEONLY,
      },
      location: {
        type: DataTypes.STRING(255),
      },
      color: {
        type: DataTypes.STRING(32),
        defaultValue: 'burgundy',
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'events',
      timestamps: true,
      underscored: true,
    }
  );

  return Event;
};

