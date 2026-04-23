import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import projectsReducer from './features/projectsSlice';
import skillsReducer from './features/skillsSlice';
import experienceReducer from './features/experienceSlice';
import educationReducer from './features/educationSlice';
import servicesReducer from './features/servicesSlice';
import profileReducer from './features/profileSlice';
import themeReducer from './features/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    skills: skillsReducer,
    experience: experienceReducer,
    education: educationReducer,
    services: servicesReducer,
    profile: profileReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
