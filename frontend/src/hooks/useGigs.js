import { useSelector, useDispatch } from 'react-redux';
import {
  fetchGigs,
  createGig,
  fetchGigById,
  setSearchQuery,
  clearGigError,
} from '../features/gigs/gigSlice';

export const useGigs = () => {
  const dispatch = useDispatch();
  const { gigs, currentGig, loading, error, searchQuery } = useSelector(
    (state) => state.gigs
  );

  return {
    gigs,
    currentGig,
    loading,
    error,
    searchQuery,
    fetchGigs: (search) => dispatch(fetchGigs(search)),
    createGig: (gigData) => dispatch(createGig(gigData)),
    fetchGigById: (gigId) => dispatch(fetchGigById(gigId)),
    setSearchQuery: (query) => dispatch(setSearchQuery(query)),
    clearError: () => dispatch(clearGigError()),
  };
};
