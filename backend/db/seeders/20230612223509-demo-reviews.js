'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async(queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        review: "tea is mid",
        stars: 3
      },
      {
        userId: 2,
        spotId: 1,
        review: "dummy review",
        stars: 4
      },
      {
        userId: 1,
        spotId: 2,
        review: "fake review 2",
        stars: 4
      },
      {
        userId: 2,
        spotId: 3,
        review: "fake review 3",
        stars: 4
      },
      {
        userId: 2,
        spotId: 4,
        review: "fake review 4",
        stars: 5
      },
      {
        userId: 3,
        spotId: 5,
        review: "fake review 5",
        stars: 5
      },
    ], {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
