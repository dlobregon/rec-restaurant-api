const request = require('supertest');
const express = require('express');
const reservationRouter = require('../../src/routes/reservationsRouter');
const app = express();

app.use(express.json());
app.use('/api/reservations', reservationRouter);


jest.mock('../../src/model/reservationModel.js', () => ({
    checkReservationAvailability: jest.fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true),
    getRestaurantsWithAvailabeTables: jest.fn()
        .mockResolvedValue(
            [
                { restaurant_name: 'u.to.pi.a', table_id: 36, seats: 2 }
            ]
        ),
    checkTableAvailability: jest.fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false),
    createReservation: jest.fn()
        .mockResolvedValueOnce(1),
    cancelReservation: jest.fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false),
}));

describe('Reservation Controller', () => {
    describe('GET to /api/reservations/search', () => {
        it('should return a list of restaurant with available tables', async () => {
            const newReservation = {
                users: 'Maeby',
                date: '2024-07-07',
                time: '08:00:00'
            };
            const response = await request(app)
                .get('/api/reservations/search')
                .query(newReservation);

            // checking the response
            expect(response.statusCode).toBe(200);
            expect(response?.body).toEqual({
                status: 'success',
                data: {
                    tablesByRestaurant: {
                        'u.to.pi.a': [
                            { table_id: 36, seats: 2 }
                        ]
                    }
                }
            });

        });
        it('should return an error message when users aren not available', async () => {
            const newReservation = {
                users: 'Maeby',
                date: '2024-07-07',
                time: '08:00:00'
            };
            const response = await request(app)
                .get('/api/reservations/search')
                .query(newReservation);

            // checking the response
            expect(response.statusCode).toBe(400);
            expect(response?.body).toEqual({
                status: 'fail',
                message: 'Users are not available at the given time. Please try a different time.'
            });
        })
    });

    describe('POST to /api/reservations/create', () => {
        it('should create a new reservation', async () => {
            const newReservation = {
                users: ['Maeby'],
                date: '2024-07-07',
                time: '08:00:00',
                tableId: 36
            };
            const response = await request(app)
                .post('/api/reservations/create')
                .send(newReservation);

            // checking the response
            expect(response.statusCode).toBe(201);
            expect(response?.body).toEqual({
                status: 'success',
                data: {
                    reservation: 1
                }
            });
        });
        it('should return an error message when user is not available', async () => {
            const newReservation = {
                users: ['Maeby'],
                date: '2024-07-07',
                time: '08:00:00',
                tableId: 36
            };

            const response = await request(app)
                .post('/api/reservations/create')
                .send(newReservation);

            // checking the response
            expect(response.statusCode).toBe(400);
            expect(response?.body).toEqual({
                status: 'fail',
                message: 'Users are not available at the given time. Please try a different time.'
            });

        });
        it('should return an error message when table is not available', async () => {
            const newReservation = {
                users: ['Maeby'],
                date: '2024-07-07',
                time: '08:00:00',
                tableId: 36
            };

            const response = await request(app)
                .post('/api/reservations/create')
                .send(newReservation);

            // checking the response
            expect(response.statusCode).toBe(400);
            expect(response?.body).toEqual({
                status: 'fail',
                message: 'Table is not available at the given time. Please try a different time.'
            });
        });
    });

    describe('POST to /api/reservations/cancel', () => {
        it('should cancel a reservation', async () => {
            const newReservation = {
                reservationId: 1
            };
            const response = await request(app)
                .post('/api/reservations/cancel')
                .send(newReservation);

            // checking the response
            expect(response.statusCode).toBe(200);
            expect(response?.body).toEqual({
                status: 'success',
                message: 'Reservation has been cancelled.'
            });
        });
        it('should return an error message when reservation could not be cancelled', async () => {
            const newReservation = {
                reservationId: 1
            };
            const response = await request(app)
                .post('/api/reservations/cancel')
                .send(newReservation);

            // checking the response
            expect(response.statusCode).toBe(400);
            expect(response?.body).toEqual({
                status: 'fail',
                message: 'Reservation could not be cancelled. Please try again.'
            });
        });
    });
});
