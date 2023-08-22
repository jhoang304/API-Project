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
        address: "5315 Cypress Creek Pkwy C",
        city: "Houston",
        state: "Texas",
        country: "United States of America",
        lat: 29.749907,
        lng: -95.358421,
        name: "Teahouse",
        description: "The Teahouse offers a chance for others to join in on their goal of delivering happiness in a cup, capitalizing on the traditional and trusted tea flavors and recipes, and the reputable brand they have built over the last two decades.",
        price: 67
      },
      {
        ownerId: 1,
        address: "2540 Old Denton Rd",
        city: "Carrollton",
        state: "Texas",
        country: "United States of America",
        lat: 32.7767,
        lng: 96.7970,
        name: "7 Leaves",
        description: "We focus on using natural elements to remind ourselves of our connection with the Earth, without sacrificing modern style. Our linear setup helps us maintain a simplistic, yet clean and attractive design.",
        price: 84
      },
      {
        ownerId: 2,
        address: "9889 Bellaire Blvd",
        city: "Houston",
        state: "Texas",
        country: "United States of America",
        lat: 34.052235,
        lng: -118.243683,
        name: "Xing Fu Tang",
        description: "Known for making the best hand crafted brown sugar boba from Taiwan, is finally here in the United States featuring an open kitchen concept where boba pearls are freshly hand-made hourly and cooked to order for all guests to see what goes into their cups.",
        price: 200
      },
      {
        ownerId: 2,
        address: "378 Santana Row",
        city: "San Jose",
        state: "California",
        country: "United States of America",
        lat: 41.881832,
        lng: -87.623177,
        name: "Boba Guys",
        description: "The guys that make boba",
        price: 70
      },
      {
        ownerId: 3,
        address: "32211 John R Rd",
        city: "Detroit",
        state: "Michigan",
        country: "United States of America",
        lat: 37.773972,
        lng: -122.431297,
        name: "Tiger Sugar",
        description: "With humble beginnings in Taichung, Taiwan, in 2017, Tiger Sugar has grown into an undisputed cult brand of Boba worldwide.",
        price: 444
      },
      {
        ownerId: 3,
        address: "301 W Parker Rd",
        city: "Plano",
        state: "Texas",
        country: "United States of America",
        lat: 37.773972,
        lng: -122.431297,
        name: "Happy Lemon",
        description: "Happy Lemon is a world-leading beverage chain founded in 2006 by the Yummy-Town Group, a publicly listed tea culture company originating in Taiwan. They are the elite pioneers who originally brought and expanded the tea culture to Mainland China and Hong Kong.",
        price: 54
      },
      {
        ownerId: 4,
        address: "414 S Western Ave",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 34.06686,
        lng: -118.30868,
        name: "Boba Bear",
        description: "Boba teas, hookah, smoothies, crêpes & light Korean bites offered at tables or in a lounge area.",
        price: 83
      },
      {
        ownerId: 4,
        address: "8055 Clairemont Mesa Blvd Ste 100",
        city: "San Diego",
        state: "California",
        country: "United States of America",
        lat: 32.83285954989467,
        lng: -117.1499956460283,
        name: "Urban Bubble",
        description: "'Yogurt Series' Urban Bubble is locally owned and operated here in San Diego. We plan on having our grand opening Fall of 2022",
        price: 49
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

  down: async(queryInterface, Sequelize) => {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
