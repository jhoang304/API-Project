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
        res.status(500)
        return res.json({ error: 'Internal Server Error' });
    }
});

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;

    const reviews = await Review.findAll({
        where: { spotId: spotId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    const findSpot = await Spot.findByPk(spotId);
    if(!findSpot) {
        return res.status(404).json({message: "Spot couldn't be found"});
    };

    return res.json({Reviews: reviews});
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const spotId = parseInt(req.params.spotId);
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404);
        return res.json({ message: "Spot couldn't be found" });
    }

    if (userId !== spot.ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId: spotId,
            },
            attributes: ["spotId", "startDate", "endDate"],
    });
    res.json({ Bookings: bookings });
    } else {
        const bookings = await Booking.findAll({
            where: {
                spotId: spotId,
            },
            include: [{
                model: User,
                attributes: ["id", "firstName", "lastName"],
            },
        ],
    });
    res.json({ Bookings: bookings });
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
            res.status(404)
            return res.json({ message: "Spot couldn't be found" });
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
        res.status(500)
        return res.json({ error: 'Internal Server Error' });
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

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body;
    const { spotId } = req.params;
    const userId = req.user.id;
    const spot = await Spot.findOne({
        where: {
        id: spotId,
        ownerId: userId
        }
    });
    const findSpot = await Spot.findByPk(spotId);

    if(!findSpot) {
        res.status(404)
        return res.json({message: "Spot couldn't be found"});
    };
    if(!spot) {
        res.status(403)
        return res.json({ message: "Only the owner can add images to this spot" });
    };
    if(!url) {
        res.status(404)
        return res.json({ message: "Image is required"})
    };

    const newImg = await SpotImage.create({
        spotId,
        url,
        preview
    });

    const imgData = newImg.toJSON();
    const resData = {
        id: imgData.id,
        url: imgData.url,
        preview: imgData.preview
    };

    return res.json(resData);
});

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const { review, stars } = req.body;
    const spotId = parseInt(req.params.spotId);
    const userId = req.user.id;

    let reviewError;
    let starError;
    if (!review) reviewError = "Review text is required";
    if (!stars || stars < 1 || stars > 5) starError = "Stars must be an integer from 1 to 5";
    if(reviewError || starError) {
        res.status(400);
        return res.json({
            message: "Bad Request",
            errors: { reviewError, starError}
        });
    };

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        res.status(404);
        return res.json({ message: "Spot couldn't be found" });
    }

    const exists = await Review.findOne({
        where: {
            userId,
            spotId
        }
    });
    if (exists) {
        res.status(500);
        return res.json({ message: "User already has a review for this spot" });
    }

    const newReview = await Review.create({
        userId,
        spotId,
        review,
        stars
    });

    res.status(201);
    return res.json(newReview);
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
    });

    res.status(201)
    return res.json(newSpot);
});

// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findOne({
        where: {
            id: spotId,
            ownerId: req.user.id
        }
    });

    const realSpot = await Spot.findByPk(spotId);
    if (!realSpot) {
        res.status(404);
        return res.json({ message: "Spot couldn't be found" });
    }
    if (!spot) {
        res.status(403);
        return res.json({ message: "Only the owner can delete this spot" });
    }

    await spot.destroy();
    return res.json({ message: "Successfully deleted" });
});

// Edit a Spot
router.put('/:spotId', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { spotId } = req.params;

    const exists = await Spot.findByPk(spotId);
    const spot = await Spot.findOne({
        where: {
        id: spotId,
        ownerId: req.user.id
        }
    });

    if(!exists) {
        res.status(404);
        return res.json({message: "Spot couldn't be found"});
    };
    if(!spot) {
        res.status(403);
        return res.json({message: "Only the owner can update this spot"});
    };

    const errors = {};
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (!lat || isNaN(lat)) errors.lat = "Latitude is not valid";
    if (!lng || isNaN(lng)) errors.lng = "Longitude is not valid";
    if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
    if (!description) errors.description = "Description is required";
    if (!price) errors.price = "Price per day is required";

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        });
    };

    const updatedSpot = {
        address,
        city,
        country,
        state,
        lat,
        lng,
        name,
        description,
        price,
        updatedAt: new Date()
    };

    await spot.update(updatedSpot);

    return res.json(spot);
});


module.exports = router;
