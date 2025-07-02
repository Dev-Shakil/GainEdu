"use client"
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

export const fetchDashboardData = createAsyncThunk('dashboard/fetchAll', async () => {
  const [s, c, f, e] = await Promise.all([
    axios.get(`${BASE_URL}/students`),
    axios.get(`${BASE_URL}/courses`),
    axios.get(`${BASE_URL}/faculty`),
    axios.get(`${BASE_URL}/enrollments`)
  ]);

  return {
    students: s.data,
    courses: c.data,
    faculty: f.data,
    enrollments: e.data,
  };
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    students: [],
    courses: [],
    faculty: [],
    enrollments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.students = action.payload.students;
        state.courses = action.payload.courses;
        state.faculty = action.payload.faculty;
        state.enrollments = action.payload.enrollments;
        state.loading = false;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});

export default dashboardSlice.reducer;
