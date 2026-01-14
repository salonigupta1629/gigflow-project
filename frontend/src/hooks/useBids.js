import { useSelector, useDispatch } from 'react-redux';
import {
  submitBid,
  fetchBidsForGig,
  hireFreelancer,
  clearBidError,
  addBid,
} from '../features/bids/bidSlice';

export const useBids = () => {
  const dispatch = useDispatch();
  const { bidsByGig, loading, error, hiring } = useSelector(
    (state) => state.bids
  );

  return {
    bidsByGig,
    loading,
    error,
    hiring,
    submitBid: (bidData) => dispatch(submitBid(bidData)),
    fetchBidsForGig: (gigId) => dispatch(fetchBidsForGig(gigId)),
    hireFreelancer: (bidId) => dispatch(hireFreelancer(bidId)),
    clearError: () => dispatch(clearBidError()),
    addBid: (gigId, bid) => dispatch(addBid({ gigId, bid })),
    getBidsForGig: (gigId) => bidsByGig[gigId] || [],
  };
};
