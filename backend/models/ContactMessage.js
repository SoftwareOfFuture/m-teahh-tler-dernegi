module.exports = (sequelize, DataTypes) => {
  const ContactMessage = sequelize.define(
    'ContactMessage',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      source: {
        type: DataTypes.STRING(64),
        defaultValue: 'iletisim',
      },
      status: {
        type: DataTypes.STRING(32),
        defaultValue: 'new',
      },
    },
    {
      tableName: 'contact_messages',
      timestamps: true,
      underscored: true,
    }
  );
  return ContactMessage;
};
