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

//Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;
    const user = req.user.id;
    const booking = await Booking.findByPk(bookingId);

    if(!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" })
    };

    if(booking.userId !== user) {
        return res.status(403).json({
            message: "Only the user can edit their booking"
        });
    };

    if(!endDate || new Date(endDate) <= new Date(startDate)) {
        res.status(400);
        return res.json({
            message: "Bad Request",
            errors: {
              "endDate": "endDate cannot come before startDate"
            }
        });
    };

    const present = new Date();
    if (present.getTime() > new Date(booking.endDate).getTime()) {
      res.status(403);
      return res.json({
          message: "Past bookings can't be modified"
      });
    }

    const currentBookings = await Booking.findAll({
        where: {
            spotId: booking.spotId
        }
    });

    const startDateTime = new Date(startDate).getTime();
    const endDateTime = new Date(endDate).getTime();

    const conflictingBooking = currentBookings.find(booking => {
        const bookingStartDate = new Date(booking.startDate).getTime();
        const bookingEndDate = new Date(booking.endDate).getTime();

        if (bookingStartDate <= startDateTime && bookingEndDate >= startDateTime) {
            return true;
        }

        if (bookingStartDate <= endDateTime && bookingEndDate >= endDateTime) {
            return true;
        }

        return false;
    });

    if (conflictingBooking) {
        const errors = {};
        if (conflictingBooking.startDate <= startDateTime) {
            errors.startDate = "Start date conflicts with an existing booking";
        }
        if (conflictingBooking.endDate >= endDateTime) {
            errors.endDate = "End date conflicts with an existing booking";
        }

        res.status(403);
        return res.json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: errors
        });
    }

    const updatedBooking = {
        startDate,
        endDate,
        updatedAt: new Date()
    };
    await booking.update(updatedBooking);
    return res.json(booking);
});

module.exports = router;
