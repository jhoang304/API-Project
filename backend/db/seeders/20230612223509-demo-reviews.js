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
      {
        userId: 1,
        spotId: 7,
        review: "Love this place! Regret not knowing about it sooner. Looking forward to coming back. Music is great and speedy service creates a good ambience!",
        stars: 5
      },
      {
        userId: 2,
        spotId: 7,
        review: "A contender for the coolest place in LA -- boba + hookah + friendly service + great music.",
        stars: 5
      },
      {
        userId: 3,
        spotId: 7,
        review: "This place is an okay place to grab drinks at night. The area is a bit sketchy, and there is no in-door seating unless you're there for the hookah bar which requires ID.",
        stars: 3
      },
      {
        userId: 1,
        spotId: 8,
        review: "I LOVE URBAN BUBBLE !!!!!! the service was amazing, i asked for the roasted oolong milk tea with cheese, and this was amazing!!!! the ambiance was incredible i would totally come back.",
        stars: 5
      },
      {
        userId: 2,
        spotId: 8,
        review: "Affordable pricing, excellent service, by far one of the best boba spots in San Diego!",
        stars: 4
      },
      {
        userId: 3,
        spotId: 8,
        review: "Cute new boba spot with lots of seating and yummy milk tea! There is an online order kiosk to the right upon entering which makes it a whole lot easier to order.",
        stars: 5
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
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7] }
    }, {});
  }
};
