const express = require('express');
const router = express.Router();
const { getGigs, createGig, deleteGig } = require('../controllers/gigController');
const auth = require('../middleware/auth');

router.get('/', getGigs);
router.post('/', auth, createGig);
router.delete('/:id', auth, deleteGig);

module.exports = router;
