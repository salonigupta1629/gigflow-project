const express = require('express');
const router = express.Router();
const { submitBid, getBidsForGig, hireFreelancer } = require('../controllers/bidController');
const auth = require('../middleware/auth');

router.post('/', auth, submitBid);
router.get('/:gigId', auth, getBidsForGig);
router.patch('/:bidId/hire', auth, hireFreelancer);

module.exports = router;
