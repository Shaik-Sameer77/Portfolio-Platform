import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import projectsReducer from './features/projectsSlice';
import experienceReducer from './features/experienceSlice';
import educationReducer from './features/educationSlice';
import certificationReducer from './features/certificationSlice';
import servicesReducer from './features/servicesSlice';
import profileReducer from './features/profileSlice';
import themeReducer from './features/themeSlice';
import techStackReducer from './features/techStackSlice';
import productsReducer from './features/productsSlice';
import appointmentReducer from './features/appointmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    experience: experienceReducer,
    education: educationReducer,
    certification: certificationReducer,
    services: servicesReducer,
    profile: profileReducer,
    theme: themeReducer,
    techStack: techStackReducer,
    products: productsReducer,
    appointments: appointmentReducer,
  },
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
