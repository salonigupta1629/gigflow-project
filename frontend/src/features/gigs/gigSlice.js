import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchGigs = createAsyncThunk(
  'gigs/fetchGigs',
  async (search = '', { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://gigflow-api-ijxi.onrender.com/api/gigs?search=${search}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch gigs'
      );
    }
  }
);

export const createGig = createAsyncThunk(
  'gigs/createGig',
  async (gigData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://gigflow-api-ijxi.onrender.com/api/gigs',
        gigData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to create gig'
      );
    }
  }
);

export const fetchGigById = createAsyncThunk(
  'gigs/fetchGigById',
  async (gigId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://gigflow-api-ijxi.onrender.com/api/gigs`);
      const gigs = response.data;
      const gig = gigs.find(g => g._id === gigId);
      if (!gig) {
        throw new Error('Gig not found');
      }
      return gig;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch gig'
      );
    }
  }
);


const gigSlice = createSlice({
  name: 'gigs',
  initialState: {
    gigs: [],
    currentGig: null,
    loading: false,
    error: null,
    searchQuery: '',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearGigError: (state) => {
      state.error = null;
    },
    setCurrentGig: (state, action) => {
      state.currentGig = action.payload;
    },
    clearCurrentGig: (state) => {
      state.currentGig = null;
    },
    addGig: (state, action) => {
      state.gigs.unshift(action.payload);
    },
    updateGig: (state, action) => {
      const index = state.gigs.findIndex(gig => gig._id === action.payload._id);
      if (index !== -1) {
        state.gigs[index] = action.payload;
      }
      if (state.currentGig && state.currentGig._id === action.payload._id) {
        state.currentGig = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
  
    builder
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs = action.payload;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
   
      .addCase(createGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs.unshift(action.payload);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchGigById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGigById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGig = action.payload;
      })
      .addCase(fetchGigById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  clearGigError,
  setCurrentGig,
  clearCurrentGig,
  addGig,
  updateGig,
} = gigSlice.actions;

export default gigSlice.reducer;
