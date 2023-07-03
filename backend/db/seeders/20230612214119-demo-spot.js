'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async(queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "321 Fake Street",
        city: "Houston",
        state: "Texas",
        country: "United States of America",
        lat: 29.749907,
        lng: -95.358421,
        name: "Teahouse",
        description: "This is a fake house",
        price: 112
      },
      {
        ownerId: 1,
        address: "452 Champions Drive",
        city: "Dallas",
        state: "Texas",
        country: "United States of America",
        lat: 32.7767,
        lng: 96.7970,
        name: "Champions House",
        description: "The House of Champions",
        price: 149
      },
      {
        ownerId: 2,
        address: "948 Wintermelon Road",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 34.052235,
        lng: -118.243683,
        name: "The Boba Guys",
        description: "The guys that make boba",
        price: 200
      },
      {
        ownerId: 2,
        address: "753 Cool Avenue",
        city: "Chicago",
        state: "Illinois",
        country: "United States of America",
        lat: 41.881832,
        lng: -87.623177,
        name: "Windy Towers",
        description: "The towers that are windy",
        price: 187
      },
      {
        ownerId: 3,
        address: "947 Bottom Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.773972,
        lng: -122.431297,
        name: "Summoners Rift",
        description: "A place where champions fight",
        price: 444
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

  down: async(queryInterface, Sequelize) => {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
