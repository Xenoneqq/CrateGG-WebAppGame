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
crateMarket.belongsTo(crates, { foreignKey: 'crateID', as: 'crate' });
crates.hasMany(crateMarket, { foreignKey: 'crateID', as: 'marketListings' });
crateMarket.belongsTo(users, { foreignKey: 'sellerID', as: 'seller' });
users.hasMany(crateMarket, { foreignKey: 'sellerID', as: 'marketListings' });

// user --< market history
crateMarketHist.belongsTo(crates, { foreignKey: 'crateID', as: 'crate' });
crates.hasMany(crateMarketHist, { foreignKey: 'crateID', as: 'marketHistory' });
crateMarketHist.belongsTo(users, { foreignKey: 'sellerID', as: 'seller' });
crateMarketHist.belongsTo(users, { foreignKey: 'buyerID', as: 'buyer' });
users.hasMany(crateMarketHist, { foreignKey: 'sellerID', as: 'sales' });
users.hasMany(crateMarketHist, { foreignKey: 'buyerID', as: 'purchases' });

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