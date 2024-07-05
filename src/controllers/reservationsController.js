const Reservation = require('../model/reservationModel');

exports.searchTable = async (req, res) => {
    try {
        const { users, date, time } = req.query;

        // prepare data
        const reservationTime = new Date(`${date}T${time}Z`);
        const reservationUsers = users.split(',').map(tmpUser => {
            return tmpUser.trim();
        });
        const startTime = new Date(reservationTime);
        const endTime = new Date(reservationTime);
        startTime.setHours(startTime.getHours() - 2);
        endTime.setHours(endTime.getHours() + 2);
        const startTimeStr = startTime.toISOString();
        const endTimeStr = endTime.toISOString();

        // check availability for the given time and users
        const availability = await Reservation.checkReservationAvailability(reservationUsers, startTimeStr, endTimeStr);
        // if users are available, proceed to get the restaurants with available tables
        if (availability) {
            const numberOfSeats = reservationUsers.length;
            const restaurants = await Reservation.getRestaurantsWithAvailabeTables(reservationUsers, startTimeStr, endTimeStr, numberOfSeats);

            // process the returned data
            const tablesByRestaurant = {};
            restaurants.forEach(restaurant => {
                const { restaurant_name, table_id, seats } = restaurant;
                if (!tablesByRestaurant[restaurant_name]) {
                    tablesByRestaurant[restaurant_name] = [];
                }
                tablesByRestaurant[restaurant_name].push({ table_id, seats });
            });

            res.status(200).json({
                status: 'success',
                data: {
                    tablesByRestaurant
                }
            });
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'Users are not available at the given time. Please try a different time.'
            });
        }

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err
        });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { users, date, time, tableId } = req.body;

        // prepare data
        const reservationTime = new Date(`${date}T${time}Z`);
        const reservationUsers = users.map(tmpUser => {
            return tmpUser.trim();
        });
        const startTime = new Date(reservationTime);
        const endTime = new Date(reservationTime);
        startTime.setHours(startTime.getHours() - 2);
        endTime.setHours(endTime.getHours() + 2);
        const startTimeStr = startTime.toISOString();
        const endTimeStr = endTime.toISOString();

        // check users availability
        const availability = await Reservation.checkReservationAvailability(reservationUsers, startTimeStr, endTimeStr);
        if (!availability) {
            res.status(400).json({
                status: 'fail',
                message: 'Users are not available at the given time. Please try a different time.'
            });
            return;
        }

        // check if the table is available
        const tableAvailability = await Reservation.checkTableAvailability(tableId, startTimeStr, endTimeStr);
        if (!tableAvailability) {
            res.status(400).json({
                status: 'fail',
                message: 'Table is not available at the given time. Please try a different time.'
            });
            return;
        }

        // create reservation
        const reservation = await Reservation.createReservation(tableId, reservationTime.toISOString(), reservationUsers);
        res.status(201).json({
            status: 'success',
            data: {
                reservation
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err
        });
    }

};

exports.cancelReservation = async (req, res) => {
    try {
        const { reservationId } = req.body;
        const status = await Reservation.cancelReservation(reservationId);
        if (status) {
            res.status(200).json({
                status: 'success',
                message: 'Reservation has been cancelled.'
            });
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'Reservation could not be cancelled. Please try again.'
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err
        });
    }
};