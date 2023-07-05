'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async(queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1125517878268006582/teahouse_spotimage.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1125880180406243368/1.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1125880180779524136/2.jpg',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1125880181081505823/3.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1125881243750375527/preview.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1125517878268006582/teahouse_spotimage.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1125517878268006582/teahouse_spotimage.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1125517878268006582/teahouse_spotimage.jpg',
        preview: true
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
