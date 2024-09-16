'use strict';
const {
  Model, Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class my_table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
     /**
     * Search records by firstname.
     * @param {string} searchTerm - The term to search for in the firstname column.
     * @returns {Promise<my_table[]>} - A promise that resolves to the search results.
     */
     static async searchByFirstname(searchTerm) {
      try {
        return await this.findAll({
          where: {
            firstname: {
              [Op.like]: `%${searchTerm}%`
            }
          }
        });
      } catch (error) {
        console.error('Error searching by firstname:', error);
        throw error;
      }
    
  }
  }
  my_table.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'my_table',
    timestamps: false,

  });
  return my_table;
};