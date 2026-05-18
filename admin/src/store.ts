import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import projectsReducer from './features/projectsSlice';
import experienceReducer from './features/experienceSlice';
import educationReducer from './features/educationSlice';
import servicesReducer from './features/servicesSlice';
import profileReducer from './features/profileSlice';
import themeReducer from './features/themeSlice';
import techStackReducer from './features/techStackSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    experience: experienceReducer,
    education: educationReducer,
    services: servicesReducer,
    profile: profileReducer,
    theme: themeReducer,
    techStack: techStackReducer,
  },
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
