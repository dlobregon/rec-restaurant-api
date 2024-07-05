const db = require('../../db');

exports.checkReservationAvailability = async (users, startTime, endTime) => {
    try {
        const query = 'SELECT check_reservation_availability($1::text[], $2, $3) AS availability';
        const values = [users, startTime, endTime];
        const result = await db.query(query, values);
        return result.rows[0].availability;
    } catch (err) {
        throw err;
    }
};


exports.getRestaurantsWithAvailabeTables = async (users, startTime, endTime, numberOfSeats) => {
    try {
        const query = 'SELECT * from get_restaurant_tables($1::text[], $2, $3, $4)';
        const values = [users, startTime, endTime, numberOfSeats];
        const result = await db.query(query, values);
        return result.rows;
    } catch (err) {
        throw err;
    }
}

exports.checkTableAvailability = async (tableId, startTime, endTime) => {
    try {
        const query = 'SELECT table_availability($1, $2, $3) AS availability';
        const values = [tableId, startTime, endTime];
        const result = await db.query(query, values);
        return result.rows[0].availability;
    } catch (err) {
        throw err;
    }
}

exports.createReservation = async (tableId, reservationTime, users) => {
    try {
        const query = 'SELECT create_reservation_and_insert_eaters($1, $2, $3::text[]) AS reservation_id';
        const values = [tableId, reservationTime, users];
        const result = await db.query(query, values);
        return result.rows[0].reservation_id;
    } catch (err) {
        throw err;
    }
};

exports.cancelReservation = async (reservationId) => {
    try {
        const query = 'SELECT cancel_reservation($1) AS status';
        const values = [reservationId];
        const result = await db.query(query, values);
        return result.rows[0].status;
    } catch (err) {
        throw err;
    }
};    
