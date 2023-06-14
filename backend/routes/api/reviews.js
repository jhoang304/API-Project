const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    const id = req.user.id;
    const reviews = await Review.findAll({
        where: { userId: id },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                },
                include: { model: SpotImage }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    const reviewsList = reviews.map(review => {
        const reviewData = review.toJSON();
        const spot = reviewData.Spot;
        spot.previewImage = 'none';
        const prevImg = spot.SpotImages.find(el => el.preview === true);
        if (prevImg) {
            spot.previewImage = prevImg.url;
        }
        delete spot.SpotImages;
        return reviewData;
    });

    return res.json({Reviews: reviewsList});
});



module.exports = router;
