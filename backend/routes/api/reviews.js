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

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const user = req.user.id;
    const review = await Review.findByPk(reviewId);
    const revImgs = await ReviewImage.findAll();

    if(!review) {
        res.status(404);
        return res.json({ message: "Review couldn't be found" });
    };
    if(user !== review.userId) {
        res.status(403);
        return res.json({ message: "Only the owner can add images to this review" });
    };
    if(revImgs.length >= 10) {
        res.status(403);
        return res.json({ "message": "Maximum number of images for this resource was reached" });
    }

    const newRevImg = await ReviewImage.create({
        reviewId,
        url
    });

    const newImg = await ReviewImage.findOne({
        where: { id: newRevImg.id },
        attributes: ['id', 'url']
    })

    return res.json(newImg)
});

module.exports = router;