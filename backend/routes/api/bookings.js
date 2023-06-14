const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

// Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
        where: {
            userId: userId,
            },
            include: [
                {
                    model: Spot,
                    attributes: {
                        exclude: ["description", "createdAt", "updatedAt"]
                    },
                    include: { model: SpotImage }
                },
            ],
    });

    const bookingsList = bookings.map((booking) => {
    const bookingData = booking.toJSON();
    if (bookingData.Spot) {
        bookingData.Spot.previewImage = 'none';
        const prevImg = bookingData.Spot.SpotImages.find((el) => el.preview === true);
        if (prevImg) {
        bookingData.Spot.previewImage = prevImg.url;
        }
        delete bookingData.Spot.SpotImages;
    }
    return bookingData;
    });

    res.json({ Bookings: bookingsList });
});

module.exports = router;
