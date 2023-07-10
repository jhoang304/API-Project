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
        spotId: 3,
        review: "Their handmade boba is so good, but they put too much ice in their drinks",
        stars: 4
      },
      {
        userId: 1,
        spotId: 4,
        review: "Great variety of milk teas",
        stars: 4
      },
      {
        userId: 2,
        spotId: 1,
        review: "Their milk tea is pretty good, but I have had better",
        stars: 3
      },
      {
        userId: 3,
        spotId: 2,
        review: "Their house coffee is so delicious",
        stars: 5
      },
      {
        userId: 1,
        spotId: 5,
        review: "I think Xing Fu Tang makes better boba",
        stars: 3
      },
      {
        userId: 2,
        spotId: 6,
        review: "You can never go wrong with the Lemon Honey Green Tea",
        stars: 4
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
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
