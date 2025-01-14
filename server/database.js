const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db'
});

const users = require('./modules/users')(sequelize);

const initDb = async () => {
  try {
      await sequelize.authenticate(); // check connecton
      console.log('Connection has been created successfully.');
      await sequelize.sync({alter: true}); // creates database
  } catch (error) {
      console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  users,
  initDb
};