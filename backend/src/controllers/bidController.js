const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const mongoose = require('mongoose');

const submitBid = async (req, res) => {
    try {
        const { gigId, message, price } = req.body;
        
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ error: 'Gig not found' });
        }
        
        if (gig.status !== 'open') {
            return res.status(400).json({ error: 'Gig is not open for bidding' });
        }
        
        const existingBid = await Bid.findOne({ 
            gigId, 
            freelancerId: req.user.userId 
        });
        
        if (existingBid) {
            return res.status(400).json({ error: 'You have already bid on this gig' });
        }
        
        const bid = new Bid({
            gigId,
            message,
            price,
            freelancerId: req.user.userId
        });
        
        await bid.save();
        
        await bid.populate('freelancerId', 'name email');
        res.status(201).json(bid);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getBidsForGig = async (req, res) => {
    try {
        const { gigId } = req.params;
        
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ error: 'Gig not found' });
        }
        
        if (gig.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const bids = await Bid.find({ gigId })
            .populate('freelancerId', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(bids);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const hireFreelancer = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { bidId } = req.params;
        
        const bid = await Bid.findById(bidId).session(session);
        if (!bid) throw new Error('Bid not found');
        
        const gig = await Gig.findById(bid.gigId).session(session);
        
        if (gig.ownerId.toString() !== req.user.userId) {
            throw new Error('Unauthorized');
        }
        
        if (gig.status !== 'open') {
            throw new Error('Gig already assigned');
        }
        
        const lockedGig = await Gig.findOneAndUpdate(
            { _id: gig._id, status: 'open' },
            { status: 'assigned' },
            { new: true, session }
        );
        
        if (!lockedGig) {
            throw new Error('Gig already assigned or not found');
        }
        
        bid.status = 'hired';
        await bid.save({ session });
        
        await Bid.updateMany(
            { 
                gigId: gig._id, 
                _id: { $ne: bidId },
                status: 'pending'
            },
            { status: 'rejected' },
            { session }
        );
        
        await session.commitTransaction();
        
        res.json({ 
            message: 'Freelancer hired successfully',
            gig: lockedGig,
            hiredBid: bid
        });
        
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ error: error.message });
    } finally {
        session.endSession();
    }
};

module.exports = { submitBid, getBidsForGig, hireFreelancer };
