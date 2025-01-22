const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
  const crates = sequelize.define('crates',{
    id: {
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    crateAssetID: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    name:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    rarity:{
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    patternIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ownerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    }
  })

  return crates;
}

// common - 0
// rare - 1
// legendary - 2