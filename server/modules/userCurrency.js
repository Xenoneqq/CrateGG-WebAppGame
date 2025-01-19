const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
  const userCurrency = sequelize.define('userCurrency',{
    userID: {
      type:DataTypes.INTEGER,
      primaryKey: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 250,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  })

  return userCurrency;
}