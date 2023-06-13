const express = require('express');
const router = express.Router();
const { Op } = require('sequelize')
const { requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

// Main Function
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        include: [
          { model: Review },
          { model: SpotImage }
        ]
      });

      const spotsList = spots.map(spot => {
        const spotData = spot.toJSON();
        const sum = spotData.Reviews.reduce((total, review) => total + review.stars, 0);
        spotData.avgRating = sum / spotData.Reviews.length || 0;

        const spotImage = spotData.SpotImages.find(image => image.url);
        spotData.previewImage = spotImage ? spotImage.url : 'no image found';

        delete spotData.Reviews;
        delete spotData.SpotImages;

        return spotData;
      });

      const result = { Spots: spotsList };
      return res.json(result);
});





module.exports = router;
