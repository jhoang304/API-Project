'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings";
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2023-01-02'),
        endDate: new Date('2023-01-08')
      },
      {
        spotId: 2,
        userId: 1,
        startDate: new Date('2023-02-03'),
        endDate: new Date('2023-02-09')
      },
      {
        spotId: 3,
        userId: 2,
        startDate: new Date('2023-03-04'),
        endDate: new Date('2023-03-10')
      },
      {
        spotId: 4,
        userId: 2,
        startDate: new Date('2023-04-05'),
        endDate: new Date('2023-04-11')
      },
      {
        spotId: 5,
        userId: 3,
        startDate: new Date('2023-05-06'),
        endDate: new Date('2023-05-12')
      }
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
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
