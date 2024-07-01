const { Sequelize, DataTypes } = require('sequelize');

// Init
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database/mydb.db', 
});

// Models
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Entry = sequelize.define('Entry', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

// Relations
User.hasMany(Entry);
Entry.belongsTo(User);

// Sync with db
(async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log('Database synchronized!');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})();

module.exports = {
  sequelize, 
  User,      
  Entry,    
};
