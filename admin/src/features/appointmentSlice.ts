import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export interface Appointment {
  id: number;
  type: string;
  status: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  clientMessage?: string;
  scheduledAt: string;
  duration: number;
  timezone: string;
  meetingUrl?: string;
  createdAt: string;
}

export interface AvailabilitySlot {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface BlockedDate {
  id: number;
  date: string;
  reason?: string;
}

interface AppointmentState {
  items: Appointment[];
  slots: AvailabilitySlot[];
  blockedDates: BlockedDate[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  items: [],
  slots: [],
  blockedDates: [],
  loading: false,
  error: null,
};

export const fetchAppointments = createAsyncThunk('appointments/fetchAll', async () => {
  const response = await api.get('/appointments');
  return response.data;
});

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateStatus',
  async ({ id, status, adminNotes, cancelReason }: { id: number; status: string; adminNotes?: string; cancelReason?: string }) => {
    const response = await api.patch(`/appointments/${id}/status`, { status, adminNotes, cancelReason });
    return response.data;
  }
);

export const fetchSlots = createAsyncThunk('appointments/fetchSlots', async () => {
  const response = await api.get('/appointments/slots');
  return response.data;
});

export const createSlot = createAsyncThunk('appointments/createSlot', async (data: Partial<AvailabilitySlot>) => {
  const response = await api.post('/appointments/slots', data);
  return response.data;
});

export const deleteSlot = createAsyncThunk('appointments/deleteSlot', async (id: number) => {
  await api.delete(`/appointments/slots/${id}`);
  return id;
});

export const fetchBlockedDates = createAsyncThunk('appointments/fetchBlockedDates', async () => {
  const response = await api.get('/appointments/blocked-dates');
  return response.data;
});

export const createBlockedDate = createAsyncThunk('appointments/createBlockedDate', async (data: Partial<BlockedDate>) => {
  const response = await api.post('/appointments/blocked-dates', data);
  return response.data;
});

export const deleteBlockedDate = createAsyncThunk('appointments/deleteBlockedDate', async (id: number) => {
  await api.delete(`/appointments/blocked-dates/${id}`);
  return id;
});

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Appointments
      .addCase(fetchAppointments.pending, (state) => { state.loading = true; })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch appointments';
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Slots
      .addCase(fetchSlots.fulfilled, (state, action) => { state.slots = action.payload; })
      .addCase(createSlot.fulfilled, (state, action) => { state.slots.push(action.payload); })
      .addCase(deleteSlot.fulfilled, (state, action) => {
        state.slots = state.slots.filter(s => s.id !== action.payload);
      })
      // Blocked Dates
      .addCase(fetchBlockedDates.fulfilled, (state, action) => { state.blockedDates = action.payload; })
      .addCase(createBlockedDate.fulfilled, (state, action) => { state.blockedDates.push(action.payload); })
      .addCase(deleteBlockedDate.fulfilled, (state, action) => {
        state.blockedDates = state.blockedDates.filter(b => b.id !== action.payload);
      });
  },
});

export default appointmentSlice.reducer;
