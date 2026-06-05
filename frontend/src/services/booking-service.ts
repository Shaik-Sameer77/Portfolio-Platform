import api from './proxy';

export interface AvailabilitySlot {
  id?: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export interface BlockedDate {
  id?: number;
  date: string;
  reason?: string;
}

export interface Appointment {
  id?: number;
  appointmentType: string;
  status?: string;
  clientName: string;
  clientEmail: string;
  clientMobile: string;
  clientCompany?: string;
  clientMessage?: string;
  scheduledAt: string;
  duration: number;
  timezone: string;
  meetingUrl?: string;
  createdAt?: string;
}

export const bookingService = {
  // Public
  getAvailability: async (date: string, timezone: string): Promise<string[]> => {
    const response = await api.get('/appointments/availability', { params: { date, timezone } });
    return response.data;
  },

  createAppointment: async (data: Appointment): Promise<Appointment> => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  // Admin
  getAllAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments');
    return response.data;
  },

  updateAppointmentStatus: async (id: number, status: string, adminNotes?: string, cancelReason?: string) => {
    const response = await api.patch(`/appointments/${id}/status`, { status, adminNotes, cancelReason });
    return response.data;
  },

  getSlots: async (): Promise<AvailabilitySlot[]> => {
    const response = await api.get('/appointments/slots');
    return response.data;
  },

  createSlot: async (data: AvailabilitySlot) => {
    const response = await api.post('/appointments/slots', data);
    return response.data;
  },

  deleteSlot: async (id: number) => {
    const response = await api.delete(`/appointments/slots/${id}`);
    return response.data;
  },

  getBlockedDates: async (): Promise<BlockedDate[]> => {
    const response = await api.get('/appointments/blocked-dates');
    return response.data;
  },

  createBlockedDate: async (data: BlockedDate) => {
    const response = await api.post('/appointments/blocked-dates', data);
    return response.data;
  },

  deleteBlockedDate: async (id: number) => {
    const response = await api.delete(`/appointments/blocked-dates/${id}`);
    return response.data;
  }
};
