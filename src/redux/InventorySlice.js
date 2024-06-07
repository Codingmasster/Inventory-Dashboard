import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (filters, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/inventory", { params: filters });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data || error.message);
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default inventorySlice.reducer;
