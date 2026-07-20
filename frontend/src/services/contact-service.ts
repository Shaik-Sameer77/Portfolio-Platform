import ApiService from './api-service';

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const submitContactForm = async (data: ContactData): Promise<{ success: boolean; message: string }> => {
  return ApiService.post('/mail/contact', data);
};
