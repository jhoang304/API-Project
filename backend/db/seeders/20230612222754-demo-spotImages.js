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
        spotId: 2,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127837530344149002/1.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127837530654515261/2.jpeg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127837530985877534/3.jpeg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127838794339602443/1.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127838795195240539/preview_image.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127838794608033883/2.jpg',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127838794935173161/3.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127839849890709625/preview_image.jpeg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127839849085403187/1.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127839849387413504/2.jpeg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127839849639063673/3.jpeg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127840850198663200/preview_image.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127840849645031564/1.jpeg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127840849951195176/2.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127841771280404491/preview_image.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127841770659647599/1.jpg',
        preview: false
      },
      {
        spotId: 6,
        url: 'https://cdn.discordapp.com/attachments/320286625521336341/1127841771053928458/2.jpg',
        preview: false
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
      spotId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
