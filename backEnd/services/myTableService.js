const Model = require("../models");

const getRecordsWithPagination = async (page = 1, limit = 30) => {
  const offset = (page - 1) * limit;
  const records = await Model.my_table.findAll({
    limit,
    offset,
  });
  return records;
};

async function runSearch(searchTerm) {
  try {
    const results = await Model.my_table.searchByFirstname(searchTerm);
    console.log(results);
    return results;
  } catch (error) {
    console.error("Error fetching records:", error);
  }
}

module.exports = {
  getRecordsWithPagination,
  runSearch,
};
