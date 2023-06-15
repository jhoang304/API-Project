const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');

const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

// Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const user = req.user.id;
    const image = await ReviewImage.findByPk(imageId);

    if(!image) {
        res.status(404);
        return res.json({ message: "Review Image couldn't be found" });
    }

    const review = await Review.findByPk(image.reviewId);
    if(user !== review.userId) {
        res.status(403);
        return res.json({ message: "Only the user can delete the image of their review" });
    };

    await image.destroy();
    return res.json({ message: "successfully deleted" });
});

module.exports = router;
