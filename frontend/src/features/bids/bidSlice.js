import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const submitBid = createAsyncThunk(
  'bids/submitBid',
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://gigflow-api-ijxi.onrender.com/api/bids',
        bidData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to submit bid'
      );
    }
  }
);

export const fetchBidsForGig = createAsyncThunk(
  'bids/fetchBidsForGig',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://gigflow-api-ijxi.onrender.com/api/bids/${gigId}`,
        { withCredentials: true }
      );
      return { gigId, bids: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch bids'
      );
    }
  }
);

export const hireFreelancer = createAsyncThunk(
  'bids/hireFreelancer',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `https://gigflow-api-ijxi.onrender.com/api/bids/${bidId}/hire`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to hire freelancer'
      );
    }
  }
);


const bidSlice = createSlice({
  name: 'bids',
  initialState: {
    bidsByGig: {}, 
    loading: false,
    error: null,
    hiring: false,
  },
  reducers: {
    clearBidError: (state) => {
      state.error = null;
    },
    addBid: (state, action) => {
      const { gigId, bid } = action.payload;
      if (!state.bidsByGig[gigId]) {
        state.bidsByGig[gigId] = [];
      }
      state.bidsByGig[gigId].push(bid);
    },
    clearBidsForGig: (state, action) => {
      delete state.bidsByGig[action.payload];
    },
  },
  extraReducers: (builder) => {
    
    builder
      .addCase(submitBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitBid.fulfilled, (state, action) => {
        state.loading = false;
        const bid = action.payload;
        const gigId = bid.gigId;
        
        if (!state.bidsByGig[gigId]) {
          state.bidsByGig[gigId] = [];
        }
        state.bidsByGig[gigId].push(bid);
      })
      .addCase(submitBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      .addCase(fetchBidsForGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBidsForGig.fulfilled, (state, action) => {
        state.loading = false;
        const { gigId, bids } = action.payload;
        state.bidsByGig[gigId] = bids;
      })
      .addCase(fetchBidsForGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
      .addCase(hireFreelancer.pending, (state) => {
        state.hiring = true;
        state.error = null;
      })
      .addCase(hireFreelancer.fulfilled, (state, action) => {
        state.hiring = false;
        const { gig, hiredBid } = action.payload;
        
        
        if (state.bidsByGig[gig._id]) {
          state.bidsByGig[gig._id] = state.bidsByGig[gig._id].map(bid => {
            if (bid._id === hiredBid._id) {
              return { ...bid, status: 'hired' };
            } else if (bid.status === 'pending') {
              return { ...bid, status: 'rejected' };
            }
            return bid;
          });
        }
      })
      .addCase(hireFreelancer.rejected, (state, action) => {
        state.hiring = false;
        state.error = action.payload;
      });
  },
});

export const { clearBidError, addBid, clearBidsForGig } = bidSlice.actions;
export default bidSlice.reducer;
