const express = require('express');
const router = express.Router();
const { Op } = require('sequelize')
const { requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

//Get all Spots owned by Current User
router.get('/current', requireAuth, async (req, res) => {
  try {
    const id = req.user.id;
    const spots = await Spot.findAll({
      where: { ownerId: id },
      include: [
        { model: Review },
        { model: SpotImage }
      ]
    });

    const spotsList = spots.map(spot => {
      const spotData = spot.toJSON();
      const sum = spotData.Reviews.reduce((total, review) => total + review.stars, 0);
      spotData.avgRating = sum / spotData.Reviews.length;
      delete spotData.Reviews;

      spotData.previewImage = 'none';
      const prevImg = spotData.SpotImages.find(el => el.preview === true);
      if (prevImg) {
        spotData.previewImage = prevImg.url;
      }
      delete spotData.SpotImages;

      return spotData;
    });

    const result = { Spots: spotsList };
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
  try {
    const { spotId } = req.params;
    const item = await Spot.findOne({
      where: { id: spotId },
      include: [
        { model: Review },
        {
          model: SpotImage,
          attributes: {
            exclude: ['spotId', 'createdAt', 'updatedAt']
          }
        }
      ]
    });

    if (!item) {
      return res.status(404).json({
        message: "Spot couldn't be found"
      });
    }

    let spot = item.toJSON();

    spot.numReviews = spot.Reviews.length;

    const sum = spot.Reviews.reduce((total, review) => total + review.stars, 0);
    spot.avgStarRating = sum / spot.Reviews.length;
    delete spot.Reviews;

    const imgHolder = spot.SpotImages;
    delete spot.SpotImages;
    spot.SpotImages = imgHolder;

    spot.Owner = await User.findByPk(spot.ownerId, {
      attributes: ['id', 'firstName', 'lastName']
    });

    return res.json(spot);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get All Spots
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
