const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db'
});

const users = require('./modules/users')(sequelize);
const crates = require('./modules/crates')(sequelize);
const crateMarket = require('./modules/crateMarket')(sequelize);
const crateMarketHist = require('./modules/crateMarketHist')(sequelize);
const userCurrency = require('./modules/userCurrency')(sequelize);

// user --< crate
users.hasMany(crates, { foreignKey: 'ownerID' });
crates.belongsTo(users, { foreignKey: 'ownerID' });

// user --< market
crateMarket.belongsTo(crates, { foreignKey: 'crateID' });
crates.hasMany(crateMarket, { foreignKey: 'crateID' });
crateMarket.belongsTo(users, { foreignKey: 'sellerID' });
users.hasMany(crateMarket, { foreignKey: 'sellerID' });


// user --< market history
crateMarketHist.belongsTo(crates, { foreignKey: 'crateID' });
crates.hasMany(crateMarketHist, { foreignKey: 'crateID' });
crateMarketHist.belongsTo(users, { foreignKey: 'sellerID' });
crateMarketHist.belongsTo(users, { foreignKey: 'buyerID' });
users.hasMany(crateMarketHist, { foreignKey: 'sellerID' });
users.hasMany(crateMarketHist, { foreignKey: 'buyerID' });

// user --- currency
users.hasOne(userCurrency, { foreignKey: 'userID' });
userCurrency.belongsTo(users, { foreignKey: 'userID' });

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
  crates,
  crateMarket,
  crateMarketHist,
  userCurrency,
  initDb
};