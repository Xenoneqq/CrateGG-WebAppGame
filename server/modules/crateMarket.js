const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
  const crateMarket = sequelize.define('crateMarket',{
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
    price:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  })

  return crateMarket;
}