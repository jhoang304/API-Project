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

// Create a Spot
router.post('/', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const errors = {};
  if (!address) errors.address = "Street address is required";
  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";
  if (!country) errors.country = "Country is required";
  if (!lat || isNaN(lat)) errors.lat = "Latitude is not valid";
  if (!lng || isNaN(lng)) errors.lng = "Longitude is not valid";
  if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
  if (!description) errors.description = "Description is required";
  if (!price || price < 1) errors.price = "Price per day is required";

  if (Object.keys(errors).length > 0) {
      return res.status(400).json({
          message: "Bad Request",
          errors
      });
  }

  const newSpot = await Spot.create({
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
  })

  return res.status(201).json(newSpot);
});




module.exports = router;
