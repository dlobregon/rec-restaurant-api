const router = require('express').Router();
const reservationsController = require('../controllers/reservationsController');

router.get('/search', reservationsController.searchTable);
router.post('/create', reservationsController.createReservation);
router.post('/cancel', reservationsController.cancelReservation);

module.exports = router;