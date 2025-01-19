const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
  const crateMarketHist = sequelize.define('crateMarketHist',{
    id: {
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    crateID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'crates',
        key: 'id',
      },
    },
    sellerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    buyerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    price:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  })

  return crateMarketHist;
}