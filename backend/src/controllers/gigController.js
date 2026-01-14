const Gig = require('../models/Gig');
const Bid = require('../models/Bid');

const getGigs = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { status: 'open' };
        
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        
        const gigs = await Gig.find(query).populate('ownerId', 'name email');
        res.json(gigs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createGig = async (req, res) => {
    try {
        const gig = new Gig({
            ...req.body,
            ownerId: req.user.userId
        });
        await gig.save();
        
        await gig.populate('ownerId', 'name email');
        res.status(201).json(gig);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteGig = async (req, res) => {
    try {
        const { id } = req.params;
        
        const gig = await Gig.findById(id);
        if (!gig) {
            return res.status(404).json({ error: 'Gig not found' });
        }
        
      
        if (gig.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
    
        const hiredBid = await Bid.findOne({ gigId: id, status: 'hired' });
        if (hiredBid) {
            return res.status(400).json({ error: 'Cannot delete gig with hired freelancer' });
        }
        
      
        await Bid.deleteMany({ gigId: id });
        
        await Gig.findByIdAndDelete(id);
        
        res.json({ message: 'Gig deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getGigs, createGig, deleteGig };
